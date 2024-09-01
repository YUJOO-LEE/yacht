'use client';

import { database } from '@/firebase';
import { GameData, PlayerData, Score } from '@/types';
import { onValue, ref, update, set } from 'firebase/database';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import styles from './page.module.css';

export default function Play({ params }: { params: { gameId: string; playerId: string } }) {
  const { gameId, playerId } = params;
  const router = useRouter();

  const [players, setPlayers] = useState<{ prev: string; current: string; next: string }>({
    prev: '',
    current: '',
    next: '',
  });
  const [player, setPlayer] = useState<PlayerData>();
  const [score, setScore] = useState<Score>({});
  const [value, setValue] = useState<Score>({});

  const isValid = JSON.stringify(score) === JSON.stringify(value);

  const handleChange = (target: keyof Score) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((prev) => ({
      ...prev,
      [target]: event.target.value.trim() ? Number(event.target.value) : undefined,
    }));
  };

  const handleNext = async () => {
    const newPlayerRef = ref(database, `games/${gameId}/currentPlayer`);
    await set(newPlayerRef, players.next);
    const newScoreRef = ref(database, `games/${gameId}/score`);
    await update(newScoreRef, {
      [playerId]: value,
    });
    router.push(`/${gameId}/${players.next}`);
  };

  useEffect(() => {
    const dataRef = ref(database, `games/${gameId}`);

    const unsubscribe = onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        const data: GameData = snapshot.val();
        const player = data.players.find(({ id }) => id === playerId);
        setPlayer(player);
        setScore(data.score?.[playerId] || {});
        setValue(data.score?.[playerId] || {});

        const currentPlayer = data.currentPlayer;
        const currentIndex = data.players.findIndex(({ id }) => id === currentPlayer);
        const prevPlayer = data.players.at(currentIndex ? currentIndex - 1 : -1)?.id || '';
        const nextPlayer = data.players.at(currentIndex < (data.players.length - 1) ? currentIndex + 1 : 0)?.id || '';

        setPlayers({
          prev: prevPlayer,
          current: currentPlayer,
          next: nextPlayer,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <main className={styles.main}>
      <h2>{player?.name}</h2>
      <ul className={styles.score}>
        <li>
          <p>
            에이스
          </p>
          <input
            type="number"
            inputMode="numeric"
            disabled={typeof score.aces === 'number'}
            value={typeof value.aces === 'number' ? value.aces : ''}
            onChange={handleChange('aces')}
          />
        </li>
        <li>
          <p>
            듀얼
          </p>
          <input
            type="number"
            inputMode="numeric"
            disabled={typeof score.deuces === 'number'}
            value={typeof value.deuces === 'number' ? value.deuces : ''}
            onChange={handleChange('deuces')}
          />
        </li>
        <li>
          <p>
            트리플
          </p>
          <input
            type="number"
            inputMode="numeric"
            disabled={typeof score.threes === 'number'}
            value={typeof value.threes === 'number' ? value.threes : ''}
            onChange={handleChange('threes')}
          />
        </li>
        <li>
          <p>
            쿼드
          </p>
          <input
            type="number"
            inputMode="numeric"
            disabled={typeof score.fours === 'number'}
            value={typeof value.fours === 'number' ? value.fours : ''}
            onChange={handleChange('fours')}
          />
        </li>
        <li>
          <p>
            펜타
          </p>
          <input
            type="number"
            inputMode="numeric"
            disabled={typeof score.fives === 'number'}
            value={typeof value.fives === 'number' ? value.fives : ''}
            onChange={handleChange('fives')}
          />
        </li>
        <li>
          <p>
            헥사
          </p>
          <input
            type="number"
            inputMode="numeric"
            disabled={typeof score.sixes === 'number'}
            value={value.sixes || ''}
            onChange={handleChange('sixes')}
          />
        </li>
        <hr/>
        <li>
          <p>
            초이스
          </p>
          <input
            type="number"
            inputMode="numeric"
            disabled={typeof score.choice === 'number'}
            value={typeof value.choice === 'number' ? value.choice : ''}
            onChange={handleChange('choice')}
          />
        </li>
        <hr/>
        <li>
          <p>
            포커
          </p>
          <input
            type="number"
            inputMode="numeric"
            disabled={typeof score.fourOfAKind === 'number'}
            value={typeof value.fourOfAKind === 'number' ? value.fourOfAKind : ''}
            onChange={handleChange('fourOfAKind')}
          />
        </li>
        <li>
          <p>
            풀하우스
          </p>
          <input
            type="number"
            inputMode="numeric"
            defaultValue={score.fullHouse}
            disabled={typeof score.fullHouse === 'number'}
            value={typeof value.fullHouse === 'number' ? value.fullHouse : ''}
            onChange={handleChange('fullHouse')}
          />
        </li>
        <li>
          <p>
            스몰 스트레이트
          </p>
          <input
            type="number"
            inputMode="numeric"
            disabled={typeof score.smallStraight === 'number'}
            value={typeof value.smallStraight === 'number' ? value.smallStraight : ''}
            onChange={handleChange('smallStraight')}
          />
        </li>
        <li>
          <p>
            라지 스트레이트
          </p>
          <input
            type="number"
            inputMode="numeric"
            disabled={typeof score.largeStraight === 'number'}
            value={typeof value.largeStraight === 'number' ? value.largeStraight : ''}
            onChange={handleChange('largeStraight')}
          />
        </li>
        <li>
          <p>
            요트
          </p>
          <input
            type="number"
            inputMode="numeric"
            disabled={typeof score.yacht === 'number'}
            value={typeof value.yacht === 'number' ? value.yacht : ''}
            onChange={handleChange('yacht')}
          />
        </li>
      </ul>
      <button className="red" disabled={isValid} onClick={handleNext}>
        Next
      </button>
    </main>
  );
};