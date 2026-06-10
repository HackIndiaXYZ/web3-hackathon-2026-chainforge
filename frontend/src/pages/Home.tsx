import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>🎓 SkillChain</h1>
        <p style={styles.subtitle}>
          Decentralized Skills & Credentials Platform on Polygon Blockchain
        </p>
        <p style={styles.description}>
          Issue, verify, and manage tamper-proof skill certificates on-chain.
          Your credentials are yours forever — portable, trustless, and verifiable.
        </p>
        <div style={styles.buttons}>
          <Link to="/issue" style={styles.primaryBtn}>Issue Certificate</Link>
          <Link to="/verify" style={styles.secondaryBtn}>Verify Certificate</Link>
        </div>
      </div>

      <div style={styles.features}>
        <div style={styles.card}>
          <h3>🔐 Tamper-Proof</h3>
          <p>Credentials stored on Polygon blockchain — immutable and secure</p>
        </div>
        <div style={styles.card}>
          <h3>⚡ Instant Verification</h3>
          <p>Verify any credential instantly without middlemen</p>
        </div>
        <div style={styles.card}>
          <h3>🌐 Portable</h3>
          <p>Share your credentials anywhere — jobs, universities, platforms</p>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0f0f1a',
    color: 'white',
    padding: '2rem',
  },
  hero: {
    textAlign: 'center',
    padding: '4rem 2rem',
  },
  title: {
    fontSize: '3rem',
    color: '#e94560',
    marginBottom: '1rem',
  },
  subtitle: {
    fontSize: '1.3rem',
    color: '#a0a0b0',
    marginBottom: '1rem',
  },
  description: {
    fontSize: '1rem',
    color: '#c0c0d0',
    maxWidth: '600px',
    margin: '0 auto 2rem',
    lineHeight: '1.6',
  },
  buttons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
  },
  primaryBtn: {
    backgroundColor: '#e94560',
    color: 'white',
    padding: '0.8rem 2rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '1rem',
  },
  secondaryBtn: {
    backgroundColor: 'transparent',
    color: '#e94560',
    padding: '0.8rem 2rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '1rem',
    border: '2px solid #e94560',
  },
  features: {
    display: 'flex',
    gap: '2rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: '2rem',
  },
  card: {
    backgroundColor: '#1a1a2e',
    padding: '2rem',
    borderRadius: '12px',
    width: '250px',
    textAlign: 'center',
  },
};

export default Home;