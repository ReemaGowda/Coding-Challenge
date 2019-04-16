// console.log("hello")

//1.install the  npm install bitcoinjs lib
const bitcoin = require('bitcoinjs-lib');
const assert = require('assert')
var bcypher = require('blockcypher');

console.log(bitcoin.networks)
network = {
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bech32: 'bc',
    bip32: {
        public: 76067358,
        private: 76066276
    },
    pubKeyHash: 0,
    scriptHash: 5,
    wif: 0xef
};

//key== private key will loaded up in the key variable 
//the use this for sign the transition 

const key = bitcoin.ECPair.fromWIF('cRqBQhx7ZLQZKrLohRukyTQZCgBqN187nn7VKHHC1cE4M95BqwAH', network);

//generate the testnet address
//here we are telling the bitcoin we are working on the testnet address i.e networks.testnet
let testnet = bitcoin.networks.testnet;



//keypair going generate address and the private key
//Ec 
//A private key is a random number. It is a 256 bit number.
const keypair = bitcoin.ECPair.makeRandom({
    //here we are specfing the network we are working on that is testnet
    network: testnet
})

//wif holds the private key

let privatekey = keypair.toWIF();

//This holds our testnet address
//P2PKH: "Pay To Public Key Hash"
//This is how transactions are made.
const {
    address
} = bitcoin.payments.p2pkh({
    pubkey: keypair.publicKey,
    network: testnet
})
//adddress generated will start from 1 but inorder to get coins from some facucet address
// need to start from m or n
// below will makes the address begin from m or n
assert.strictEqual(address.startsWith('m') || address.startsWith('n'), true)

// console.log("The private key " + " " + privatekey);
// console.log("The address is " + " " + address);


var networkkeys = {
    private: "cV32hsGikuiJyhFvTeX9JnjXPhQHrtFWKCfmN22n4Hc9q8tqgWHb",
    address: "mzU8SLxfewYogn8mEP69b5ScaZgo7JrGbt",
    wif: "cRqBQhx7ZLQZKrLohRukyTQZCgBqN187nn7VKHHC1cE4M95BqwAH"
};

//This is my token from blockcyper
//var bcapi = new bcypher('btc','main','YOURTOKEN');
var bcapi = new bcypher('btc', 'test3', '95f0907a140c4666b89b1d4ed970dbb0');

var newtx = null;

//For printing JSON objects.
function printResponse(err, data) {
    if (err !== null) {
        console.log(err);
    } else {
        var keys = Object.keys(data);
        for (var i = 0; i < keys.length; i++) {
            console.log(keys[i] + ": " + data[keys[i]]);
        }
    }
}

//Signs a the transaction.
function sign(err, data) {
    if (err !== null) {
        console.log(err);
    } else {
        var tx = data;
        console.log("Recieved: " + data.tx.received);
        console.log("Transaction recieved, signing...");


        tx.pubkeys = [];
        tx.signatures = data.tosign.map(function (tosign) {
            tx.pubkeys.push(networkkeys.public);
            //output of tx is not readble so we are coverting into the hex
            var signature = key.sign(Buffer.from(tosign, "hex"));
            return signature.toString("hex");
        });

        //Attempt to send the signed transaction by below code.
        console.log("\nSending signed transaction...");
        bcapi.sendTX(tx, function (err, data) {
            if (err !== null) {
                console.log(err);
            } else {
                console.log("Recieved: " + data.tx.received);
                console.log("\nTransaction Success.");
            }

        });
    }
}


var newtx = {
    //input (who is paying)
    "inputs": [{
        "addresses": ["mzU8SLxfewYogn8mEP69b5ScaZgo7JrGbt"]
    }],
    //Add the output (who to pay to) of the form address
    "outputs": [{
        "addresses": ["2MyXoDJ8fsU33NYagNqEaC5qCaEu8URQNkw"],
        "value": 1000
    }]
};

console.log("\nGetting balance from my testnet address:");
//Get balance of my bitcoin address.
//add the address balance to my to my tocken
bcapi.getAddrBal("myGRP8kqufa4LN21Nuj2tqJpeDqnGgYM4X", "",
    function (err, data) {
       
        printResponse(err, data);

        console.log("\nStarting new transaction...");
        //Make a new transfer, pass to sign.
        bcapi.newTX(newtx, sign);
    });

