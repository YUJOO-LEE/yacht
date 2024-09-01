'use client'

import { Aside } from '@/components/Aside';
import { BoundingBox } from '@/components/BoundingBox';
import { Player } from '@/components/Player';
import { database } from '@/firebase';
import { GameData, PlayerData } from '@/types';
import { onValue, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import styles from './page.module.css';

export default function Room({ params }: { params: { gameId: string } }) {
  const { gameId } = params;

  const [currentPlayer, setCurrentPlayer] = useState<string>('');
  const [playerList, setPlayerList] = useState<PlayerData[]>([]);

  const currentPlayerName = playerList.find(({ id }) => id === currentPlayer)?.name;

  useEffect(() => {
    const dataRef = ref(database, `games/${gameId}`);

    const unsubscribe = onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        const data: GameData = snapshot.val();
        setCurrentPlayer(data.currentPlayer);
        setPlayerList(data.players);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <main className={styles.wrapper}>
      <div className={styles.notice}>
        플레이어 <strong>{currentPlayerName}</strong> 차례입니다.
      </div>

      <div className={styles.boardWrapper}>
        <BoundingBox currentPlayer={currentPlayer}/>
        <Aside/>

        {playerList.map(({ id, name }) => (
          <Player key={id} gameId={gameId} id={id} name={name}/>
        ))}
      </div>
    </main>
  );
}