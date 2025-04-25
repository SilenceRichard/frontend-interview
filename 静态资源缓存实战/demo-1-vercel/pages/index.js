import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [count, setCount] = useState(0);
  
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Static Resources Cache Demo
        </h1>
        
        <p className={styles.description}>
          This page demonstrates cache control for static assets
        </p>
        
        <div className={styles.card}>
          <h2>Next.js with Vercel</h2>
          <p>
            Built-in content hashing ensures optimal caching.
            HTML uses no-cache for quick updates, while JS/CSS use long-term caching.
          </p>
          <button 
            className={styles.button}
            onClick={() => setCount(prev => prev + 1)}
          >
            Count: {count}
          </button>
        </div>
      </main>
    </div>
  );
} 