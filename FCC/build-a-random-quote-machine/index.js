let quotes = null,
	quoteText = document.getElementById('text'),
	quoteAuthor = document.getElementById('author')


function getQuotes(){
	const url = 'quotes.json',
	initData = {
		method: 'get',
		// credentials: 'include', // include, same-origin, *omit
	    headers: {
	      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36',
	      'content-type': 'application/json'
	    },
	}

	return fetch(url, initData)
			  .then(response => {
			  	// console.log(response)
			  	return response.json()
			  })
			  .then(function(myJson) {
			  	quotes = myJson.quotes;
			  });
}


function getRandomQuote(){
	let currentQuote = quotes[Math.floor(Math.random() * quotes.length)]
		
	quoteText.innerText = currentQuote.quote;
	quoteAuthor.innerText = currentQuote.author

	console.log(currentQuote)
	console.log(quotes.length)
}

getQuotes().then(() => {
	// console.log(quotes[Math.floor(Math.random() * quotes.length)]);
	getRandomQuote()
})

document.getElementById('new-quote')
	.addEventListener('click', getRandomQuote);

let hrefContent = 'https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=' + encodeURIComponent('"' + quoteText + '" ' + quoteAuthor)
document.querySelector('#tweet-quote').setAttribute('href', hrefContent)
document.querySelector('#tweet-quote')
	.addEventListener('click', function(){
		
		console.log(this)
	})