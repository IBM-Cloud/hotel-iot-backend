var Twitter = require('twitter');
var Yelp = require('yelp');
var Watson = require('watson-developer-cloud');
var Promise = require('bluebird');

Promise.promisifyAll(Twitter);

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var yelp = new Yelp({
  consumer_key: process.env.YELP_CONSUMER_KEY,
  consumer_secret: process.env.YELP_CONSUMER_SECRET,
  token: process.env.YELP_TOKEN,
  token_secret: process.env.YELP_TOKEN_SECRET,
});


var alchemy_language = new Watson.alchemy_language({
  api_key: process.env.ALCHEMY_KEY,
});

var conversation = Watson.conversation({
  username: process.env.CONVERSATION_USERNAME,
  password: process.env.CONVERSATION_PASSWORD,
  version: 'v1',
  version_date: '2016-07-01'
});

module.exports.getTweets = function(req, res) {
  getTweets(req.params.username).then(function (data) {
    var promises = [];

    for (var i = 0; i < data.length; i++) {
      var promise = getKeywords(data[i].text);
      promises.push(promise);
    }

    Promise.all(promises).then(function(data) {
      var apiPromises = [];

      for (var j = 0; j < data.length; j++) {
        var apiPromise = getAPI(data[j].tweet);
        apiPromises.push(apiPromise);
        console.log(apiPromises);
      }

      Promise.all(apiPromises).then(function(d) {
        console.log(d);
        res.json(d);
      }).catch(function(error) {
        res.json(error);
      });
    });
  }).catch(function(error) {
    res.json(error);
  });
}

function getTweets(username) {
  return new Promise(function(resolve, reject) {
    client.get('statuses/user_timeline', {
      screen_name: username,
      count: 5
    }, function(error, tweets) {
      if (error) reject(error);
      else resolve(tweets);
    });
  });
}

function getKeywords(text) {
  return new Promise(function(resolve, reject) {
    var parameters = {
      extract: 'keywords',
      text: text
    };

    alchemy_language.combined(parameters, function(error, data) {
      if(error) reject(error);
      else
        result = {
          tweet: parameters.text,
          keywords: data.keywords
        }
        resolve(result);
    });
  });
}

function getAPI(text) {
  return new Promise(function(resolve, reject) {
    conversation.message({
      workspace_id: process.env.CONVERSATION_WORKSPACE_ID,
      input: {'text': text.trim().replace(/(\r\n|\n|\r)/gm," ")}
    }, function(error, response) {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
}
