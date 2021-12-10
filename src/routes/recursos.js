const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isLoggedIn, cuentaAbierta } = require('../lib/auth');
const { permisos } = require('../lib/helpers');

// GET: /recursos
router.get('/', isLoggedIn, cuentaAbierta, async (req, res) => {
    const cuenta = req.session.cuenta;
    const permiso = await permisos(req.user.id, cuenta.id);
    if (permiso.recursos == 1) {
        const recursos = await pool.query('SELECT * FROM recursos WHERE cuenta_id = ?', [cuenta.id]);
        res.render('recursos/recursos', { recursos })
    } else {
        req.flash('message', 'No tienes permisos para ver los recursos');
        res.redirect('/cuentas/perfilCuenta/' + cuenta.id);
    }
});

// GET: /recursos/recurso/:idRecurso
router.get('/recurso/:idRecurso', isLoggedIn, cuentaAbierta, async (req, res) => {
    const cuenta = req.session.cuenta;
    const permiso = await permisos(req.user.id, cuenta.id);
    if (permiso.recurso == 1) {
        const { idRecurso } = req.params;
        const recursos = await pool.query('SELECT * FROM recursos WHERE idRecurso = ?', [idRecurso]);
        const recurso = {
            idRecurso: recursos[0].idRecurso,
            nombreRecurso: recursos[0].nombreRecurso,
            tipoRecurso: recursos[0].tipoRecurso,
            descripcionRecurso: recursos[0].descripcionRecurso,
            codigo: recursos[0].codigo,
            serial: recursos[0].serial,
            estado1: false,
            estado2: false,
            estado3: false,
            estado4: false,
            observaciones: recursos[0].observaciones,
            cuenta_id: recursos[0].cuenta_id
        }
        switch (recursos[0].estado) {
            case 'Disponible':
                recurso.estado1 = true;
                break;
            case 'En uso':
                recurso.estado2 = true;
                break;
            case 'En mantenimiento':
                recurso.estado3 = true;
                break;
            case 'Obsoleto':
                recurso.estado4 = true;
                break;
        }
        res.render('recursos/recurso', { recurso });
    } else {
        req.flash('message', 'No tienes permisos para ver el recurso');
        res.redirect('/recursos');
    };
});

// POST: /recursos/recurso/:idRecurso
router.post('/recurso/:idRecurso', isLoggedIn, cuentaAbierta, async (req, res) => {
    const { idRecurso } = req.params;
    const { nombreRecurso, tipoRecurso, descripcionRecurso, codigo, serial, estado, observaciones } = req.body;
    const newRecurso = {
        nombreRecurso,
        tipoRecurso,
        descripcionRecurso,
        codigo,
        serial,
        estado,
        observaciones,
        cuenta_id: req.session.cuenta.id
    };
    await pool.query('UPDATE recursos SET ? WHERE idRecurso = ?', [newRecurso, idRecurso]);
    req.flash('success', 'Recurso actualizado correctamente');
    res.redirect('/recursos');
});

// GET: nuevoRecurso
router.get('/nuevoRecurso', isLoggedIn, cuentaAbierta, async (req, res) => {
    const cuenta = req.session.cuenta;
    const permiso = await permisos(req.user.id, cuenta.id);
    if (permiso.nuevoRecurso == 1) {    
        res.render('recursos/nuevoRecurso')
    } else {
        req.flash('message', 'No tienes permisos para crear un recurso');
        res.redirect('/recursos');
    }
});

// POST: nuevoRecurso
router.post('/nuevoRecurso', isLoggedIn, async (req, res) => {
    const cuenta = req.session.cuenta;
    const { nombreRecurso, tipoRecurso, descripcionRecurso, codigo, serial, estado, observaciones } = req.body;
    const newRecurso = {
        nombreRecurso, tipoRecurso, descripcionRecurso, codigo, serial, estado, observaciones, cuenta_id: cuenta.id
    };
    await pool.query('INSERT INTO recursos set ?', [newRecurso]);
    req.flash('success', 'Recurso guardado correctamente');
    res.redirect('/recursos');
});





module.exports = router;