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

//Lista de requerimientos de una cuenta 
router.get('/listarXCuenta/:id', async (req, res) => {
    //const cuenta = req.session.cuenta;
    const { id } = req.params;
    const requerimientos = await pool.query('SELECT users.username, requerimientos.asunto, requerimientos.estado FROM requerimientos INNER JOIN users ON requerimientos.user_id = users.id WHERE cuenta_id = ?', [id]);
    console.log(requerimientos);
    res.render('requerimientos/listarXCuenta', { requerimientos });
});

//Listar todos los requerimientos
router.get('/listar', async (req, res) => {
    const cuenta = req.session.cuenta;
    const requerimientos = await pool.query('SELECT * FROM requerimientos');
    res.render('requerimientos/listar', { requerimientos, cuenta });
});

//Listar todos los requerimientos del usuario
router.get('/listarXUsuario', async (req, res) => {
    const cuenta = req.session.cuenta;
    const requerimientos = await pool.query('SELECT idRequerimiento, cuentas.nombre, asunto, estado FROM requerimientos INNER JOIN cuentas ON requerimientos.cuenta_id = cuentas.id WHERE user_id = ?', [req.user.id]);
    res.render('requerimientos/listarXUsuario', { requerimientos, cuenta });
});

module.exports = router;