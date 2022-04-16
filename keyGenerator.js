const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const key = ec.genKeyPair();
const publicK = key.getPublic('hex');
const privateK = key.getPrivate('hex');


console.log('\nPrivate Key: '+privateK);
console.log('\nPublic Key: '+publicK);