'use client';

import { database } from '@/firebase';
import { GameData, PlayerData, Score } from '@/types';
import { isNumber } from '@/utils';
import { onValue, ref, update, set, get, getDatabase, child } from 'firebase/database';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import styles from './page.module.css';

export default function Play({ params }: { params: { gameId: string } }) {
  const { gameId } = params;
  const router = useRouter();

  const [players, setPlayers] = useState<{ prev?: PlayerData; current?: PlayerData; next?: PlayerData }>({});
  const [player, setPlayer] = useState<PlayerData>();
  const [score, setScore] = useState<Omit<Score, 'subTotal' | 'total' | 'bonus'>>({});
  const [value, setValue] = useState<Omit<Score, 'subTotal' | 'total' | 'bonus'>>({});

  const isPrevDisabled = players.prev?.id === players.current?.id;
  const isNextDisabled = players.next?.id === player?.id || player?.id === players.current?.id && JSON.stringify(score) === JSON.stringify(value);

  const handleChange = (target: keyof Score) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((prev) => ({
      ...prev,
      [target]: event.target.value.trim() ? Number(event.target.value) : undefined,
    }));
  };

  const handlePrev = async () => {
    if (!player || isPrevDisabled) return;
    setPlayer(players.prev);
  };

  const handleNext = async () => {
    if (!player || isNextDisabled || !players.next) return;
    const newPlayerRef = ref(database, `games/${gameId}/currentPlayer`);
    await set(newPlayerRef, players.next.id);
    const newScoreRef = ref(database, `games/${gameId}/score`);
    await update(newScoreRef, {
      [player.id]: getScore(value),
    });
    setPlayer(players.next);
  };

  useEffect(() => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `games/${gameId}`)).then((snapshot) => {
      if (!snapshot.exists()) {
        router.push(`/`);
        return;
      }
      const data: GameData = snapshot.val();
      const player = data.players.find(({ id }) => id === data.currentPlayer);
      setPlayer(player);
    })
  }, []);

  useEffect(() => {
    if (!player) return;
    const dataRef = ref(database, `games/${gameId}`);

    const unsubscribe = onValue(dataRef, (snapshot) => {
      if (!snapshot.exists()) {
        router.push(`/`);
        return;
      }

      const data: GameData = snapshot.val();
      setScore(data.score?.[player.id] || {});
      setValue(data.score?.[player.id] || {});

      const currentPlayer = data.players.find(({ id }) => id === data.currentPlayer);

      const currentIndex = data.players.findIndex(({ id }) => id === player.id);
      const prevPlayer = data.players.at(currentIndex ? currentIndex - 1 : -1);
      const nextPlayer = data.players.at(currentIndex < (data.players.length - 1) ? currentIndex + 1 : 0);

      setPlayers({
        prev: prevPlayer,
        current: currentPlayer,
        next: nextPlayer,
      });
    });

    return () => unsubscribe();
  }, [player]);

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
      <div className={styles.actions}>
        <button className="gray" disabled={isPrevDisabled} onClick={handlePrev}>
          Prev
        </button>
        <button className="red" disabled={isNextDisabled} onClick={handleNext}>
          Next
        </button>
      </div>
    </main>
  );
};

const getScore = (score: Omit<Score, 'subTotal' | 'total' | 'bonus'>): Score => {
  const subTotal = (score.aces || 0) + (score.deuces || 0) + (score.threes || 0) + (score.fours || 0) + (score.fives || 0) + (score.sixes || 0);
  const bonus = subTotal >= 63 ? 35 : isNumber([score.aces, score.deuces, score.threes, score.fours, score.fives, score.sixes]) ? 0 : '';
  const total = subTotal + (bonus || 0) + (score.choice || 0) + (score.fourOfAKind || 0) + (score.fullHouse || 0) + (score.smallStraight || 0) + (score.largeStraight || 0) + (score.yacht || 0);

  return {
    ...score,
    subTotal,
    bonus,
    total,
  }
};