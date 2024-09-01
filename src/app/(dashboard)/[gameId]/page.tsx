'use client'

import { Aside } from '@/components/Aside';
import { BoundingBox } from '@/components/BoundingBox';
import { Player } from '@/components/Player';
import { useState } from 'react';
import styles from './page.module.css';

const players = [0, 1, 2, 3];

export default function Room() {
  const [currentPlayer, setCurrentPlayer] = useState<number>(0);

  const handleNext = () => {
    setCurrentPlayer((prev) => {
      const next = prev + 1;
      if (next >= players.length) return 0;
      return next;
    });
  };

  return (
    <main className={styles.wrapper}>
      <div className={styles.notice} onClick={handleNext}>
        다음
      </div>

      <div className={styles.boardWrapper}>
        <BoundingBox currentPlayer={currentPlayer} />
        <Aside/>

        {players.map((id) => (
          <Player key={`${id}`} id={id} />
        ))}
      </div>
    </main>
  );
}