import React, { useState } from 'react';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';
const CONTRACT_ABI = [
  "function issueCredential(address _recipient, string memory _skillName, string memory _description) public returns (uint256)",
];

function IssueCertificate() {
  const [recipient, setRecipient] = useState('');
  const [skillName, setSkillName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const issueCredential = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      if (!(window as any).ethereum) {
        setError('Please install MetaMask!');
        return;
      }

      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.issueCredential(recipient, skillName, description);
      await tx.wait();

      setSuccess(`✅ Certificate issued! TX: ${tx.hash}`);
      setRecipient('');
      setSkillName('');
      setDescription('');
    } catch (err: any) {
      setError(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📜 Issue Certificate</h2>
      <div style={styles.form}>
        <input
          style={styles.input}
          placeholder="Recipient Wallet Address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <input
          style={styles.input}
          placeholder="Skill Name (e.g. React Development)"
          value={skillName}
          onChange={(e) => setSkillName(e.target.value)}
        />
        <textarea
          style={styles.textarea}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          style={styles.button}
          onClick={issueCredential}
          disabled={loading}
        >
          {loading ? 'Issuing...' : 'Issue Certificate'}
        </button>
        {success && <p style={styles.success}>{success}</p>}
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
  textarea: {
    padding: '0.8rem',
    borderRadius: '8px',
    border: '1px solid #333',
    backgroundColor: '#1a1a2e',
    color: 'white',
    fontSize: '1rem',
    height: '100px',
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
  success: { color: '#00ff88' },
  error: { color: '#ff4444' },
};

export default IssueCertificate;