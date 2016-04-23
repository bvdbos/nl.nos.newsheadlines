"use strict";

exports.init = function () {

	// Set the standard number of news headlines to 3
	Homey.manager('settings').set('numberOfNewsArticles', 3);
	var headlineKeywords = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight'];

	// Homey checks if it should read the news
	Homey.manager('flow').on('action.readNews', function(callback) {
		// Read the news
		// Download news headlines in JSON format,
		// and formulate the news headlines
		Homey.log('News headlines are being downloaded');
		require('http.min').json('http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=100&q=http://feeds.feedburner.com/euronews/en/news/').then(function (data) {

			// Concatenate everything
			var newsHeadlines = [];
			var maxNews = Homey.manager('settings').get('numberOfNewsArticles');
				maxNews = (maxNews > 8 ? 8 : (maxNews < 1 ? 1 : maxNews)); // Minimum of 1 article, maximum of 8 articles (~source limit)
			newsHeadlines.push('Your recent news headlines.');

			for(var i = 0; i < maxNews; i++) {
				newsHeadlines.push(headlineKeywords[i] + ': ' + data.responseData.feed.entries[i].title);
			}

			// Spread the word
			for(var i = 0; i < newsHeadlines.length; i++) {
				Homey.manager('speech-output').say(__(newsHeadlines[i]));
			}

		});
		// Callback
		callback();
	});

	// Homey checks for the news headlines to be triggered
	// i.e. through phrases like
	// What are the news headlines?
	// What is the recent news?
	Homey.manager('speech-input').on('speech', function(speech,callback) {
		// Iterate over every possible trigger as specified in
		// app.json
		speech.triggers.forEach(function(trigger) {
		// Check if the newsheadline trigger is triggered
			if(trigger.id === 'newsheadline') {
				// Read the news
				// Download news headlines in JSON format,
				// and formulate the news headlines
				Homey.log('News headlines are being downloaded');
				require('http.min').json('http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=100&q=http://feeds.feedburner.com/euronews/en/news/').then(function (data) {

					// Concatenate everything
					var newsHeadlines = [];
					var maxNews = Homey.manager('settings').get('numberOfNewsArticles');
						maxNews = (maxNews > 8 ? 8 : (maxNews < 1 ? 1 : maxNews)); // Minimum of 1 article, maximum of 8 articles (~source limit)
					newsHeadlines.push('Your recent news headlines.');

					for(var i = 0; i < maxNews; i++) {
						newsHeadlines.push(headlineKeywords[i] + ': ' + data.responseData.feed.entries[i].title);
					}

					// Spread the word
					for(var i = 0; i < newsHeadlines.length; i++) {
						Homey.manager('speech-output').say(__(newsHeadlines[i]));
					}

				});
			}
		});

	});

};

