'use client'

import { uuidv4 } from '@firebase/util';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter()

  const handleNewGame = () => {
    const id = uuidv4().replaceAll('-', '');
    router.push(`/${id}/create`);
  };

  return (
    <main className={styles.main}>
      <h1>
        Yacht!
      </h1>
      <hr width="100%"/>
      <button onClick={handleNewGame}>
        신규게임
      </button>
    </main>
  );
}
