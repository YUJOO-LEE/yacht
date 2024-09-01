'use client';

import { database } from '@/firebase';
import { GameData, PlayerData, Score } from '@/types';
import { onValue, ref, update } from 'firebase/database';
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

  const handleChange = (target: keyof Score) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((prev) => ({
      ...prev,
      [target]: Number(event.target.value),
    }));
  };

  const handleNext = async () => {
    const newScoreRef = ref(database, `games/${gameId}`);
    await update(newScoreRef, {
      currentPlayer: players.next,
      score: {
        [playerId]: value,
      },
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
        setScore(data.scores[playerId] || {});
        const currentPlayer = data.currentPlayer;
        const currentIndex = data.players.findIndex(({ id }) => id === currentPlayer);
        const prevPlayer = data.players.at(currentIndex ? currentIndex - 1 : -1)?.id || '';
        const nextPlayer = data.players.at(currentIndex === (data.players.length - 1) ? currentIndex + 1 : 0)?.id || '';

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
            defaultValue={score.aces}
            disabled={typeof score.aces === 'number'}
            value={value.aces}
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
            defaultValue={score.deuces}
            disabled={typeof score.deuces === 'number'}
            value={value.deuces}
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
            defaultValue={score.threes}
            disabled={typeof score.threes === 'number'}
            value={value.threes}
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
            defaultValue={score.fours}
            disabled={typeof score.fours === 'number'}
            value={value.fours}
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
            defaultValue={score.fives}
            disabled={typeof score.fives === 'number'}
            value={value.fives}
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
            defaultValue={score.sixes}
            disabled={typeof score.sixes === 'number'}
            value={value.sixes}
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
            defaultValue={score.choice}
            disabled={typeof score.choice === 'number'}
            value={value.choice}
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
            defaultValue={score.fourOfAKind}
            disabled={typeof score.fourOfAKind === 'number'}
            value={value.fourOfAKind}
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
            value={value.fullHouse}
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
            defaultValue={score.smallStraight}
            disabled={typeof score.smallStraight === 'number'}
            value={value.smallStraight}
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
            defaultValue={score.largeStraight}
            disabled={typeof score.largeStraight === 'number'}
            value={value.largeStraight}
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
            defaultValue={score.yacht}
            disabled={typeof score.yacht === 'number'}
            value={value.yacht}
            onChange={handleChange('yacht')}
          />
        </li>
      </ul>
      <button className="red" onClick={handleNext}>
        Next
      </button>
    </main>
  );
};