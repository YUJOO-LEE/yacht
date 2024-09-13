'use client';

import { database } from '@/firebase';
import { Score } from '@/types';
import { isNumber } from '@/utils';
import { onValue, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import styles from './player.module.css';

type Props = {
  gameId: string;
  key: string;
  id: string;
  name: string;
  isActive: boolean;
}

export const Player = (props: Props) => {
  const { gameId, id, name, isActive } = props;

  const [score, setScore] = useState<Score>({});

  const subTotal = (score.aces || 0) + (score.deuces || 0) + (score.threes || 0) + (score.fours || 0) + (score.fives || 0) + (score.sixes || 0);
  const bonus = subTotal >= 63 ? 35 : isNumber([score.aces, score.deuces, score.threes, score.fours, score.fives, score.sixes]) ? 0 : '';
  const total = subTotal + (bonus || 0) + (score.choice || 0) + (score.fourOfAKind || 0) + (score.fullHouse || 0) + (score.smallStraight || 0) + (score.largeStraight || 0) + (score.yacht || 0);

  useEffect(() => {
    const dataRef = ref(database, `games/${gameId}/score/${id}`);

    const unsubscribe = onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        const data: Score = snapshot.val();
        setScore(data);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className={styles.scoreWrapper} id={id}>
      <div className={`${styles.playerName} ${isActive ? styles.active : ''}`}>
        {name}
      </div>
      <div className={styles.upperSection}>
        <div className={styles.scoreItem}>
          {score.aces}
        </div>
        <div className={styles.scoreItem}>
          {score.deuces}
        </div>
        <div className={styles.scoreItem}>
          {score.threes}
        </div>
        <div className={styles.scoreItem}>
          {score.fours}
        </div>
        <div className={styles.scoreItem}>
          {score.fives}
        </div>
        <div className={styles.scoreItem}>
          {score.sixes}
        </div>
        <div className={styles.subScore}>
          <p>
            {subTotal} / 63
          </p>
          <p>
            {bonus}
          </p>
        </div>
      </div>

      <div className={styles.choice}>
        <div className={styles.scoreItem}>
          {score.choice}
        </div>
      </div>

      <div className={styles.lowerSection}>
        <div className={styles.scoreItem}>
          {score.fourOfAKind}
        </div>
        <div className={styles.scoreItem}>
          {score.fullHouse}
        </div>
        <div className={styles.scoreItem}>
          {score.smallStraight}
        </div>
        <div className={styles.scoreItem}>
          {score.largeStraight}
        </div>
        <div className={styles.scoreItem}>
          {score.yacht}
        </div>
      </div>

      <div className={styles.scoreItem}>
        {total}
      </div>
    </div>
  );
};