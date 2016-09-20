var router = require('express').Router();
var Account = require('../models/account');
var Request = require('request');
var Recommendations = require('../controllers/recommendations');

router.get('/', (req, res) => {
  res.status(200).json({
    social_media_platforms: ['twitter', 'pinterest', 'facebook'],
    routes: {
      '/api': 'Default API Route',
      '/api/:username': 'GET user account by twitter id.',
      '/api/twitter/:username': 'GET tweets from username.',
      '/api/twitter/:username/alchemy/keywords': 'Get keywords from user\'s tweets.',
    }
  });
});

// GET Recommendations =========================================================
router.get('/twitter/:username', Recommendations.getTweets);

module.exports = router;
