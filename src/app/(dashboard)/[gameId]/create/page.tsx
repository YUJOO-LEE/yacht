'use client'

import { database } from '@/firebase';
import { onValue, ref } from 'firebase/database';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styles from './page.module.css';
import { QrCode } from './QrCode';

const root = process.env.NEXT_PUBLIC_ROOT;

export default function Create({ params }: {
  params: {
    gameId: string
  }
}) {
  const { gameId } = params;
  const router = useRouter();

  useEffect(() => {
    const dataRef = ref(database, `games/${gameId}`); // Firebase 데이터 경로 설정

    const unsubscribe = onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        router.push(`/${gameId}`);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <main className={styles.main}>
      <h2>
        신규게임
      </h2>
      <hr style={{ width: '100%' }}/>
      {root && gameId && (
        <QrCode url={`${root}/${gameId}/settings`}/>
      )}
      <p>
        신규 게임 생성 화면으로 접속하세요.
      </p>
    </main>
  );
};