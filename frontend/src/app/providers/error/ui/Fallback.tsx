import type { FC } from 'react';

import styles from './Fallback.module.scss';

export const ErrorFallback: FC = () => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className={styles.wrapper}>
      <p>😢 Что-то пошло не так...</p>
      <button className={styles.button} onClick={handleReload}>
        Перезагрузить
      </button>
    </div>
  );
};
