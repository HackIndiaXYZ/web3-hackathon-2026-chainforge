const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';
const CONTRACT_ABI = [
  "function issueCredential(address _recipient, string memory _skillName, string memory _description) public returns (uint256)",
  "function verifyCredential(uint256 _id) public view returns (bool)",
  "function getCredential(uint256 _id) public view returns (tuple(uint256 id, address issuer, address recipient, string skillName, string description, uint256 issuedAt, bool isValid))",
  "function getRecipientCredentials(address _recipient) public view returns (uint256[])",
  "function credentialCount() public view returns (uint256)",
];

const provider = new ethers.JsonRpcProvider(
  process.env.POLYGON_MUMBAI_RPC || 'https://rpc-amoy.polygon.technology'
);

// GET - Verify credential
app.get('/api/verify/:id', async (req, res) => {
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    const isValid = await contract.verifyCredential(req.params.id);
    const credential = await contract.getCredential(req.params.id);
    
    res.json({
      success: true,
      isValid,
      credential: {
        id: Number(credential[0]),
        issuer: credential[1],
        recipient: credential[2],
        skillName: credential[3],
        description: credential[4],
        issuedAt: new Date(Number(credential[5]) * 1000).toISOString(),
        isValid: credential[6],
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET - Get credentials by address
app.get('/api/credentials/:address', async (req, res) => {
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    const ids = await contract.getRecipientCredentials(req.params.address);
    
    const credentials = await Promise.all(
      ids.map(async (id) => {
        const c = await contract.getCredential(id);
        return {
          id: Number(c[0]),
          issuer: c[1],
          recipient: c[2],
          skillName: c[3],
          description: c[4],
          issuedAt: new Date(Number(c[5]) * 1000).toISOString(),
          isValid: c[6],
        };
      })
    );
    
    res.json({ success: true, credentials });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET - Total credentials count
app.get('/api/stats', async (req, res) => {
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    const count = await contract.credentialCount();
    res.json({ success: true, totalCredentials: Number(count) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
app.get('/', (req, res) => {
  res.json({ message: '🎓 SkillChain API Running!', status: 'ok' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});