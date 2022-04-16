const {Blockchain, Transaction} = require("./blockChain");
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('0db5b5b084d55838d2704eb94f7787d79cb2f7e81dddf677f4527d366da3baac');
const myWalletKeyAddress = myKey.getPublic('hex');


let aboodH = new Blockchain();

const tx1 = new Transaction(myWalletKeyAddress, 'public key goes here', 10); 
tx1.signTransaction(myKey);
aboodH.addTransaction(tx1);

// aboodH.addTransaction(new Transaction('address 1', 'address 2', 100))
// aboodH.addTransaction(new Transaction('address 2', 'address 1', 50))


console.log('\nStarting the miner.... ');
aboodH.miningPendingTransaction(myWalletKeyAddress);
aboodH.chain[1].transactions[0].amount = 1; 
console.log('Balance of xas: ' + aboodH.getBalanceOfAddress(myWalletKeyAddress));
console.log("this chain vaild or not ? ",aboodH.isChainValid()?"Yes":"No");
//////////////////////////////////////////////////////////////////////////////

// console.log('\nStarting the miner.... ');
// aboodH.miningPendingTransaction('xas-address')

// console.log('Balance of xas: ' + aboodH.getBalanceOfAddress('xas-address'));








// aboodH.addBlock(new Block("10/10/2021", {amount: 4 }))
// aboodH.addBlock(new Block("10/12/2021", {amount: 1 }))

// console.log(JSON.stringify(aboodH, null, 4));


// after this code must this chain be not vaild

// console.log("this chain vaild or not ? \n" + aboodH.isChainValid());


