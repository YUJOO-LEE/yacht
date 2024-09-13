'use client'

import { Aside } from '@/components/Aside';
import { BoundingBox } from '@/components/BoundingBox';
import { Player } from '@/components/Player';
import { database } from '@/firebase';
import { GameData, PlayerScore } from '@/types';
import { onValue, ref } from 'firebase/database';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Fireworks from 'react-canvas-confetti/dist/presets/fireworks';
import styles from './page.module.css';

export default function Room({ params }: { params: { gameId: string } }) {
  const { gameId } = params;
  const router = useRouter();

  const [currentPlayer, setCurrentPlayer] = useState<string>('');
  const [playerScoreList, setPlayerScoreList] = useState<PlayerScore[]>([]);

  const currentPlayerName = playerScoreList.find(({ id }) => id === currentPlayer)?.name;
  const isFinished = playerScoreList.every(({ score }) => score && isAllValid(
    [score.aces, score.deuces, score.threes, score.fours, score.fives, score.sixes, score.choice, score.fourOfAKind, score.fullHouse, score.smallStraight, score.largeStraight, score.yacht],
  ));
  const winners = playerScoreList.reduce<{ id: string; name: string; total: number }[]>((prev, { id, name, score }) => {
    const current = { id, name, total: score?.total || 0 };
    if (!prev.length || current.total < prev[0].total) {
      return prev;
    }
    if (current.total === prev[0].total) {
      return [...prev, current];
    }
    return [current];
  }, [{
    id: '',
    name: '',
    total: 0,
  }]);

  useEffect(() => {
    const dataRef = ref(database, `games/${gameId}`);

    const unsubscribe = onValue(dataRef, (snapshot) => {
      if (!snapshot.exists()) {
        router.push(`/`);
        return;
      }
      const data: GameData = snapshot.val();
      setCurrentPlayer(data.currentPlayer);
      setPlayerScoreList(data.players.map((player) => ({
        ...player,
        score: data.score?.[player.id],
      })));
    });

    return () => unsubscribe();
  }, []);

  return (
    <main className={styles.wrapper}>
      <div className={styles.notice}>
        {isFinished ? (
          <p>
            축하합니다! 플레이어 <strong>{winners.map(({ name }) => name).join(', ')}</strong> 의 승리입니다.
          </p>
        ) : (
          <p>
            플레이어 <strong>{currentPlayerName}</strong> 차례입니다.
          </p>
        )}
      </div>

      <div className={styles.boardWrapper}>
        {isFinished && (
          <Fireworks autorun={{ speed: 3, duration: 3000 }} />
        )}

        {isFinished ? (
          winners.map(({ id }) => (
            <BoundingBox key={`bounding-box-${id}`} currentPlayer={id}/>
          ))
        ) : (
          <BoundingBox currentPlayer={currentPlayer}/>
        )}

        <Aside/>

        {playerScoreList.map(({ id, name, score }) => (
          <Player
            key={id}
            id={id}
            name={name}
            score={score}
            isActive={isFinished ? winners.some(winner => winner.id === id) : id === currentPlayer}
            isWinner={winners.some(winner => winner.id === id)}
          />
        ))}
      </div>
    </main>
  );
}

const isValid = (score?: number): score is number => {
  return typeof score === 'number';
};

const isAllValid = (scores: (number | undefined)[]) => {
  return scores.every((score) => isValid(score));
};