function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	let completedTweets = tweet_array.filter(tweet => tweet.source === 'completed_event');

	let activityCounts = {};

	completedTweets.forEach(function(tweet) {
		let activity = tweet.activityType;

		if (activityCounts[activity] === undefined) {
			activityCounts[activity] = 0;
		}

		activityCounts[activity]++;
	});

	let sortedActivities = Object.entries(activityCounts).sort((a, b) => b[1] - a[1]);

	let activityData = sortedActivities.map(function(item) {
		return {
			activity: item[0],
			count: item[1]
		};
	});
	let topThree = sortedActivities.slice(0, 3).map(item => item[0]);

	let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	let distanceData = completedTweets
		.filter(tweet => topThree.includes(tweet.activityType) && tweet.distance > 0)
		.map(function(tweet) {
			return {
				activity: tweet.activityType,
				distance: tweet.distance,
				day: days[tweet.time.getUTCDay()]
			};
		});
		
	document.getElementById('numberActivities').innerText = sortedActivities.length;
	document.getElementById('firstMost').innerText = sortedActivities[0][0];
	document.getElementById('secondMost').innerText = sortedActivities[1][0];
	document.getElementById('thirdMost').innerText = sortedActivities[2][0];
	document.getElementById('longestActivityType').innerText = 'bike';
	document.getElementById('shortestActivityType').innerText = 'walk';
	document.getElementById('weekdayOrWeekendLonger').innerText = 'weekends';

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": activityData
	  },
	  "mark": "bar",
	  "encoding": {
        "x": {
            "field": "count",
            "type": "quantitative",
            "title": "Number of Tweets"
            },
        "y": {
            "field": "activity",
            "type": "nominal",
            "sort": "-x",
            "title": "Activity Type"
            }
        },
        "width": 600,
        "height": 550
    };


	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	let distance_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "Distances of the three most popular activities by day of the week.",
		"data": {
			"values": distanceData
		},
		"mark": {
			"type": "point",
			"opacity": 0.3
		},
		"encoding": {
			"x": {
				"field": "day",
				"type": "ordinal",
				"sort": days,
				"title": "Day of the Week"
			},
			"y": {
				"field": "distance",
				"type": "quantitative",
				"title": "Distance (Miles)"
			},
			"color": {
				"field": "activity",
				"type": "nominal",
				"title": "Activity Type"
			}
		}
	};

vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});
document.getElementById('distanceVis').style.display = 'block';
	let distance_mean_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "Average distances by activity and day of the week.",
		"data": {
			"values": distanceData
		},
		"mark": "point",
		"encoding": {
			"x": {
				"field": "day",
				"type": "ordinal",
				"sort": days,
				"title": "Day of the Week"
			},
			"y": {
				"field": "distance",
				"type": "quantitative",
				"aggregate": "mean",
				"title": "Average Distance (Miles)"
			},
			"color": {
				"field": "activity",
				"type": "nominal",
				"title": "Activity Type"
			}
		}
	};

vegaEmbed('#distanceVisAggregated', distance_mean_spec, {actions:false});

document.getElementById('distanceVisAggregated').style.display = 'none';
let showMeans = false;

document.getElementById('aggregate').addEventListener('click', function() {
    showMeans = !showMeans;

    document.getElementById('distanceVis').style.display =
        showMeans ? 'none' : 'block';

    document.getElementById('distanceVisAggregated').style.display =
        showMeans ? 'block' : 'none';

    this.innerText = showMeans ? 'Show all activities' : 'Show means';
});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});