import { useGame } from './game/store'
import { Intro } from './components/Intro'
import { GameView } from './components/GameView'

export default function App() {
  const nombre = useGame((s) => s.nombre)
  const currentScene = useGame((s) => s.currentScene)

  if (!nombre || !currentScene) return <Intro />
  return <GameView />
}
