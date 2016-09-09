var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

module.exports = function (app) {
  app.get("/api", function(req, res) {
    res.json({message: 'Welcome to the API!'});
  });

  app.get("/api/:id", function(req, res) {
    res.json({message: `The id is: ${req.params.id}`});
  });

  app.get("/api/twitter/:username/statuses/user_timeline", function(req, res) {
    client.get('statuses/user_timeline', {screen_name: req.params.id, count: 5}, function(error, tweets, response) {
      if (!error) {
        // var messages = [];
        // for(var i = 0; i < tweets.length; i++) {
        //   messages.push(tweets[i].text);
        // }
        // res.status(200).json({title: 'Express', tweets: messages});
        res.status(200).json({tweets: tweets});
      } else {
        res.status(500).json({error: error});
      }
    });
  });
}
