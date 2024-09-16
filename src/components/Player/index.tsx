'use client';

import Medal from '@/assets/medal.svg';
import { Score } from '@/types';
import styles from './player.module.css';

type Props = {
  key: string;
  id: string;
  name: string;
  score?: Score;
  isActive: boolean;
  isWinner: boolean;
}

export const Player = (props: Props) => {
  const { id, name, score, isActive, isWinner } = props;

  return (
    <div className={styles.scoreWrapper} id={id}>
      <div className={`${styles.winner} ${isWinner ? styles.show : ''}`}>
        <Medal/>
      </div>
      <div className={`${styles.playerName} ${isActive ? styles.active : ''}`}>
        {name}
      </div>
      <div className={styles.upperSection}>
        <div className={styles.scoreItem}>
          {score?.aces}
        </div>
        <div className={styles.scoreItem}>
          {score?.deuces}
        </div>
        <div className={styles.scoreItem}>
          {score?.threes}
        </div>
        <div className={styles.scoreItem}>
          {score?.fours}
        </div>
        <div className={styles.scoreItem}>
          {score?.fives}
        </div>
        <div className={styles.scoreItem}>
          {score?.sixes}
        </div>
        <div className={styles.subScore}>
          <p>
            {score?.subTotal || 0} / 63
          </p>
          <p>
            {score?.bonus}
          </p>
        </div>
      </div>

      <div className={styles.choice}>
        <div className={styles.scoreItem}>
          {score?.choice}
        </div>
      </div>

      <div className={styles.lowerSection}>
        <div className={styles.scoreItem}>
          {score?.fourOfAKind}
        </div>
        <div className={styles.scoreItem}>
          {score?.fullHouse}
        </div>
        <div className={styles.scoreItem}>
          {typeof score?.smallStraight === 'number'
            ? score.smallStraight
            : <span className={styles.placeholder}>15</span>}
        </div>
        <div className={styles.scoreItem}>
          {typeof score?.largeStraight === 'number'
            ? score.largeStraight
            : <span className={styles.placeholder}>30</span>}
        </div>
        <div className={styles.scoreItem}>
          {typeof score?.yacht === 'number'
            ? score.yacht
            : <span className={styles.placeholder}>50</span>}
        </div>
      </div>

      <div className={styles.scoreItem}>
        {score?.total}
      </div>
    </div>
  );
};