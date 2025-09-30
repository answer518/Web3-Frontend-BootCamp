import Game from '@/app/components/Game.jsx';
import { GameProvider } from '@/app/components/GameContext.jsx';

export default function Home() {
  return (
    <main>
      <GameProvider>
        <Game />
      </GameProvider>
    </main>
  );
}
