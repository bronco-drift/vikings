/**
 * Chiptune engine — síntesis estilo NES vía Web Audio API.
 *
 * Dos voces:
 *   - Lead: onda cuadrada (square wave) — el "pulse" del NES
 *   - Bass: onda triangular — el canal triangle del NES (suena más redondo)
 *
 * Soporta múltiples melodías ("tracks") con switch suave (crossfade).
 * Cada región narrativa tiene su propia melodía. La selección se hace por
 * `setTrack(key)` desde el componente que sabe en qué escena estamos.
 */

const NOTE_OFFSETS: Record<string, number> = {
  C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3,
  E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8,
  A: 9, 'A#': 10, Bb: 10, B: 11,
}

function noteToFreq(name: string): number {
  const match = name.match(/^([A-G][b#]?)(-?\d+)$/)
  if (!match) return 440
  const [, letter, octStr] = match
  const semitone = NOTE_OFFSETS[letter] + (parseInt(octStr) + 1) * 12
  return 440 * Math.pow(2, (semitone - 69) / 12)
}

// ============ MELODÍAS ============
const BPM_FAST = 138
const BPM_MED = 100
const BPM_SLOW = 72
const Q_FAST = 60 / BPM_FAST
const Q_MED = 60 / BPM_MED
const Q_SLOW = 60 / BPM_SLOW

type Step = { lead?: string; bass?: string; dur: number }

// ── Tema OESTE / NORTE: heroico en La menor (el original)
const TRACK_OESTE: Step[] = (() => {
  const E = Q_FAST / 2
  const Q = Q_FAST
  const H = Q_FAST * 2
  return [
    { lead: 'A4', bass: 'A2', dur: E },
    { lead: 'C5', dur: E },
    { lead: 'E5', dur: E },
    { lead: 'A5', dur: E },
    { lead: 'G5', bass: 'E2', dur: E },
    { lead: 'E5', dur: E },
    { lead: 'C5', dur: E },
    { lead: 'A4', dur: E },

    { lead: 'F4', bass: 'F2', dur: E },
    { lead: 'A4', dur: E },
    { lead: 'C5', dur: E },
    { lead: 'F5', dur: E },
    { lead: 'E5', bass: 'C3', dur: E },
    { lead: 'C5', dur: E },
    { lead: 'A4', dur: E },
    { lead: 'F4', dur: E },

    { lead: 'G4', bass: 'G2', dur: E },
    { lead: 'B4', dur: E },
    { lead: 'D5', dur: E },
    { lead: 'G5', dur: E },
    { lead: 'F5', bass: 'D3', dur: E },
    { lead: 'D5', dur: E },
    { lead: 'B4', dur: E },
    { lead: 'G4', dur: E },

    { lead: 'A4', bass: 'A2', dur: Q },
    { lead: 'C5', dur: Q },
    { lead: 'E5', bass: 'E2', dur: Q },
    { lead: 'A4', bass: 'A2', dur: H },
  ]
})()

// ── Tema ORIENTE: modo frigio (escala "árabe/hebrea") en La frigia
//    Notas: A Bb C D E F G A — esa segunda menor le da el sabor del este
const TRACK_ORIENTE: Step[] = (() => {
  const E = Q_MED / 2
  const Q = Q_MED
  const H = Q_MED * 2
  return [
    // Frase 1: ascenso místico
    { lead: 'A4', bass: 'A2', dur: Q },
    { lead: 'Bb4', dur: E },
    { lead: 'C5', dur: E },
    { lead: 'D5', bass: 'D2', dur: Q },
    { lead: 'C5', dur: E },
    { lead: 'Bb4', dur: E },
    // Frase 2: cae con peso
    { lead: 'A4', bass: 'F2', dur: E },
    { lead: 'G4', dur: E },
    { lead: 'F4', dur: E },
    { lead: 'E4', bass: 'E2', dur: E },
    { lead: 'F4', dur: Q },
    { lead: 'E4', dur: Q },
    // Frase 3: ornamentación
    { lead: 'E5', bass: 'A2', dur: E },
    { lead: 'F5', dur: E },
    { lead: 'E5', dur: E },
    { lead: 'D5', dur: E },
    { lead: 'C5', bass: 'F2', dur: E },
    { lead: 'Bb4', dur: E },
    { lead: 'A4', dur: H },
  ]
})()

// ── Tema VALHALLA: solemne, mayor lenta. La mayor con suspensión sus4
const TRACK_VALHALLA: Step[] = (() => {
  const Q = Q_SLOW
  const H = Q_SLOW * 2
  return [
    { lead: 'A4', bass: 'A2', dur: H },
    { lead: 'C#5', bass: 'A2', dur: Q },
    { lead: 'E5', dur: Q },
    { lead: 'D5', bass: 'D2', dur: H },
    { lead: 'F#5', bass: 'D2', dur: Q },
    { lead: 'A5', dur: Q },
    { lead: 'E5', bass: 'E2', dur: H },
    { lead: 'C#5', bass: 'E2', dur: Q },
    { lead: 'A4', dur: Q },
    { lead: 'A4', bass: 'A2', dur: H * 2 },
  ]
})()

// ── Tema SHAME / DEATH-TRAP: cromático descendente, Do menor disminuido
const TRACK_SHAME: Step[] = (() => {
  const E = Q_FAST / 2
  const Q = Q_FAST
  return [
    { lead: 'C5', bass: 'C2', dur: E },
    { lead: 'B4', dur: E },
    { lead: 'Bb4', bass: 'B1', dur: E },
    { lead: 'A4', dur: E },
    { lead: 'Ab4', bass: 'Bb1', dur: E },
    { lead: 'G4', dur: E },
    { lead: 'Gb4', bass: 'A1', dur: E },
    { lead: 'F4', dur: Q },
    { lead: 'Eb4', bass: 'C2', dur: Q },
    { lead: 'D4', bass: 'D2', dur: Q },
    { lead: 'C4', bass: 'C2', dur: Q * 2 },
  ]
})()

// ── Tema SKALD: arpegiado contemplativo, Do mayor con séptima
const TRACK_SKALD: Step[] = (() => {
  const E = Q_MED / 2
  const Q = Q_MED
  const H = Q_MED * 2
  return [
    { lead: 'C5', bass: 'C2', dur: E },
    { lead: 'E5', dur: E },
    { lead: 'G5', dur: E },
    { lead: 'B5', dur: E },
    { lead: 'G5', dur: E },
    { lead: 'E5', dur: E },
    { lead: 'D5', bass: 'G2', dur: H },
    { lead: 'A4', bass: 'F2', dur: Q },
    { lead: 'C5', dur: Q },
    { lead: 'E5', bass: 'C2', dur: H },
  ]
})()

const TRACKS: Record<string, Step[]> = {
  oeste: TRACK_OESTE,
  norte: TRACK_OESTE,
  oriente: TRACK_ORIENTE,
  valhalla: TRACK_VALHALLA,
  shame: TRACK_SHAME,
  skald: TRACK_SKALD,
}

export type TrackKey = keyof typeof TRACKS

// ============ ENGINE ============
export class Chiptune {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private nextNoteTime = 0
  private noteIdx = 0
  private schedulerIds: number[] = []
  private _isPlaying = false
  private _starting = false
  private _volume = 0.5
  private _currentTrack: TrackKey = 'oeste'

  get isPlaying() { return this._isPlaying }
  get volume() { return this._volume }
  get currentTrack() { return this._currentTrack }

  async start() {
    if (this._isPlaying || this._starting) return
    this._starting = true
    try {
      if (!this.ctx) {
        const Ctx =
          (window as Window & typeof globalThis).AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        this.ctx = new Ctx()
        this.masterGain = this.ctx.createGain()
        this.masterGain.gain.value = 0
        this.masterGain.connect(this.ctx.destination)
      }
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume()
      }
      if (this.masterGain) {
        const now = this.ctx.currentTime
        this.masterGain.gain.cancelScheduledValues(now)
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now)
        this.masterGain.gain.linearRampToValueAtTime(this._volume, now + 0.05)
      }
      this._isPlaying = true
      this.nextNoteTime = this.ctx.currentTime + 0.1
      this.noteIdx = 0
      this.runScheduler()
    } finally {
      this._starting = false
    }
  }

  stop() {
    for (const id of this.schedulerIds) window.clearInterval(id)
    this.schedulerIds = []
    this._isPlaying = false
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime
      this.masterGain.gain.cancelScheduledValues(now)
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now)
      this.masterGain.gain.linearRampToValueAtTime(0, now + 0.08)
    }
  }

  async kill() {
    this.stop()
    if (this.ctx && this.ctx.state !== 'closed') {
      try { await this.ctx.close() } catch { /* ignore */ }
    }
    this.ctx = null
    this.masterGain = null
  }

  /** Cambiar a otro track. Si estaba sonando, hace un crossfade rápido. */
  async setTrack(track: TrackKey) {
    if (this._currentTrack === track) return
    if (!TRACKS[track]) return
    const wasPlaying = this._isPlaying
    if (wasPlaying) {
      // Fade out current
      this.stop()
      // Wait for fade to complete
      await new Promise((r) => setTimeout(r, 120))
    }
    this._currentTrack = track
    if (wasPlaying) {
      await this.start()
    }
  }

  setVolume(v: number) {
    this._volume = Math.max(0, Math.min(1, v))
    if (this.masterGain && this._isPlaying && this.ctx) {
      const now = this.ctx.currentTime
      this.masterGain.gain.cancelScheduledValues(now)
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now)
      this.masterGain.gain.linearRampToValueAtTime(this._volume, now + 0.05)
    }
  }

  private runScheduler() {
    const SCHEDULE_AHEAD = 0.18
    const LOOKAHEAD_MS = 25
    const id = window.setInterval(() => {
      if (!this.ctx || !this._isPlaying) return
      const melody = TRACKS[this._currentTrack]
      while (this.nextNoteTime < this.ctx.currentTime + SCHEDULE_AHEAD) {
        const step = melody[this.noteIdx % melody.length]
        if (step.lead) {
          this.playVoice(noteToFreq(step.lead), step.dur, 'square', this.nextNoteTime, 0.18)
        }
        if (step.bass) {
          this.playVoice(noteToFreq(step.bass), step.dur, 'triangle', this.nextNoteTime, 0.35)
        }
        this.nextNoteTime += step.dur
        this.noteIdx = (this.noteIdx + 1) % melody.length
      }
    }, LOOKAHEAD_MS)
    this.schedulerIds.push(id)
  }

  private playVoice(
    freq: number,
    dur: number,
    type: OscillatorType,
    startTime: number,
    peakVol: number,
  ) {
    if (!this.ctx || !this.masterGain) return
    const osc = this.ctx.createOscillator()
    osc.type = type
    osc.frequency.value = freq
    const gain = this.ctx.createGain()
    const attack = 0.005
    const release = 0.04
    const sustainTime = Math.max(0, dur - attack - release)
    gain.gain.setValueAtTime(0, startTime)
    gain.gain.linearRampToValueAtTime(peakVol, startTime + attack)
    gain.gain.setValueAtTime(peakVol, startTime + attack + sustainTime)
    gain.gain.linearRampToValueAtTime(0, startTime + dur)
    osc.connect(gain).connect(this.masterGain)
    osc.start(startTime)
    osc.stop(startTime + dur + 0.05)
  }
}

/** Instancia singleton — un solo motor para toda la app. */
export const chiptune = new Chiptune()

if (typeof window !== 'undefined') {
  ;(window as unknown as { __chiptune: Chiptune }).__chiptune = chiptune
}
