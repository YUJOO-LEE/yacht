import { useEffect, useState } from 'react';
import styles from './box.module.css';

type Props = {
  currentPlayer: string;
}

export const BoundingBox = (props: Props) => {
  const { currentPlayer } = props;

  const [position, setPosition] = useState<{ top: number; left: number; width: number; height: number }>();

  const style = position ? {
    opacity: 1,
    top: position.top,
    left: position.left,
    width: position.width - 3,
    height: position.height - 3,
  } : undefined;

  useEffect(() => {
    const element = document.getElementById(currentPlayer);
    const observer = new ResizeObserver((entries) => {
      if (entries && entries[0]) {
        const el = entries[0].target as HTMLElement;
        setPosition({ top: el.offsetTop, left: el.offsetLeft, width: el.clientWidth, height: el.clientHeight });
      }
    });

    if (element) {
      observer.observe(element);
    }
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [currentPlayer]);

  return (
    <div className={styles.box} style={style}/>
  );
};