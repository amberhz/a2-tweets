function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	
	let earliestDate = tweet_array[0].time;
	let latestDate = tweet_array[0].time;
	for (let tweet of tweet_array) {
    	if (tweet.time < earliestDate) {
        	earliestDate = tweet.time;
    	}
		if (tweet.time > latestDate) {
        latestDate = tweet.time;
    	}
	}
	document.getElementById('firstDate').innerText =
    earliestDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
		timeZone: 'UTC'
    });

	document.getElementById('lastDate').innerText =
    latestDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
		timeZone: 'UTC'
    });

	let completedTweets = tweet_array.filter(tweet => tweet.source === 'completed_event');
	let liveTweets = tweet_array.filter(tweet => tweet.source === 'live_event');
	let achievementTweets = tweet_array.filter(tweet => tweet.source === 'achievement');
	let miscellaneousTweets = tweet_array.filter(tweet => tweet.source === 'miscellaneous');

	document.querySelectorAll('.completedEvents').forEach(function(element) {
   		element.innerText = completedTweets.length;
	});
	document.querySelector('.liveEvents').innerText = liveTweets.length;
	document.querySelector('.achievements').innerText = achievementTweets.length;
	document.querySelector('.miscellaneous').innerText = miscellaneousTweets.length;

	document.querySelector('.completedEventsPct').innerText = (completedTweets.length / tweet_array.length * 100).toFixed(2) + '%';
	document.querySelector('.liveEventsPct').innerText = (liveTweets.length / tweet_array.length * 100).toFixed(2) + '%';
	document.querySelector('.achievementsPct').innerText = (achievementTweets.length / tweet_array.length * 100).toFixed(2) + '%';
	document.querySelector('.miscellaneousPct').innerText = (miscellaneousTweets.length / tweet_array.length * 100).toFixed(2) + '%';

	let writtenTweets = completedTweets.filter(tweet => tweet.written);

	document.querySelector('.written').innerText = writtenTweets.length;

	document.querySelector('.writtenPct').innerText =
		(writtenTweets.length / completedTweets.length * 100).toFixed(2) + '%';
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});