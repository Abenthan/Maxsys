const express = require('express');
const { serializeUser } = require('passport');
const router = express.Router();

router.get('/', (req, res) => {
    
    res.redirect('perfil');
});

module.exports = router;
