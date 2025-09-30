"use client";
import { Provider } from 'react-redux';
import { store } from '@/app/store/store';
import Game from '@/app/components/Game.jsx';

export default function Home() {
  return (
    <main>
      <Provider store={store}>
        <Game />
      </Provider>
    </main>
  );
}
