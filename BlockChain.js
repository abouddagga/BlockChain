const SHA256 = require('crypto-js/sha256')
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress
        this.toAddress = toAddress
        this.amount = amount
    }

    claculateHash(){
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    signTransaction(signingKey){
        if(signingKey.getPublic("hex") !== this.fromAddress){
            throw new Error('you cant sign tranactions for other wallets!');
        }

        const hashText = this.claculateHash();
        const sig = signingKey.sign(hashText, 'base64');
        this.signature = sig.toDER('hex');
    }
    isValid(){
        if(this.fromAddress === null) return true;

        if(!this.signature || this.signature.length === 0){
            throw new Error("no signature here")
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.claculateHash(), this.signature);
    }
}

class Block{
    constructor( timestamp, transactions, previousHash = ''){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.claculateHash();
        this.nonce = 0;
    }

    claculateHash(){
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(diffculty){
        while(this.hash.substring(0, diffculty) !== Array(diffculty + 1).join("0")){
            this.nonce++;
            this.hash = this.claculateHash();
        }
        console.log("Block mined: " + this.hash);
    }

    hasValidTransaction(){
        for(const tx of this.transactions){
            if(!tx.isValid()){
                return false;
            }
        }

        return true;
    }
}


class Blockchain{
    constructor(){
        this.chain = [this.createBlock()];
        this.diffculty = 2;
        this.pendingTransactions = [];
        this.miningRewarde = 100;
    }

    createBlock(){
        return new Block('11/10/2021', 'normal BLock', '0')
    }

    getLastestBlock(){
        return this.chain[this.chain.length - 1];
    }

    miningPendingTransaction(miningRewardeAddress){
        const rewardTx = new Transaction(null, miningRewardeAddress, this.miningRewarde);
        this.pendingTransactions.push(rewardTx)


        let block = new Block(Date.now, this.pendingTransactions,this.getLastestBlock().hash);
        block.mineBlock(this.diffculty);

        console.log('Block successfuly mined');
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardeAddress, this.miningRewarde)
        ];
    }

    addTransaction(transaction){

        if(!transaction.fromAddress || !transaction.toAddress){
            throw new Error('Transation must include from + to Address')
        }

        if(!transaction.isValid()){
            throw new Error('cannot add invalid Transaction to chain')
        }

        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }
                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }


    isChainValid(){
        let flage = true;
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            
            if(!currentBlock.hasValidTransaction()){
                flage = false;
            }

            if(currentBlock.hash !== currentBlock.claculateHash()){
                flage = false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                flage = false;
            }   
        }
        return flage;
    }

}

module.exports.Blockchain = Blockchain; 
module.exports.Transaction = Transaction;