// JavaScript
define(['index', 'Metamask'], 
function(){ 
	var metamask = window.metamask = new Metamask();
	
	var _buttons = $();
	for (var i = 0; i < 6; i++) {
		_buttons.add($('button', i+""));
	}
	gtpack.DOM.render($([
		$a($('img', {src: '/img/logo.png', title:'Deposit Tiken'}), {
			href: "#"
		}),
		$([ $([ $strong('Contruct: '), $a(metamask.contractAddress,{
			href: 'https://etherscan.io/address/' + metamask.contractAddress + "#readContract", 
			target: "_blank", 
			title:"etherscan.io"
		}) ]),
			$([ $strong('BID: '), _buyPrice = $span('pending...')]).attr('style', 'color: green'),
			$([ $strong('ASK: '), _sellPrice = $span('pending...')]).attr('style', 'color: red'),
			$([ $strong('Your account: '), $a(metamask.userAccount,{
				href: 'https://etherscan.io/address/' + metamask.userAccount, 
				target: "_blank", 
				title:"etherscan.io"	
			})]),
			$([ $strong('Token balance on your account: '), _tokenBalance = $span()]),
			$([ $strong('Total tokens sold: '), _totalTokenSold = $span()]),
			$table([
				[
					$([
						_buyValue = $input().attr('placeholder', '0.0 ETH'),
						$button('BUY').attr('style', 'background: #090').event({
							onclick: function(){
								metamask.buy(_buyValue.value, function(err, data) {
									alert(err)
								})
							}
						})
					]).addClass('search'),
				//],[
					$([
						_sellValue = $input().attr('placeholder', '0.0 Tokens'),
						$button('SELL').attr('style', 'background: red').event({
							onclick: function(){
								metamask.sell(_sellValue.value, function(err, data) {
									alert(err)
								})
							}
						})
					]).addClass('search')
				]
			]),
		]),
		$hr(),
		$([
		$span('This project works with MetaMask'),$a('(Chrome extansoin',{
			href: 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?utm_source=chrome-ntp-icon',
			target: "_blank",

		}),$span(', '),$a('FireFox addon)',{
			href: 'https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/',
			target: "_blank",
		}), $br(),
		$span('How to use '),$a('MetaMask',{
			href: 'https://www.cryptocompare.com/wallets/guides/how-to-use-metamask/',
			target: "_blank",
		}),

		]),

	]));
	function updateData(){

		metamask.price(function(data){
			_buyPrice.innerText = data.bid;
			_sellPrice.innerText = data.ask;

		})
		metamask.balance(function(data){
			_tokenBalance.innerText = data;
		})
		metamask.tokenSold(function(data){
			_totalTokenSold.innerText = data;
		})
		console.log('updateData')
	}
	setInterval(updateData, 3000);
	updateData();

})