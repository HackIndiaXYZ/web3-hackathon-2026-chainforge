import React, { useState } from 'react';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';
const CONTRACT_ABI = [
  "function getRecipientCredentials(address _recipient) public view returns (uint256[])",
  "function getCredential(uint256 _id) public view returns (tuple(uint256 id, address issuer, address recipient, string skillName, string description, uint256 issuedAt, bool isValid))",
];

function MyCertificates() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [account, setAccount] = useState('');

  const loadCertificates = async () => {
    try {
      setLoading(true);
      setError('');

      if (!(window as any).ethereum) {
        setError('Please install MetaMask!');
        return;
      }

      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);

      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      const ids = await contract.getRecipientCredentials(address);

      const certs = await Promise.all(
        ids.map(async (id: any) => {
          const c = await contract.getCredential(id);
          return {
            id: Number(id),
            skillName: c[3],
            description: c[4],
            issuer: c[1],
            issuedAt: new Date(Number(c[5]) * 1000).toLocaleDateString(),
            isValid: c[6],
          };
        })
      );

      setCertificates(certs);
    } catch (err: any) {
      setError(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🏆 My Certificates</h2>
      <button style={styles.button} onClick={loadCertificates} disabled={loading}>
        {loading ? 'Loading...' : 'Load My Certificates'}
      </button>

      {account && <p style={styles.account}>Wallet: {account.slice(0, 6)}...{account.slice(-4)}</p>}

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.grid}>
        {certificates.length === 0 && !loading && (
          <p style={styles.empty}>No certificates found. Click Load to fetch!</p>
        )}
        {certificates.map((cert) => (
          <div key={cert.id} style={styles.card}>
            <h3 style={styles.skillName}>🎓 {cert.skillName}</h3>
            <p style={styles.description}>{cert.description}</p>
            <p><strong>Issued By:</strong> {cert.issuer.slice(0, 6)}...{cert.issuer.slice(-4)}</p>
            <p><strong>Date:</strong> {cert.issuedAt}</p>
            <p><strong>ID:</strong> #{cert.id}</p>
            <span style={cert.isValid ? styles.valid : styles.invalid}>
              {cert.isValid ? '✅ Valid' : '❌ Revoked'}
            </span>
          </div>
        ))}
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
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: '2rem',
    color: '#e94560',
    marginBottom: '2rem',
  },
  button: {
    backgroundColor: '#e94560',
    color: 'white',
    border: 'none',
    padding: '0.8rem 2rem',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginBottom: '1rem',
  },
  account: { color: '#a0a0b0', marginBottom: '1rem' },
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1.5rem',
    justifyContent: 'center',
    marginTop: '2rem',
  },
  card: {
    backgroundColor: '#1a1a2e',
    padding: '1.5rem',
    borderRadius: '12px',
    width: '280px',
    lineHeight: '1.8',
  },
  skillName: { color: '#e94560', marginBottom: '0.5rem' },
  description: { color: '#a0a0b0', marginBottom: '0.5rem' },
  valid: { color: '#00ff88', fontWeight: 'bold' },
  invalid: { color: '#ff4444', fontWeight: 'bold' },
  error: { color: '#ff4444' },
  empty: { color: '#a0a0b0' },
};

export default MyCertificates;