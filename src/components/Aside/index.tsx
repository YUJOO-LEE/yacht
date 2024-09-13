import styles from './aside.module.css';

export const Aside = () => {
  return (
    <div className={styles.scoreWrapper}>
      <div className={styles.title}>-</div>
      <div className={styles.upperSection}>
        <div className={styles.scoreItem}>
          에이스
        </div>
        <div className={styles.scoreItem}>
          듀얼
        </div>
        <div className={styles.scoreItem}>
          트리플
        </div>
        <div className={styles.scoreItem}>
          쿼드
        </div>
        <div className={styles.scoreItem}>
          펜타
        </div>
        <div className={styles.scoreItem}>
          헥사
        </div>
        <div className={styles.subScore}>
          <div className={styles.scoreItem}>
            63점 이상<br/>
            보너스 35점
          </div>
        </div>
      </div>

      <div className={styles.choice}>
        <div className={styles.scoreItem}>
          초이스
        </div>
      </div>

      <div className={styles.lowerSection}>
        <div className={styles.scoreItem}>
          포커
        </div>
        <div className={styles.scoreItem}>
          풀하우스
        </div>
        <div className={styles.scoreItem}>
          스몰스트레이트
        </div>
        <div className={styles.scoreItem}>
          라지스트레이트
        </div>
        <div className={styles.scoreItem}>
          요트
        </div>
      </div>

      <div className={styles.total}>
        <div className={styles.scoreItem}>
          총점
        </div>
      </div>
    </div>
  );
}