const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/crear', (req, res) => {
    const cuenta = req.session.cuenta;
    res.render('requerimientos/crear', { cuenta })
});

router.post('/crear', async (req, res) => {
    const cuenta = req.session.cuenta;
    const newRequerimiento = {
        asunto: req.body.asunto,
        descripcion: req.body.descripcion,
        cuenta_id: cuenta.id,
        user_id: req.user.id};    
    const idRequerimiento = await pool.query('INSERT INTO requerimientos SET ?', [newRequerimiento]);
    req.flash('success', 'Requerimiento enviado satisfactoriamente');
    res.redirect('../cuentas/perfilcuenta/' + cuenta.id);
});

router.get('/', async (req, res) =>{
    const requerimientos = await pool.query('SELECT * FROM requerimientos');
    const cuenta = req.session.cuenta;
    res.render('requerimientos/requerimientos', { requerimientos, cuenta })
});
module.exports = router;