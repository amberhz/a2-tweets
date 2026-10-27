let writtenTweets = [];
function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	writtenTweets = runkeeper_tweets
		.map(tweet => new Tweet(tweet.text, tweet.created_at))
		.filter(tweet => tweet.source === 'completed_event' &&
						tweet.activityType === 'run' &&
						tweet.written);
}

function addEventHandlerForSearch() {
	let searchBox = document.getElementById('textFilter');

		searchBox.addEventListener('input', function() {
			let searchText = searchBox.value;

			let matchingTweets = writtenTweets.filter(tweet =>
				searchText !== '' &&
				tweet.writtenText.toLowerCase().includes(searchText.toLowerCase())
			);

			document.getElementById('searchCount').innerText = matchingTweets.length;
			document.getElementById('searchText').innerText = searchText;
			let tableRows = matchingTweets.map(function(tweet, index) {
				return tweet.getHTMLTableRow(index + 1);
			});

			document.getElementById('tweetTable').innerHTML = tableRows.join('');
		});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});