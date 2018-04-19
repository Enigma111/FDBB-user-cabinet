define(['Metamask'], function(){ 
	if(window.web3 !== undefined) {
		var abi = [
			{
			    "constant": false,
			    "inputs": [{
			        "name": "_newOwner",
			        "type": "address"
			    }],
			    "name": "setOwner",
			    "outputs": [],
			    "payable": false,
			    "stateMutability": "nonpayable",
			    "type": "function"
			}, {
			    "constant": true,
			    "inputs": [],
			    "name": "_money",
			    "outputs": [{
			        "name": "",
			        "type": "uint256"
			    }],
			    "payable": false,
			    "stateMutability": "view",
			    "type": "function"
			}, {
			    "constant": true,
			    "inputs": [{
			        "name": "addr",
			        "type": "address"
			    }],
			    "name": "balanceOf",
			    "outputs": [{
			        "name": "",
			        "type": "uint256"
			    }],
			    "payable": false,
			    "stateMutability": "view",
			    "type": "function"
			}, {
			    "constant": true,
			    "inputs": [],
			    "name": "_tokens",
			    "outputs": [{
			        "name": "",
			        "type": "uint256"
			    }],
			    "payable": false,
			    "stateMutability": "view",
			    "type": "function"
			}, {
			    "constant": true,
			    "inputs": [],
			    "name": "contractBalance",
			    "outputs": [{
			        "name": "",
			        "type": "uint256"
			    }],
			    "payable": false,
			    "stateMutability": "view",
			    "type": "function"
			}, {
			    "constant": true,
			    "inputs": [],
			    "name": "owner",
			    "outputs": [{
			        "name": "",
			        "type": "address"
			    }],
			    "payable": false,
			    "stateMutability": "view",
			    "type": "function"
			}, {
			    "constant": true,
			    "inputs": [],
			    "name": "getPrice",
			    "outputs": [{
			        "name": "bid",
			        "type": "uint256"
			    }, {
			        "name": "ask",
			        "type": "uint256"
			    }],
			    "payable": false,
			    "stateMutability": "view",
			    "type": "function"
			}, {
			    "constant": false,
			    "inputs": [],
			    "name": "buy",
			    "outputs": [],
			    "payable": true,
			    "stateMutability": "payable",
			    "type": "function"
			}, {
			    "constant": true,
			    "inputs": [],
			    "name": "balance",
			    "outputs": [{
			        "name": "",
			        "type": "uint256"
			    }],
			    "payable": false,
			    "stateMutability": "view",
			    "type": "function"
			}, {
			    "constant": true,
			    "inputs": [],
			    "name": "_sellprice",
			    "outputs": [{
			        "name": "",
			        "type": "uint256"
			    }],
			    "payable": false,
			    "stateMutability": "view",
			    "type": "function"
			}, {
			    "constant": false,
			    "inputs": [{
			        "name": "countTokens",
			        "type": "uint256"
			    }],
			    "name": "sell",
			    "outputs": [],
			    "payable": false,
			    "stateMutability": "nonpayable",
			    "type": "function"
			}, {
			    "inputs": [],
			    "payable": false,
			    "stateMutability": "nonpayable",
			    "type": "constructor"
			}, {
			    "anonymous": false,
			    "inputs": [{
			        "indexed": true,
			        "name": "from",
			        "type": "address"
			    }, {
			        "indexed": true,
			        "name": "to",
			        "type": "address"
			    }, {
			        "indexed": false,
			        "name": "value",
			        "type": "uint256"
			    }, {
			        "indexed": false,
			        "name": "status",
			        "type": "bytes32"
			    }],
			    "name": "SomeEvent",
			    "type": "event"
			}, {
			    "anonymous": false,
			    "inputs": [{
			        "indexed": true,
			        "name": "old",
			        "type": "address"
			    }, {
			        "indexed": true,
			        "name": "current",
			        "type": "address"
			    }],
			    "name": "OwnerChanged",
			    "type": "event"
			}];
		
		var ContractAdress = "0x338c6906CE36Ec61B8a74364bB29eA6CA8CF12c9";
		var DepositTikenContract = web3.eth.contract(abi);
		var Contract = this.Contract = DepositTikenContract.at(ContractAdress);

		this.contractAddress = ContractAdress;
		var userAccount = this.userAccount = web3.eth.accounts[0];
		this.buy = function(val, fn) {
			Contract.buy({from: userAccount, gas: 210000, value: web3.toWei(val, "ether")}, function(err,data){
				if(err) { 
					console.log("Error"); 
					if(fn) fn("err");
					return; 
				}
				console.log("buy", data)
				if(fn) fn(data);
			})
		}
		this.sell = function(val, fn) {
			Contract.sell(web3.toWei(val, "ether"), {from: userAccount, gas: 210000, value: 0}, function(err,data){
				if(err) { 
					console.log("Error"); 
					if(fn) fn('err');
					return; 
				}
				console.log("sell", data);
				if(fn) fn(data);
			})
		}

		this.price = function(fn){
			Contract.getPrice(function(err, data){
				if(!err) {
					var bid = web3.fromWei(data[0].toNumber(), 'ether')*1,
						ask = web3.fromWei(data[1].toNumber(), 'ether')*1;
					
					if(fn) fn({
						bid:bid.toFixed(8),
						ask:ask.toFixed(8)
					});
			    }
			})
		}
		this.tokenSold = function(fn){
			Contract._tokens(function(err, data){
				if(!err) {
					fn(web3.fromWei(data.toNumber(), 'ether'));
			    }
			})
		}
		this.balance = function(fn){
			Contract.balanceOf(userAccount, function(err, data){
				if(!err) {
					fn(web3.fromWei(data.toNumber(), 'ether'));
				}
			})
		}
	} else {
		alert("MetaMask not access!");
	}
});