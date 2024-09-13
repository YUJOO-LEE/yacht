'use client';

import { database } from '@/firebase';
import { PlayerData } from '@/types';
import { uuidv4 } from '@firebase/util';
import { child, get, getDatabase, ref, set } from 'firebase/database';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import styles from './page.module.css';

export default function Setting({ params }: { params: { gameId: string } }) {
  const { gameId } = params;
  const router = useRouter();

  const [players, setPlayers] = useState<PlayerData[]>([{ id: uuidv4().replaceAll('-', ''), name: '' }]);
  const isValid = players.length > 1 && players.every(({ name }) => name.trim());

  const handleAdd = (index: number) => () => {
    const id = uuidv4().replaceAll('-', '');
    setPlayers((prev) => {
      return prev.toSpliced(index + 1, 0, { id, name: '' });
    });
  };

  const handleRemove = (index: number) => () => {
    setPlayers((prev) => {
      return prev.toSpliced(index, 1);
    });
  };

  const handleChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setPlayers((prev) => {
      return prev.with(index, { id: prev[index].id, name: event.target.value });
    })
  };

  const handleSaveData = async () => {
    if (!isValid) return;
    const newPlayerRef = ref(database, `games/${gameId}`);
    const firstPlayer = players[0].id;
    await set(newPlayerRef, {
      players,
      currentPlayer: firstPlayer,
    });
    router.push(`/${gameId}/play`);
  };

  useEffect(() => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `games/${gameId}/players`)).then((snapshot) => {
      if (!snapshot.exists()) return;
      router.push(`/`);
    })
  }, []);

  return (
    <main className={styles.main}>
      <ul className={styles.players}>
        {players.map(({ id, name }, index) => (
          <li key={id}>
            <i>
              {index + 1}
            </i>
            <p>
              Player
            </p>
            <input
              type="text"
              value={name}
              onChange={handleChange(index)}
              placeholder="Enter player name"
            />
            <div className={styles.actions}>
              <button className="red small" onClick={handleAdd(index)}>
                +
              </button>
              {!!index && (
                <button className="gray small" onClick={handleRemove(index)}>
                  -
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
      <hr/>
      <button className="red" onClick={handleSaveData} disabled={!isValid}>Start play</button>
    </main>
  );
};