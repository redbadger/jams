import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Layout from '../components/Layout'

export default function Home() {
  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>Welcome to JAMS</title>
        </Head>

        <main className={styles.main}>
          <h1 className={styles.title}>Welcome to JAM</h1>
        </main>

        <footer className={styles.footer}>
          <a>Powered by Red Badger</a>
        </footer>
      </div>
    </Layout>
  );
}
