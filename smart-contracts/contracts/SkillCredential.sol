// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SkillCredential {
    
    struct Credential {
        uint256 id;
        address issuer;
        address recipient;
        string skillName;
        string description;
        uint256 issuedAt;
        bool isValid;
    }

    uint256 public credentialCount = 0;
    
    mapping(uint256 => Credential) public credentials;
    mapping(address => uint256[]) public recipientCredentials;
    
    event CredentialIssued(
        uint256 indexed id,
        address indexed issuer,
        address indexed recipient,
        string skillName
    );
    
    event CredentialRevoked(uint256 indexed id);

    function issueCredential(
        address _recipient,
        string memory _skillName,
        string memory _description
    ) public returns (uint256) {
        credentialCount++;
        
        credentials[credentialCount] = Credential({
            id: credentialCount,
            issuer: msg.sender,
            recipient: _recipient,
            skillName: _skillName,
            description: _description,
            issuedAt: block.timestamp,
            isValid: true
        });
        
        recipientCredentials[_recipient].push(credentialCount);
        
        emit CredentialIssued(credentialCount, msg.sender, _recipient, _skillName);
        
        return credentialCount;
    }

    function revokeCredential(uint256 _id) public {
        require(credentials[_id].issuer == msg.sender, "Only issuer can revoke");
        require(credentials[_id].isValid, "Already revoked");
        credentials[_id].isValid = false;
        emit CredentialRevoked(_id);
    }

    function verifyCredential(uint256 _id) public view returns (bool) {
        return credentials[_id].isValid;
    }

    function getCredential(uint256 _id) public view returns (Credential memory) {
        return credentials[_id];
    }

    function getRecipientCredentials(address _recipient) public view returns (uint256[] memory) {
        return recipientCredentials[_recipient];
    }
}