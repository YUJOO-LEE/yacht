'use client';

import { database } from '@/firebase';
import { PlayerData } from '@/types';
import { uuidv4 } from '@firebase/util';
import { onValue, ref, set } from 'firebase/database';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import styles from './page.module.css';

export default function Setting({ params }: { params: { gameId: string } }) {
  const { gameId } = params;
  const router = useRouter();

  const [data, setData] = useState<PlayerData[]>([]);
  const isValid = data.length > 1 && data.every(({ name }) => name.trim());

  const handleAdd = (index: number) => () => {
    const id = uuidv4().replaceAll('-', '');
    setData((prev) => {
      return prev.toSpliced(index + 1, 0, { id, name: '' });
    });
  };

  const handleRemove = (index: number) => () => {
    setData((prev) => {
      return prev.toSpliced(index, 1);
    });
  };

  const handleChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setData((prev) => {
      return prev.with(index, { id: prev[index].id, name: event.target.value });
    })
  };

  const handleSaveData = async () => {
    if (!isValid) return;
    const newPlayerRef = ref(database, `games/${gameId}`);
    await set(newPlayerRef, {
      players: data,
      currentPlayer: data[0].id,
    });
    router.push(`/${gameId}/play`);
  };

  useEffect(() => {
    const dataRef = ref(database, `games/${gameId}/players`);

    const unsubscribe = onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        const rawData = snapshot.val();
        const dataArray: PlayerData[] = Object.values(rawData);

        if (!dataArray.length) return;
        setData(dataArray);
      } else {
        const id = uuidv4().replaceAll('-', '');
        setData([{ id, name: '' }]);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <main className={styles.main}>
      <ul className={styles.players}>
        {data.map(({ id, name }, index) => (
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
              <button className="red" onClick={handleAdd(index)}>
                +
              </button>
              {!!index && (
                <button className="gray" onClick={handleRemove(index)}>
                  -
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
      <hr/>
      <button onClick={handleSaveData} disabled={!isValid}>Start play</button>
    </main>
  );
};