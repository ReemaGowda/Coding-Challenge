// console.log("hello")
const bitcoin = require('bitcoinjs-lib');
const assert = require('assert')
var bcypher = require('blockcypher');


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
const key = bitcoin.ECPair.fromWIF('cRqBQhx7ZLQZKrLohRukyTQZCgBqN187nn7VKHHC1cE4M95BqwAH', network);
let testnet = bitcoin.networks.testnet;

const keypair = bitcoin.ECPair.makeRandom({
    network: testnet
})

let privatekey = keypair.toWIF();
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
    "inputs": [{
        "addresses": ["mzU8SLxfewYogn8mEP69b5ScaZgo7JrGbt"]
    }],
    "outputs": [{
        "addresses": ["2MyXoDJ8fsU33NYagNqEaC5qCaEu8URQNkw"],
        "value": 1000
    }]
};

console.log("\nGetting balance from my testnet address:");
//Get balance of my bitcoin address.
bcapi.getAddrBal("myGRP8kqufa4LN21Nuj2tqJpeDqnGgYM4X", "",
    function (err, data) {
       
        printResponse(err, data);

        console.log("\nStarting new transaction...");
        //Make a new transfer, pass to sign.
        bcapi.newTX(newtx, sign);
    });

