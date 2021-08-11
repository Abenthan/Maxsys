const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/add', isLoggedIn, (req, res) => {
    res.render('cuentas/add')
});

router.post('/add', isLoggedIn, async (req, res) => {

    try {
        // Insertamos registro en cuentas
        const { nombre } = req.body;
        const newCuenta = {
            nombre,
            superUser: req.user.id
        };

        await pool.query('INSERT INTO cuentas SET ?', [newCuenta]);

        // averiguamos el id de la cuenta

        const idCuenta = await pool.query('SELECT id FROM cuentas WHERE nombre = ? AND superUser = ?', [newCuenta.nombre, newCuenta.superUser]);

        // Insertamos registro en cuentasUsuario

        const newCuentaUsuario = {
            tipo: 1,
            habilitar: 1,
            user_id: req.user.id,
            cuenta_id: idCuenta[0].id
        };

        await pool.query('INSERT INTO cuentasUsuario SET ?', [newCuentaUsuario]);

        req.flash('success', 'Cuenta agregada satisfactoriamente');
        res.redirect('/cuentas');

    }
    catch (e) {
        res.send(e);
    }
});

router.get('/', isLoggedIn, async (req, res) => {
    const cuentas = await pool.query('SELECT * FROM cuentas');
    res.render('cuentas/list', { cuentas });
});


router.get('/perfilCuenta/*', isLoggedIn, async (req, res) => {
    const idCuenta = req.url.replace('/perfilCuenta/', '');
    const ccuenta = await pool.query('SELECT * FROM cuentas WHERE id = ?', idCuenta);
    req.session.cuenta = ccuenta[0];
    req.app.locals.cuenta = req.session.cuenta;
    res.render('cuentas/perfilCuenta')

    //const cuenta = req.session.cuenta;
    //res.render('cuentas/perfilCuenta', { cuenta })
});




module.exports = router;