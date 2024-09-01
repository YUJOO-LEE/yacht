'use client';

import { uuidv4 } from '@firebase/util';
import { useState, useEffect } from 'react';
import { database } from '@/firebase';
import { ref, set, push, onValue } from 'firebase/database';

export default function Setting({ params }: { params: { gameId: string } }) {
  const { gameId } = params;

  const [inputValue, setInputValue] = useState('');
  const [data, setData] = useState({});

  const handleSaveData = async () => {
    if (inputValue.trim()) {
      const newDataRef = push(ref(database, `games/${gameId}/players`)); // 새 데이터 항목 생성
      const id = uuidv4().replaceAll('-', '');
      await set(newDataRef, { id, name: inputValue });
      setInputValue('');
    }
  };

  useEffect(() => {
    const dataRef = ref(database, `games/${gameId}`);

    const unsubscribe = onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        setData(snapshot.val());
      } else {
        setData({});
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <main>
      플레이어 1
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter some data"
      />
      <button onClick={handleSaveData}>Save Data</button>

      <h2>Realtime Data:</h2>
      <ul>
        {Object.entries(data).map(([key, value]) => (
          <li key={key}>{value.content} (at {new Date(value.timestamp).toLocaleTimeString()})</li>
        ))}
      </ul>
    </main>
  );
};