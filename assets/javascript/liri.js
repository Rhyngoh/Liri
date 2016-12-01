//Require node packet modules
var Twitter = require('twitter');
var requireTwitter = require("./keys.js");
var spotify = require('spotify');
var request = require('request');
var fs = require("fs");
//Stores an array for Liri do-what-it-says
var doWhatItDo = [];

var client = new Twitter({
  consumer_key: requireTwitter.twitterKeys.consumer_key,
  consumer_secret: requireTwitter.twitterKeys.consumer_secret,
  access_token_key: requireTwitter.twitterKeys.access_token_key,
  access_token_secret: requireTwitter.twitterKeys.access_token_secret
});
//function myTweets to show 20 most recent tweets
function myTweets(){
	var params = {screen_name: 'rhyngoh', count: 20};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	    for(var i = 0; i < tweets.length;i++){
	    	console.log("Tweet #" + (i + 1));
	    	console.log(tweets[i].created_at);
	    	console.log(tweets[i].text);
	    	console.log("------------------");
	    	var logTweet = "\nTweet #" + (i+1) + "\n" + tweets[i].created_at + "\n" + tweets[i].text + "\n------------------";
	    	fs.appendFile("log.txt", logTweet);
	    }
	  }
	  console.log("\nYou're welcome.");
	});
}
//function how many arguments if the user wants to put spaces in argument (search for "The Dark Knight")
var argArray = [];
var argString = "";
function howManyArgs(){
	for(var k = 3; k < process.argv.length;k++){
		//push each argument into argArray
		argArray.push(process.argv[k]);
	}
	//Turn the array into a string by joining at the spaces
	argString = "'" + argArray.join(" ") + "'";
}
//function to perform a spotify search on a certain argument
function spotifyDatSong(){
	spotify.search({ type: 'track', query: argString }, function(err, data) {
    if ( err ) {
        console.log('Error occurred: ' + err);
        return;
    }
    if(data.tracks.items.length === 0){
    	console.log("Could not find any tracks with these search terms: " + argString + "\nTry another search.\n\nYou're welcome.");

    } else{
    	var numberOfArtists = "";
	    for(var j = 0; j < data.tracks.items[0].artists.length;j++){
	    	if(j>0){
	    		numberOfArtists += ", " + data.tracks.items[0].artists[j].name;
	    	}
	    	else {
	    		numberOfArtists += data.tracks.items[0].artists[j].name;
	    	}
	    }
	    console.log("\nArtists: " + numberOfArtists);
	    console.log("Song name: " + data.tracks.items[0].name);
	    console.log("Preview song: " + data.tracks.items[0].preview_url);
	    console.log("Album: " + data.tracks.items[0].album.name + "\n\nYou're welcome.");
	    var logSpotify = "\nArtists: " + numberOfArtists + "\nSong name: " + data.tracks.items[0].name + "\nPreview Song: " + data.tracks.items[0].preview_url + "\nAlbum: " + data.tracks.items[0].album.name + "\n------------------";
    	fs.appendFile("log.txt", logSpotify);
    }
    
});
}
//function to perform an omdb search on a certain argument
function omdbDatMovie(){
	var omdbString = argString.replace(" ", "%20");
	request('http://www.omdbapi.com/?t=' + omdbString + '&y=&plot=short&r=json&tomatoes=true', function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    console.log("\nMovie Title: " + JSON.parse(body).Title);
	    console.log("Year: " + JSON.parse(body).Year);
	    console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
	    console.log("Country: " + JSON.parse(body).Country);
	    console.log("Language: " + JSON.parse(body).Language);
	    console.log("Plot: " + JSON.parse(body).Plot);
	    console.log("Actors: " + JSON.parse(body).Actors);
	    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).tomatoMeter);
	    console.log("Rotten Tomatoes URL: " + JSON.parse(body).tomatoURL + "\n\nYou're welcome.");
	    var logOMDB = "\nMovie Title: " + JSON.parse(body).Title + "\nYear: " + JSON.parse(body).Year + "\nIMDB Rating: " + JSON.parse(body).imdbRating + 
	    "\nCountry: " + JSON.parse(body).Country + "\nLanguage: " + JSON.parse(body).Language + "\nPlot: " + JSON.parse(body).Plot + 
	    "\nActors: " + JSON.parse(body).Actors + "\nRotten Tomatoes Rating: " + JSON.parse(body).tomatoMeter + "\nRotten Tomatoes URL: " + JSON.parse(body).tomatoURL + "\n------------------";
	  	fs.appendFile("log.txt", logOMDB);
	  } else{
	  	console.log("Could not find any movies with these search terms: " + argString + "\nTry another search.\n\nYou're welcome.");
	  }
	})
}
//What happens on user input:
//If no input, throw some console logs
if(process.argv[2] === undefined){
	console.log("Liri detects you don't know what you're doing. Let Liri help you.\n\nList of commands: \nmy-tweets: Shows your last 20 tweets and when they were created\nspotify-this-song '<song name here>': Shows information about a song\nmovie-this '<movie name here>': Shows information about a movie\ndo-what-it-says: Takes text from a txt file to call a command\n\nYou're Welcome.");
} else
if(process.argv[2] === "my-tweets"){
	myTweets();
} else
if(process.argv[2] === "spotify-this-song"){
	if(process.argv[3] === undefined){
		argString = "The Sign Ace of Base";
		console.log("You didn't specify a song. Liri knows you wanted to search this song: 'The Sign' by Ace of Base.");
		spotifyDatSong();
	} else {
		howManyArgs();
		console.log("Liri detects you want to search for a song with these keywords: " + argString );
		spotifyDatSong();
	}
} else
if(process.argv[2] === "movie-this"){
	if(process.argv[3] === undefined){
		argString = "Mr.Nobody";
		console.log("You didn't specify a movie. Liri knows you wanted to search for: 'Mr. Nobody'");
		omdbDatMovie();
	} else {
		howManyArgs();
		console.log("Liri detects you want to search for a movie with these keywords: " + argString);
		omdbDatMovie();
	}
} else
if(process.argv[2] === "do-what-it-says"){
	fs.readFile("./../../random.txt", "utf8", function(err, data){
		doWhatItDo = data.split(",");
		if(doWhatItDo[0] === "my-tweets"){
			myTweets();
		} else
		if(doWhatItDo[0] === "spotify-this-song"){
			if(doWhatItDo[1] === undefined){
				argString = "The Sign Ace of Base";
				console.log("You didn't specify a song. Liri knows you wanted to search this song: 'The Sign' by Ace of Base.");
				spotifyDatSong();
			} else {
				argString = doWhatItDo[1];
				console.log("Liri detects you want to search for a song with these keywords: " + doWhatItDo[1] );
				spotifyDatSong();
			}
		} else
		if(doWhatItDo[0] === "movie-this"){
			if(doWhatItDo[1] === undefined){
				argString = "Mr.Nobody";
				console.log("You didn't specify a movie. Liri knows you wanted to search for: 'Mr. Nobody'");
				omdbDatMovie();
			} else {
				argString = doWhatItDo[1];
				console.log("Liri detects you want to search for a movie with these keywords: " + doWhatItDo[1] );
				omdbDatMovie();
			}
		} else {
			console.log("Liri detects you don't know what you're doing. Liri will assist you.\n\nList of commands: \nmy-tweets: Shows your last 20 tweets and when they were created\nspotify-this-song '<song name here>': Shows information about a song\nmovie-this '<movie name here>': Shows information about a movie\ndo-what-it-says: Takes text from a txt file to call a command\n\nYou're Welcome.");
		}
	});
}
else {
	//if mistyped anything, throw a console log
	console.log("Liri detects you don't know what you're doing. Liri will assist you.\n\nList of commands: \nmy-tweets: Shows your last 20 tweets and when they were created\nspotify-this-song '<song name here>': Shows information about a song\nmovie-this '<movie name here>': Shows information about a movie\ndo-what-it-says: Takes text from a txt file to call a command\n\nYou're Welcome.");
}