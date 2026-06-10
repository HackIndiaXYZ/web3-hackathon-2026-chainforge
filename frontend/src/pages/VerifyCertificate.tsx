import React, { useState } from 'react';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';
const CONTRACT_ABI = [
  "function verifyCredential(uint256 _id) public view returns (bool)",
  "function getCredential(uint256 _id) public view returns (tuple(uint256 id, address issuer, address recipient, string skillName, string description, uint256 issuedAt, bool isValid))",
];

function VerifyCertificate() {
  const [credentialId, setCredentialId] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const verifyCertificate = async () => {
    try {
      setLoading(true);
      setError('');
      setResult(null);

      if (!(window as any).ethereum) {
        setError('Please install MetaMask!');
        return;
      }

      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      const isValid = await contract.verifyCredential(credentialId);
      const credential = await contract.getCredential(credentialId);

      setResult({
        isValid,
        skillName: credential[3],
        description: credential[4],
        issuer: credential[1],
        recipient: credential[2],
        issuedAt: new Date(Number(credential[5]) * 1000).toLocaleDateString(),
      });
    } catch (err: any) {
      setError(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🔍 Verify Certificate</h2>
      <div style={styles.form}>
        <input
          style={styles.input}
          placeholder="Enter Credential ID"
          value={credentialId}
          onChange={(e) => setCredentialId(e.target.value)}
        />
        <button style={styles.button} onClick={verifyCertificate} disabled={loading}>
          {loading ? 'Verifying...' : 'Verify Certificate'}
        </button>

        {result && (
          <div style={styles.result}>
            <p style={result.isValid ? styles.valid : styles.invalid}>
              {result.isValid ? '✅ VALID Certificate' : '❌ INVALID Certificate'}
            </p>
            <p><strong>Skill:</strong> {result.skillName}</p>
            <p><strong>Description:</strong> {result.description}</p>
            <p><strong>Issued To:</strong> {result.recipient}</p>
            <p><strong>Issued By:</strong> {result.issuer}</p>
            <p><strong>Date:</strong> {result.issuedAt}</p>
          </div>
        )}
        {error && <p style={styles.error}>{error}</p>}
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
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '100%',
    maxWidth: '500px',
  },
  input: {
    padding: '0.8rem',
    borderRadius: '8px',
    border: '1px solid #333',
    backgroundColor: '#1a1a2e',
    color: 'white',
    fontSize: '1rem',
  },
  button: {
    backgroundColor: '#e94560',
    color: 'white',
    border: 'none',
    padding: '0.8rem',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  result: {
    backgroundColor: '#1a1a2e',
    padding: '1.5rem',
    borderRadius: '12px',
    lineHeight: '2',
  },
  valid: { color: '#00ff88', fontSize: '1.2rem', fontWeight: 'bold' },
  invalid: { color: '#ff4444', fontSize: '1.2rem', fontWeight: 'bold' },
  error: { color: '#ff4444' },
};

export default VerifyCertificate;