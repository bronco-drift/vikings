import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { SCENES, START_SCENE, CANONICAL_ENDINGS } from './scenes'
import type { Choice } from './types'

type HistoryEntry = {
  sceneId: string
  choiceLabel?: string
  repAfter: number
}

type GameState = {
  /** Nombre completo del personaje. "" = todavía no se ingresó el apellido. */
  nombre: string
  /** Escena actual. "" = aún no se inició el juego. */
  currentScene: string
  /** Reputación acumulada. */
  rep: number
  /** Historial de escenas visitadas + opciones elegidas. */
  history: HistoryEntry[]
  /** Si el último choice tenía `result`, esto guarda el texto a mostrar. */
  pendingResult: string | null
  /** Destino al confirmar el resultado pendiente. */
  pendingGoto: string | null

  // ---- Meta-progresión (persiste entre partidas) ----
  /** Finales canónicos descubiertos. */
  endingsDiscovered: string[]
  /** Set de IDs de escenas vistas alguna vez (para fog of war global). */
  scenesEverSeen: string[]

  // ---- Acciones ----
  setNombre: (apellido: string) => void
  start: () => void
  choose: (choice: Choice) => void
  continueAfterResult: () => void
  reset: () => void
  restart: () => void
  jumpTo: (id: string) => void

  // ---- Computado ----
  allEndingsDiscovered: () => boolean
}

const cap = (s: string) => s.trim().charAt(0).toUpperCase() + s.trim().slice(1).toLowerCase()

const markSceneSeen = (state: GameState, sceneId: string): Partial<GameState> => {
  if (state.scenesEverSeen.includes(sceneId)) return {}
  return { scenesEverSeen: [...state.scenesEverSeen, sceneId] }
}

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      nombre: '',
      currentScene: '',
      rep: 0,
      history: [],
      pendingResult: null,
      pendingGoto: null,
      endingsDiscovered: [],
      scenesEverSeen: [],

      setNombre: (apellido) => {
        const apl = cap(apellido) || 'Lothbrok'
        set({ nombre: `Ragnar ${apl}` })
      },

      start: () => {
        const scene = SCENES[START_SCENE]
        const repDelta = scene?.rep ?? 0
        set((s) => ({
          currentScene: START_SCENE,
          rep: repDelta,
          history: [{ sceneId: START_SCENE, repAfter: repDelta }],
          pendingResult: null,
          pendingGoto: null,
          ...markSceneSeen(s, START_SCENE),
        }))
      },

      choose: (choice) => {
        const { rep, history } = get()
        const newRep = rep + (choice.rep ?? 0)
        const updatedHistory = history.map((h, i) =>
          i === history.length - 1
            ? { ...h, choiceLabel: choice.label, repAfter: newRep }
            : h,
        )
        set({
          rep: newRep,
          history: updatedHistory,
          pendingResult: choice.result ?? null,
          pendingGoto: choice.goto,
        })
        if (!choice.result) get().continueAfterResult()
      },

      continueAfterResult: () => {
        const { pendingGoto, rep, history, endingsDiscovered } = get()
        if (!pendingGoto) return
        const next = SCENES[pendingGoto]
        if (!next) {
          console.warn(`[vikingos] escena destino no existe: ${pendingGoto}`)
          return
        }
        const newRep = rep + (next.rep ?? 0)
        // Si la próxima escena es un ending, lo registramos en meta-progresión.
        const newEndingsDiscovered = next.ending && !endingsDiscovered.includes(pendingGoto)
          ? [...endingsDiscovered, pendingGoto]
          : endingsDiscovered
        set((s) => ({
          currentScene: pendingGoto,
          rep: newRep,
          history: [...history, { sceneId: pendingGoto, repAfter: newRep }],
          pendingResult: null,
          pendingGoto: null,
          endingsDiscovered: newEndingsDiscovered,
          ...markSceneSeen(s, pendingGoto),
        }))
      },

      reset: () => {
        // Reset SUAVE: borra partida actual pero conserva endings descubiertos
        // y escenas vistas (meta-progresión).
        set((s) => ({
          nombre: '',
          currentScene: '',
          rep: 0,
          history: [],
          pendingResult: null,
          pendingGoto: null,
          endingsDiscovered: s.endingsDiscovered,
          scenesEverSeen: s.scenesEverSeen,
        }))
      },

      restart: () => {
        const scene = SCENES[START_SCENE]
        const repDelta = scene?.rep ?? 0
        set({
          currentScene: START_SCENE,
          rep: repDelta,
          history: [{ sceneId: START_SCENE, repAfter: repDelta }],
          pendingResult: null,
          pendingGoto: null,
        })
      },

      jumpTo: (id) => {
        if (!SCENES[id]) return
        set((s) => ({
          currentScene: id,
          pendingResult: null,
          pendingGoto: null,
          ...markSceneSeen(s, id),
        }))
      },

      allEndingsDiscovered: () => {
        const { endingsDiscovered } = get()
        return CANONICAL_ENDINGS.every((id) => endingsDiscovered.includes(id))
      },
    }),
    {
      name: 'vikingos-save',
      version: 2,
      migrate: (persisted: unknown, fromVersion: number) => {
        // v1 → v2: agregamos endingsDiscovered y scenesEverSeen
        const s = (persisted ?? {}) as Partial<GameState>
        if (fromVersion < 2) {
          return {
            ...s,
            endingsDiscovered: s.endingsDiscovered ?? [],
            scenesEverSeen: s.scenesEverSeen ?? [],
          } as GameState
        }
        return s as GameState
      },
    },
  ),
)
