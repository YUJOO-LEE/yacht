import styles from './player.module.css';

type Props = {
  id: number,
  key: string
}

export const Player = (props: Props) => {
  const { id } = props;

  return (
    <div className={styles.scoreWrapper} id={`${id}`}>
      <div className={styles.playerName}>
        플레이어1
      </div>
      <div className={styles.upperSection}>
        <div className={styles.scoreItem}>
          0
        </div>
        <div className={styles.scoreItem}>
          0
        </div>
        <div className={styles.scoreItem}>
          0
        </div>
        <div className={styles.scoreItem}>
          0
        </div>
        <div className={styles.scoreItem}>
          0
        </div>
        <div className={styles.scoreItem}>
          0
        </div>
        <div className={styles.subScore}>
          <p>
            0 / 63
          </p>
          <p>
            0
          </p>
        </div>
      </div>

      <div className={styles.choice}>
        <div className={styles.scoreItem}>
          0
        </div>
      </div>

      <div className={styles.lowerSection}>
        <div className={styles.scoreItem}>
          0
        </div>
        <div className={styles.scoreItem}>
          0
        </div>
        <div className={styles.scoreItem}>
          0
        </div>
        <div className={styles.scoreItem}>
          0
        </div>
        <div className={styles.scoreItem}>
          0
        </div>
      </div>

      <div className={styles.scoreItem}>
        0
      </div>
    </div>
  );
};