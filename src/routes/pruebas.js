const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
   res.redirect('pruebas/prueba1')
});

router.get('/prueba1', (req, res) => {
    
    res.render('pruebas')
});

module.exports = router;