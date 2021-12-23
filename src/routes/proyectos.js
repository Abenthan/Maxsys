const express = require('express');
const router = express.Router();
const pool = require('../database');
const moment = require('moment');
const { isLoggedIn, cuentaAbierta } = require('../lib/auth');
const { permisos } = require('../lib/helpers');

// proyectos
router.get('/', isLoggedIn, cuentaAbierta, async (req, res) => {
    const cuenta = req.session.cuenta;   
    // validamos si tiene pemisos para ver esta pagina
    const permiso = await permisos(req.user.id, cuenta.id);
    if (permiso.proyectos == 1) {
        const proyectos = await pool.query('SELECT * FROM proyectos WHERE cuenta_id = ?', [cuenta.id]);
        
        // cambio de fecha a formato dd/mm/yyyy
        for (let i = 0; i < proyectos.length; i++) {
            proyectos[i].fechaInicio = moment(proyectos[i].fechaInicio).format('DD/MM/YYYY');
        }

        res.render('proyectos/proyectos', { proyectos });

    } else {
        req.flash('message', 'No tienes permisos para ver los proyectos');
        res.redirect('/cuentas/perfilCuenta/'+ cuenta.id);
    }
});

// GET: nuevoProyecto
router.get('/nuevoProyecto', cuentaAbierta, isLoggedIn, async (req, res) => {
    const cuenta = req.session.cuenta;   
    // validamos si tiene pemisos para ver esta pagina
    const permiso = await permisos(req.user.id, cuenta.id);
    if (permiso.nuevoProyecto == 1) {
        res.render('proyectos/nuevoProyecto');
    } else {
        req.flash('message', 'No tienes permisos para crear un proyecto');
        res.redirect('/cuentas/perfilCuenta/'+ cuenta.id);
    }
});

// POST: nuevoProyecto
router.post('/nuevoProyecto',isLoggedIn, async (req, res) => {
    const { nombreProyecto, descripcionProyecto } = req.body;
    const cuenta = req.session.cuenta;
    const newProyecto = {
        nombreProyecto,
        descripcionProyecto,
        cuenta_id: cuenta.id
    };
    await pool.query('INSERT INTO proyectos SET ?', [newProyecto]);
    req.flash('success', 'Proyecto guardado correctamente');
    res.redirect('/proyectos');
});

// GET: proyecto
router.get('/proyecto/:idProyecto', cuentaAbierta, isLoggedIn, async (req, res) => {
    const cuenta = req.session.cuenta;   
    // validamos si tiene pemisos para ver esta pagina
    const permiso = await permisos(req.user.id, cuenta.id);
    if (permiso.proyecto == 1) {
        const { idProyecto } = req.params;
        const proyecto = await pool.query('SELECT * FROM proyectos WHERE idProyecto = ?', [idProyecto]);
        res.render('proyectos/proyecto', { proyecto: proyecto[0] });
    } else {
        req.flash('message', 'No tienes permisos para ver el proyecto');
        res.redirect('/cuentas/perfilCuenta/'+ cuenta.id);
    }
});

// POST: proyecto
router.post('/proyecto/:idProyecto', isLoggedIn, async (req, res) => {
    const { idProyecto } = req.params;
    const { nombreProyecto, descripcionProyecto } = req.body;
    const newProyecto = {
        nombreProyecto,
        descripcionProyecto
    };
    await pool.query('UPDATE proyectos SET ? WHERE idProyecto = ?', [newProyecto, idProyecto]);
    req.flash('success', 'Proyecto actualizado correctamente');
    res.redirect('/proyectos');
});

module.exports = router;