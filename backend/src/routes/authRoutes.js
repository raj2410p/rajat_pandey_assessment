const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/health', (req, res) => res.status(200).send('OK'));

module.exports = router;
