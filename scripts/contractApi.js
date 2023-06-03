/*
//Add the following lines on top of your other script tags inside your index.html
<script src="https://cdn.jsdelivr.net/npm/@alch/alchemy-web3@latest/dist/alchemyWeb3.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/web3@1.8.1/dist/web3.min.js"></script>
<script src="scripts/contractApi.js"> </script>
*/


/////////////////////////////
///////// ARBITRUM //////////
/////////////////////////////

const arbitrumGoerliChainId = 0x66eed;
const arbitrumOneChainId = 0xA4B1


/////////////////////////////
/////////  HELPER  //////////
/////////////////////////////

function ToEth(wei) {
    if (alchemyProvider.web3 != undefined) {
        return alchemyProvider.web3.utils.fromWei(wei, 'ether');
    }
    else {
        return walletProvider.web3.utils.fromWei(wei, 'ether');
    }
}
function ToWei(eth) {
    if (alchemyProvider.web3 != undefined) {
        return alchemyProvider.web3.utils.toWei(eth.toString(), 'ether');
    }
    else {
        return walletProvider.web3.utils.toWei(eth.toString(), 'ether');
    }
}

/////////////////////////////
// ALCHEMY ALCHEMY ALCHEMY //
/////////////////////////////

//alchemy setup
let alchemyProvider = {};
async function _setupAlchemyConnection(contractAddress, abi, marketAddress, marketAbi, rpcUrl) {
    var alchemyWeb3 = AlchemyWeb3.createAlchemyWeb3(rpcUrl);
    var tokenContract = await new alchemyWeb3.eth.Contract(abi, contractAddress);
    var marketPlaceContract = await new alchemyWeb3.eth.Contract(marketAbi, marketAddress);
    alchemyProvider = { contract: tokenContract, web3: alchemyWeb3, market: marketPlaceContract };
}


//general methods\\
async function _getLatestBlock(callback) {
    let result = 0;
    await alchemyProvider.web3.eth.getBlock("latest").then(block => {
        result = block;
    }).catch((error => {
        result = error;
    }));
    callback && callback(result);
    return result;
}

//contract events\\
async function _getPastGainlingEvents(startblock, endblock) {
    return new Promise(async (resolve, reject) => {
        alchemyProvider.contract.getPastEvents('GainlingsEvent',
            {
                fromBlock: startblock,
                toBlock: endblock,
            },
            (err, events) => {
                if (err) console.log(err);
                resolve(events);
            });
    });
}
async function _subscribeGainlingsEvents(fromBlockNr,callbackData, callBackError) {
    var event_hash = alchemyProvider.web3.utils.sha3('GainlingsEvent(uint256,string)');
    var subscription = alchemyProvider.web3.eth.subscribe('logs', { address: contractAddress, topics: [event_hash] , fromBlock: fromBlockNr}, (error, event) => {
    }).on("connected", function (subscriptionId) {
        //console.log("datastream connected: " + subscriptionId);
    }).on('data', function (event) {
        let decLog = alchemyProvider.web3.eth.abi.decodeLog([{
            type: 'uint256',
            name: 'defender'
        }, {
            type: 'string',
            name: 'output'
        }], event.data, event.topics);
        callbackData && callbackData(decLog,event);
    }).on('changed', function (event) {
        //console.log("datastream has changed");
    }).on('error', function (error, receipt) {
        //console.log("datastream errored: " + error + " receipt: " + receipt);
        callBackError && callBackError(decLog);
    });;
}
async function _subscribeItemChangedEvent(fromBlockNr, callback) {
    var sign = alchemyProvider.web3.eth.abi.encodeEventSignature('ItemChanged(address,address,uint256,uint256,uint256)')
    var event_hash = alchemyProvider.web3.utils.sha3('ItemChanged(address,address,uint256,uint256,uint256)');
    var options = {
        address: marketPlaceContractAddress,
        topics: [event_hash],
        fromBlock: fromBlockNr
    };
    alchemyProvider.web3.eth.subscribe('logs', options, (error, event) => {
    }).on("connected", function (subscriptionId) {
       // console.log(" ")
       // console.log("*** Market events subscribed ***")
        console.log('Market events subscription id: ' + subscriptionId);
        //console.log("Event hash:" + event_hash);
    })
        .on('data', function (event) {
            //console.log(JSON.stringify(event));

            let inputObjets = [
                {
                    type: 'address',
                    name: 'issuer',
                    indexed: true
                },
                {
                    type: 'address',
                    name: 'nftAddress'
                },
                {
                    type: 'uint256',
                    name: 'tokenId',
                    indexed: true
                },
                {
                    type: 'uint256',
                    name: 'price'
                },
                {
                    type: 'uint256',
                    name: 'changeType',
                    indexed: true
                }];

            let topics = event.topics.slice(1, 4);
            //console.log("TOPICS: " +JSON.stringify(topics));
            let decLog = walletProvider.web3.eth.abi.decodeLog(inputObjets, event.data, topics);
            //console.log(JSON.stringify(decLog));

            let streamUpdate = {
                eventRaw: event,
                eventData: decLog
            };
            callback(streamUpdate);

        })
        .on('changed', function (event) {
            // remove event from local database
        })
        .on('error', function (error, receipt) {
            console.log('Error:', error, receipt);
        });;

}

async function _getPastApproachEvents(startblock, endblock) {
    return new Promise(async (resolve, reject) => {
        alchemyProvider.contract.getPastEvents('GainlingApproached',
            {
                fromBlock: startblock,
                toBlock: endblock,
            },
            (err, events) => {
                if (err) console.log(err);
                resolve(events);
            });
    });
}
async function _getPastAttackEvents(startblock, endblock) {
    return new Promise(async (resolve, reject) => {
        alchemyProvider.contract.getPastEvents('GainlingAttacked',
            {
                fromBlock: startblock,
                toBlock: endblock,
            },
            (err, events) => {
                if (err) console.log(err);
                resolve(events);
            });
    });
}
async function _subscribeApproachEvents(callbackData, callBackError) {
    var event_hash = alchemyProvider.web3.utils.sha3('GainlingApproached(uint256,uint256,uint256,uint256,uint256,uint256,uint256)');
    var subscription = alchemyProvider.web3.eth.subscribe('logs', { address: contractAddress, topics: [event_hash] }, (error, event) => {
    }).on("connected", function (subscriptionId) {
       // console.log("datastream connected: " + subscriptionId);
    }).on('data', function (event) {
        let inputObjets = [
            {type: 'uint256',name: 'attacker',indexed: false},
            {type: 'uint256',name: 'defender',indexed: false},
            {type: 'uint256',name: 'aBounty',indexed: false},
            {type: 'uint256',name: 'dBounty',indexed: false},
            {type: 'uint256',name: 'aStack', indexed: false},
            {type: 'uint256',name: 'dStack',indexed: false},
            {type: 'uint256',name: 'attackType',indexed: false}];

        let topics = event.topics.slice(1, 4);
        console.log("Approach Raw: " +JSON.stringify(event));
        let decLog = alchemyProvider.web3.eth.abi.decodeLog(inputObjets, event.data, topics);
        console.log("Approach Dec: " +JSON.stringify(decLog));
        callbackData && callbackData(decLog,event);
    }).on('changed', function (event) {
        //console.log("datastream has changed");
    }).on('error', function (error, receipt) {
        console.log("datastream errored: " + error + " receipt: " + receipt);
        callBackError && callBackError(decLog);
    });;
}
async function _subscribeAttackEvents(callbackData, callBackError) {
    var event_hash = alchemyProvider.web3.utils.sha3('GainlingAttacked(uint256,uint256,uint256,uint256,uint256,uint256)');
    var subscription = alchemyProvider.web3.eth.subscribe('logs', { address: contractAddress, topics: [event_hash]}, (error, event) => {
    }).on("connected", function (subscriptionId) {
       // console.log("datastream connected: " + subscriptionId);
    }).on('data', function (event) {
        let inputObjets = [
            {type: 'uint256',name: 'attacker',indexed: false},
            {type: 'uint256',name: 'defender',indexed: false},
            {type: 'uint256',name: 'aRandom',indexed: false},
            {type: 'uint256',name: 'dRandom',indexed: false},
            {type: 'uint256',name: 'time', indexed: false},
            {type: 'uint256',name: 'winner',indexed: false}];

        let topics = event.topics.slice(1, 4);
        console.log("Attack Raw: " +JSON.stringify(event));
        let decLog = alchemyProvider.web3.eth.abi.decodeLog(inputObjets, event.data, topics);
        console.log("Attack Dec: " +JSON.stringify(decLog));
        callbackData && callbackData(decLog,event);
    }).on('changed', function (event) {
        //console.log("datastream has changed");
    }).on('error', function (error, receipt) {
        console.log("datastream errored: " + error + " receipt: " + receipt);
        callBackError && callBackError(decLog);
    });;
}
async function _subscribeMintEvents(fromBlockNr,callbackData, callBackError) {
    var event_hash = alchemyProvider.web3.utils.sha3('GainlingMinted(address,uint256)');
    var subscriptionId = alchemyProvider.web3.eth.subscribe('logs', { address: contractAddress, topics: [event_hash] , fromBlock: fromBlockNr}, (error, event) => {
    }).on("connected", function (subscriptionId) {
       //console.log("datastream connected: " + subscriptionId);
    }).on('data', function (event) {
        //console.log("Mint received: " + subscriptionId);
        let inputObjets = [
            {
                type: 'address',
                name: 'issuer',
                indexed: true
            },
            {
                type: 'uint256',
                name: 'quantity',
                indexed: false
            }];

        let topics = event.topics.slice(1, 4);
        //console.log("TOPICS: " +JSON.stringify(topics));
        let decLog = walletProvider.web3.eth.abi.decodeLog(inputObjets, event.data, topics);
        //console.log(JSON.stringify(decLog));
        callbackData && callbackData(decLog,event);
    }).on('changed', function (event) {
        //console.log("datastream has changed");
    }).on('error', function (error, receipt) {
        console.log("datastream errored: " + error + " receipt: " + receipt);
        callBackError && callBackError(decLog);
    });;
}
async function _subscribeSeededEvents(fromBlockNr,callbackData, callBackError) {
    var event_hash = alchemyProvider.web3.utils.sha3('GainlingSeeded(uint256,uint256)');
    var subscriptionId = alchemyProvider.web3.eth.subscribe('logs', { address: contractAddress, topics: [event_hash] , fromBlock: fromBlockNr}, (error, event) => {
    }).on("connected", function (subscriptionId) {
       // console.log("datastream connected: " + subscriptionId);
    }).on('data', function (event) {
        let inputObjets = [
            {
                type: 'uint256',
                name: 'tokenId',
                indexed: true
            },
            {
                type: 'uint256',
                name: 'seed',
                indexed: false
            }];

        let topics = event.topics.slice(1, 4);
        //console.log("TOPICS: " +JSON.stringify(topics));
        let decLog = walletProvider.web3.eth.abi.decodeLog(inputObjets, event.data, topics);
        //console.log(JSON.stringify(decLog));
        callbackData && callbackData(decLog,event);
    }).on('changed', function (event) {
        //console.log("datastream has changed");
    }).on('error', function (error, receipt) {
        console.log("datastream errored: " + error + " receipt: " + receipt);
        callBackError && callBackError(decLog);
    });;
}

//contract methods\\ GET
async function _getSupply(callback) {
    let result = 0;
    await alchemyProvider.contract.methods
        .totalSupply()
        .call()
        .then((receipt) => {
            result = receipt;
        });
    callback && callback(result);
    return result;
}
async function _getPhase(callback) {
    let result = 0;
    await alchemyProvider.contract.methods
        ._phase()
        .call()
        .then((receipt) => {
            result = receipt;
        });
    callback && callback(result);
    return result;
}
async function _getTokenStats(tokenId, callback) {
    let bounty = 0;
    await alchemyProvider.contract.methods
        .getTokenStats(tokenId)
        .call()
        .then((receipt) => {
            bounty = receipt;
        });
    callback && callback(bounty);
    return bounty;
}
async function _getBounty(tokenId, callback) {
    let bounty = 0;
    await alchemyProvider.contract.methods
        .getBounty(tokenId)
        .call()
        .then((receipt) => {
            bounty = receipt;
        });
    callback && callback(bounty);
    return bounty;
}
async function _getStack(tokenId, callback) {
    let stack = 0;
    await alchemyProvider.contract.methods
        .getStack(tokenId)
        .call()
        .then((receipt) => {
            stack = receipt;
        });
    callback && callback(stack);
    return stack;
}
async function _getCooldown(tokenId, callback) {
    let cooldown = 0;
    await alchemyProvider.contract.methods
        .getCooldown(tokenId)
        .call()
        .then((receipt) => {
            cooldown = receipt;
        });
    callback && callback(cooldown);
    return cooldown;
}
async function _getTokenUri(tokenId, callback) {
    let tokenUri = "";
    await alchemyProvider.contract.methods
        .getTokenURI(tokenId, false)
        .call()
        .then((receipt) => {
            tokenUri = receipt;
        });
    callback && callback(tokenUri);
    return tokenUri;
}
async function _getPublicPrice(callback) {
    var result = 0;
    await alchemyProvider.contract.methods
        ._publicPrice()
        .call()
        .then((receipt) => {
            result = receipt;
        });
    callback && callback(result);
    return result;
}
async function _getSeasonStartBlock(callback) {
    var result = 0;
    await alchemyProvider.contract.methods
        ._seasonStartBlock()
        .call()
        .then((receipt) => {
            result = receipt;
        });
    callback && callback(result);
    return result;
}
async function _getSeasonBattleStartBlockTime(callback) {
    var result = 0;
    await alchemyProvider.contract.methods
        ._seasonBattleStartBlockTime()
        .call()
        .then((receipt) => {
            result = receipt;
        });
    callback && callback(result);
    return result;
}
async function _getSeasonNumber(callback) {
    var result = 0;
    await alchemyProvider.contract.methods
        ._seasonNumber()
        .call()
        .then((receipt) => {
            result = receipt;
        });
    callback && callback(result);
    return result;
}
async function _getDustingTime(callback) {
    var result = 0;
    await alchemyProvider.contract.methods
        ._dustingTime()
        .call()
        .then((receipt) => {
            result = receipt;
        });
    callback && callback(result);
    return result;
}
async function _getMints(address, callback) {
    var result = 0;
    await alchemyProvider.contract.methods
        ._mints(address)
        .call()
        .then((receipt) => {
            result = receipt;
        });
    callback && callback(result);
    return result;
}
async function _getGetTokenIds(address, callback) {
    var result = 0;
    await alchemyProvider.contract.methods
        .getTokenIds(address)
        .call()
        .then((receipt) => {
            result = receipt;
        });
    callback && callback(result);
    return result;
}
async function _getTokenSeed(tokenId, callback) {
    var result = 0;
    await alchemyProvider.contract.methods
        ._tokenSeeds(tokenId)
        .call()
        .then((receipt) => {
            result = receipt;
        });
    callback && callback(result);
    return result;
}


//////////////////////////
// WALLET WALLET WALLET //  
//////////////////////////

//wallet setup
let walletProvider = {}
let arbiscanUrl = "https://arbiscan.io/"

async function setupWalletConnection(contractAddress, abi, marketAddress, marketAbi, callback) {
    if (window.ethereum === undefined) {
        callback && callback(false);
        console.log("No eth installed");
        return false;
    }

    if (!isEthAddress()) {
        const isEnabled = await window.ethereum.enable();
        const enable = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (isEnabled) {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            walletProvider.account = accounts[0];
        }
    }
    if (isEthAddress()) {
        //console.log(walletProvider.account);

        const nativeWeb3 = new Web3(window.ethereum);
        const tokenContract = new nativeWeb3.eth.Contract(abi, contractAddress);
        const marketPlaceContract = new nativeWeb3.eth.Contract(marketAbi, marketAddress);
        walletProvider = {
            account: walletProvider.account,
            contract: tokenContract,
            market: marketPlaceContract,
            web3: nativeWeb3,
            tokenContractAddress: contractAddress,
            marketPlaceContractAddress: marketAddress
        };
    }

    callback && callback(isEthAddress());

    return isEthAddress();

}
function isEthAddress() {
    return (
        !!walletProvider.account && /^(0x)?[0-9a-f]{40}$/i.test(walletProvider.account)
    );
}
//general methods\\
async function getLatestBlock(callback) {
    let result = 0;
    await walletProvider.web3.eth.getBlock("latest").then(block => {
        result = block;
    }).catch((error => {
        result = error;
    }));
    callback && callback(result);
    return result;
}
async function getBlockByNumber(nr, callback) {
    const result = await window.ethereum.request({
        params: [nr, false],
        method: 'eth_getBlockByNumber',
    });
    callback && callback(result);
    return result;
}
async function getBalance(callback) {
    const result = await window.ethereum.request({
        params: [walletProvider.account, "latest"],
        method: 'eth_getBalance',
    });
    //var balanceNumber = walletProvider.web3.toBigNumber(result).toFixed()
    var bal = eval(result) / 10 ** 18;
    //console.log(JSON.stringify(bal));
    callback && callback(bal);
    return bal;
}
async function getUserChain(callback) {
    const result = await window.ethereum.request({
        method: 'eth_chainId',
    });
    callback && callback(result);
    return result;
}
async function addTestNetwork(callback) {
    const result = await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
            chainId: "0x66eed",
            rpcUrls: ["https://goerli-rollup.arbitrum.io/rpc"],
            chainName: "Arbitrum Goerli",
            nativeCurrency: {
                name: "GoerliETH",
                symbol: "ETH",
                decimals: 18
            },
            blockExplorerUrls: ["https://goerli-rollup-explorer.arbitrum.io/"]
        }]
    });
    //console.log(result);
    callback && callback(result);
    return result;
}
async function addMainNetwork(callback) {
    const result = await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
            chainId: "0xA4B1",
            rpcUrls: ["https://arb1.arbitrum.io/rpc"],
            chainName: "Arbitrum One",
            nativeCurrency: {
                name: "ETH",
                symbol: "ETH",
                decimals: 18
            },
            blockExplorerUrls: ["https://arbiscan.io/"]
        }]
    });
    callback && callback(result);
    return result;
}
async function addMainNetwork(callback) {
    const result = await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
            chainId: "0xA4B1",
            rpcUrls: ["https://arb1.arbitrum.io/rpc"],
            chainName: "Arbitrum One",
            nativeCurrency: {
                name: "ETH",
                symbol: "ETH",
                decimals: 18
            },
            blockExplorerUrls: ["https://arbiscan.io/"]
        }]
    });
    callback && callback(result);
    return result;
}
async function switchToMainNetwork(callback) {
    const result = await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{
            chainId: "0xA4B1"
        }]
    });
    callback && callback(result);
    return result;
}
async function getBlockNumber(callback) {
    const result = await window.ethereum.request({
        method: 'eth_blockNumber',
    });
    callback && callback(result);
    return result;
}

//contract methods\\ GET
async function getSupply(callback) {
    let result = 0;
    await walletProvider.contract.methods
        .totalSupply()
        .call()
        .then((receipt) => {
            result = receipt;
        });
    callback && callback(result);
    return result;
}
async function getPublicPrice(callback) {
    var result = 0;
    await walletProvider.contract.methods
        ._publicPrice()
        .call()
        .then((receipt) => {
            result = receipt;
        });
    callback && callback(result);
    return result;
}
async function getPhase(callback) {
    let result = 0;
    await walletProvider.contract.methods
        ._phase()
        .call()
        .then((receipt) => {
            result = receipt;
        });
    callback && callback(result);
    return result;
}
async function getSeasonStartBlock(callback) {
    var result = 0;
    await walletProvider.contract.methods
        ._seasonStartBlock()
        .call()
        .then((receipt) => {
            result = receipt;
        });
    callback && callback(result);
    return result;
}
async function getSeasonBattleStartBlockTime(callback) {
    var result = 0;
    await walletProvider.contract.methods
        ._seasonBattleStartBlockTime()
        .call()
        .then((receipt) => {
            result = receipt;
        });
    callback && callback(result);
    return result;
}
async function getSeasonNumber(callback) {
    var result = 0;
    await walletProvider.contract.methods
        ._seasonNumber()
        .call()
        .then((receipt) => {
            result = receipt;
        });
    callback && callback(result);
    return result;
}
async function getDustingTime(callback) {
    var result = 0;
    await walletProvider.contract.methods
        ._dustingTime()
        .call()
        .then((receipt) => {
            result = receipt;
        });
    callback && callback(result);
    return result;
}
async function getTokenSeed(tokenId, callback) {
    let result = 0;
    await walletProvider.contract.methods
        ._tokenSeeds(tokenId)
        .call()
        .then((receipt) => {
            result = receipt;
        });
    callback && callback(result);
    return result;
}
async function getTokenUri(tokenId, callback) {
    let tokenUri = "";
    await walletProvider.contract.methods
        .getTokenURI(tokenId, false)
        .call()
        .then((receipt) => {
            tokenUri = receipt;
        });
    callback && callback(tokenUri);
    return tokenUri;
}

async function getBounty(tokenId, callback) {
    let result = 0;
    await walletProvider.contract.methods
        .getBounty(tokenId)
        .call()
        .then((receipt) => {
            result = receipt;
        });
    callback && callback(result);
    return result;
}
async function getStack(tokenId, callback) {
    let result = 0;
    await walletProvider.contract.methods
        .getStack(tokenId)
        .call()
        .then((receipt) => {
            result = receipt;
        });
    callback && callback(result);
    return result;
}
async function getCooldown(tokenId, callback) {
    let result = 0;
    await walletProvider.contract.methods
        .getCooldown(tokenId)
        .call()
        .then((receipt) => {
            result = receipt;
        });
    callback && callback(result);
    return result;
}
async function getTokenIdsOfOwner(owner, callback) {
    let result = 0;
    await walletProvider.contract.methods
        .getTokenIds(owner)
        .call()
        .then((receipt) => {
            result = receipt;
        });
    callback && callback(result);
    return result;
}
async function getMints(owner, callback) {
    var result = 0;
    await alchemyProvider.contract.methods
        ._mints(owner)
        .call()
        .then((receipt) => {
            result = receipt;
        });
    callback && callback(result);
    return result;
}

//contract methods\\ SEND
async function mintGainlingsAllowListed(quantity, price, proof, callback) {
    let normalPrice = (ToWei(price)) * quantity;
    if (!(await connect())) {
        console.log('No Connection to eth');
        return;
    }

    try {
        let gas = await blockchain.myContract.methods
            .whitelistMint(quantity, proof)
            .estimateGas({
                from: blockchain.account,
                value: normalPrice,
            });
        //console.log("ESTIMATED GAS0: " + gas);
        gas *= 1.2;
        gas = Math.round(gas);
        blockchain.myContract.methods
            .whitelistMint(quantity, proof)
            .send({
                from: blockchain.account,
                value: normalPrice,
                gas: gas,
                maxFeePerGas: 100000001, // 1.5 Gwei
                maxPriorityFeePerGas: 100000000, // .5 Gwei
                type: '0x2'
            })
            .once('error', (err) => {
                console.log(err);
            })
            .then((receipt) => {
                //console.log(receipt);
                successContaier.style.visibility = 'visible';
            });
    }
    catch (error) {
        console.log(error);
    }

}
async function mintGainlings(quantity, price, callback) {
    let normalPrice = (ToWei(price)) * quantity;
    //console.log(normalPrice);
    let result = {};
    result.success = false;
    let gas = await walletProvider.contract.methods
        .mintQRNG(quantity)
        .estimateGas({
            from: walletProvider.account,
            value: normalPrice,
        });
    gas = Math.round(gas * 1.2);
    await walletProvider.contract.methods
        .mintQRNG(quantity)
        .send({
            from: walletProvider.account,
            value: normalPrice,
            gas: gas,
            maxFeePerGas: 100000001, // 1.5 Gwei
            maxPriorityFeePerGas: 100000000, // .5 Gwei
            type: '0x2'
        })
        .once('error', (err) => {
            result.success = false;
            result.data = err;
        })
        .then((receipt) => {
            result.success = true;
            result.data = receipt;
        });

    callback && callback(result);
    return result;
}
async function attackGainling(attackerId, defenderId) {
    return new Promise((resolve, reject) => {
        walletProvider.contract.methods
            .attack(attackerId, defenderId)
            .estimateGas({
                from: walletProvider.account,
            }).then(gas => {
                //ATTACK IF OK
                //console.log("Estimated gas is: " + gas);
                let gasR = Math.round(gas * 1.05);
                walletProvider.contract.methods
                    .attack(attackerId, defenderId)
                    .send({
                        from: walletProvider.account,
                        gas: gasR,
                        maxFeePerGas: 1000000000, // 1.5 Gwei
                        maxPriorityFeePerGas: 1000000000, // .5 Gwei
                        //value: walletProvider.web3.utils.toWei(qty.toString(), 'ether'),
                    })
                    .once('error', (err) => {
                       // console.log("1: " + err);
                        reject(err);
                    })
                    .then((receipt) => {
                       // console.log("2: " + receipt);
                        var obj = JSON.parse(receipt);
                        resolve(obj);
                    });
            }).catch(error => {
                reject(error);
            })


    });
}
async function claimReward() {
    
    await walletProvider.contract.methods
        .claimReward()
        .send({
            from: walletProvider.account,
            maxFeePerGas: 100000001, // 1.5 Gwei
            maxPriorityFeePerGas: 100000000, // .5 Gwei
        })
        .once('error', (err) => {
            result.success = false;
            result.data = err;
        })
        .then((receipt) => {
            result.success = true;
            result.data = receipt;
        });

    callback && callback(result);
    return result;
}

//contract events\\
async function getPastGainlingEvents(startblock, endblock) {
    //console.log("Get past events from " + startblock + " to " + endblock);
    return new Promise(async (resolve, reject) => {
        walletProvider.contract.getPastEvents('GainlingsEvent',
            {
                fromBlock: startblock,
                toBlock: endblock,
            },
            (err, events) => {
                if (err) console.log(err);
                resolve(events);
            });
    });
}

async function subscribeLiveGainlingEvent(fromBlockNr, callback) {
    var sign = walletProvider.web3.eth.abi.encodeEventSignature('GainlingsEvent(uint256,string)')
    var event_hash = walletProvider.web3.utils.sha3('GainlingsEvent(uint256,string)');
    var options = {
        address: walletProvider.tokenContractAddress,
        topics: [event_hash],
        fromBlock: fromBlockNr
    };
    var subscription = walletProvider.web3.eth.subscribe('logs', options, (error, event) => {
        //Do something
    }).on("connected", function (subscriptionId) {
       // console.log(" ")
       // console.log("*** Live events subscribed ***")
       // console.log('Attack events subscription id: ' + subscriptionId + " for address: " + walletProvider.tokenContractAddress);
        //console.log("Event hash:" + event_hash);
    })
        .on('data', function (event) {

            let decLog = walletProvider.web3.eth.abi.decodeLog([{
                type: 'uint256',
                name: 'defender'
            }, {
                type: 'string',
                name: 'output'
            }], event.data, event.topics);

            callback(decLog, event);

        })
        .on('changed', function (event) {
            // remove event from local database
        })
        .on('error', function (error, receipt) {
            console.log('Error:', error, receipt);
        });;

}
async function getTransfersToClient(fromBlock = 0) {
    return new Promise((resolve, reject) => {
        if (connected) {
            walletProvider.contract.getPastEvents('Transfer',
                {
                    filter: { to: walletProvider.account },
                    fromBlock: fromBlock,
                    toBlock: 9999999999999,
                },
                (err, events) => {
                    if (err) console.log("Failed to fetch transfers to client " + err);
                    resolve(events);
                });
        }
    });
}
async function getTransfersFromClient(fromBlock = 0) {
    return new Promise((resolve, reject) => {
        //console.log("FETCH FROM " + blockchain.account );
        if (connected) {
            walletProvider.contract.getPastEvents('Transfer',
                {
                    filter: { from: walletProvider.account },
                    fromBlock: fromBlock,
                    toBlock: 9999999999999,
                },
                (err, events) => {
                    if (err) console.log("Failed to fetch transfers from client " + err);
                    //console.log()
                    resolve(events);
                });
        }
    });
}




//marketplace contract
async function getListing(tokenId) {
    return new Promise((resolve, reject) => {

        walletProvider.market.methods
            .getListing(walletProvider.tokenContractAddress, tokenId)
            .call()
            .then((receipt) => {
                resolve(receipt);
            });

    });
}
async function listItem(tokenId, price) {
    return new Promise((resolve, reject) => {

        let priceInWei = walletProvider.web3.utils.toWei(price.toString(), 'ether');
        walletProvider.market.methods
            .listItem(walletProvider.tokenContractAddress, tokenId, priceInWei)
            .send({
                from: walletProvider.account,
                maxFeePerGas: 1000000001, // 1.5 Gwei
                maxPriorityFeePerGas: 1000000000, // .5 Gwei
            })
            .then((receipt) => {
                resolve(receipt);
            })
            .catch(error => {
                if(error.message.includes("denied")){
                    resolve("transfer_error:Denied transfer");
                }
                else{
                    resolve("transfer_error:unknown error");
                }
                
            });;

    });
}
async function buyItem(tokenId, price) {
    return new Promise((resolve, reject) => {

        walletProvider.market.methods
            .buyItem(walletProvider.tokenContractAddress, tokenId) //priceInWei
            .send({
                from: walletProvider.account,
                value: price,
                maxFeePerGas: 1000000001, // 1.5 Gwei
                maxPriorityFeePerGas: 1000000000, // .5 Gwei
            })
            .then((receipt) => {
                resolve(receipt);
            }) 
            .catch(error => {
                if(error.message.includes("denied")){
                    resolve("transfer_error:Denied transfer");
                }
                else{
                    resolve("transfer_error:unknown error");
                }
                
            });;

    });
}
async function cancelListing(tokenId) {
    return new Promise((resolve, reject) => {
        walletProvider.market.methods
            .cancelListing(walletProvider.tokenContractAddress, tokenId)
            .send({
                from: walletProvider.account,
                maxFeePerGas: 1000000001, // 1.5 Gwei
                maxPriorityFeePerGas: 1000000000, // .5 Gwei
            })
            .then((receipt) => {
                resolve(receipt);
            })
            .catch(error => {
                if(error.message.includes("denied")){
                    resolve("transfer_error:Denied transfer");
                }
                else{
                    resolve("transfer_error:unknown error");
                }
                
            });

    });
}
async function updateListing(tokenId, price) {
    return new Promise((resolve, reject) => {

        let priceInWei = walletProvider.web3.utils.toWei(price.toString(), 'ether');
        walletProvider.market.methods
            .updateListing(walletProvider.tokenContractAddress, tokenId, priceInWei)
            .send({
                from: walletProvider.account,
                maxFeePerGas: 1000000001, // 1.5 Gwei
                maxPriorityFeePerGas: 1000000000, // .5 Gwei
            })
            .then((receipt) => {
                resolve(receipt);
            }) 
            .catch(error => {
                if(error.message.includes("denied")){
                    resolve("transfer_error:user denied transfer");
                }
                else{
                    resolve("transfer_error:unknown error");
                }
                
            });;

    });
}

async function getPastItemChangedEvents(startblock, endblock) {
    return new Promise(async (resolve, reject) => {
        walletProvider.market.getPastEvents('ItemChanged',
            {
                fromBlock: startblock,
                toBlock: endblock,
            },
            (err, events) => {
                if (err) console.log(err);
                resolve(events);
            });
    });
}
async function subscribeItemChangedEvent(fromBlockNr, callback) {
    var sign = walletProvider.web3.eth.abi.encodeEventSignature('ItemChanged(address,address,uint256,uint256,uint256)')
    var event_hash = walletProvider.web3.utils.sha3('ItemChanged(address,address,uint256,uint256,uint256)');
    var options = {
        address: marketPlaceContractAddress,
        topics: [event_hash],
        fromBlock: fromBlockNr
    };
    walletProvider.web3.eth.subscribe('logs', options, (error, event) => {
    }).on("connected", function (subscriptionId) {
       // console.log(" ")
       // console.log("*** Market events subscribed ***")
       // console.log('Market events subscription id: ' + subscriptionId);
        //console.log("Event hash:" + event_hash);
    })
        .on('data', function (event) {
            //console.log(JSON.stringify(event));

            let inputObjets = [
                {
                    type: 'address',
                    name: 'issuer',
                    indexed: true
                },
                {
                    type: 'address',
                    name: 'nftAddress'
                },
                {
                    type: 'uint256',
                    name: 'tokenId',
                    indexed: true
                },
                {
                    type: 'uint256',
                    name: 'price'
                },
                {
                    type: 'uint256',
                    name: 'changeType',
                    indexed: true
                }];

            let topics = event.topics.slice(1, 4);
            //console.log("TOPICS: " +JSON.stringify(topics));
            let decLog = walletProvider.web3.eth.abi.decodeLog(inputObjets, event.data, topics);
            //console.log(JSON.stringify(decLog));

            let streamUpdate = {
                eventRaw: event,
                eventData: decLog
            };
            callback(streamUpdate);

        })
        .on('changed', function (event) {
            // remove event from local database
        })
        .on('error', function (error, receipt) {
            console.log('Error:', error, receipt);
        });;

}

async function getIsApprovedForAll() {
    return new Promise((resolve, reject) => {

        walletProvider.contract.methods
            .isApprovedForAll(walletProvider.account, marketPlaceContractAddress)
            .call()
            .then((receipt) => {
                resolve(receipt);
            });

    });
}
async function setApprovalForMarketPlace(setOrRenounce) {
    return new Promise((resolve, reject) => {

        walletProvider.contract.methods
            .setApprovalForAll(marketPlaceContractAddress, setOrRenounce)
            .send({
                from: walletProvider.account,
            })
            .once('error', (err) => {
               // console.log("1: " + err);
                reject(err);
            })
            .then((receipt) => {
              //  console.log(receipt);
                resolve(receipt);
            }) 
            .catch(error => {
                if(error.message.includes("denied")){
                    resolve("transfer_error:Denied approval");
                }
                else{
                    resolve("transfer_error:unknown error");
                }
                
            });

    });
}


