const express = require('express');

const GithubAuthController = require('../../../controllers/githubAuthController');

const router = express.Router();

router.get('/',GithubAuthController.redirectToGithub);

router.get('/callback',GithubAuthController.githubLogin);

module.exports = router;