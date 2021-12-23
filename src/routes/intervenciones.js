const express = require('express');
const router = express.Router();
const pool = require('../database');
const moment = require('moment');
const { isLoggedIn, cuentaAbierta } = require('../lib/auth');
const { permisos } = require('../lib/helpers');

// GET: nuevaIntervencion
router.get('/nuevaIntervencion/:idRequerimiento', isLoggedIn, async (req, res) => {
    const { idRequerimiento } = req.params;
    const requerimiento = await pool.query('SELECT * FROM requerimientos INNER JOIN cuentas ON requerimientos.cuenta_id = cuentas.id WHERE idRequerimiento = ?', [idRequerimiento]);
    const intervencion = {
        requerimiento_id: idRequerimiento,
        asuntoRequerimiento: requerimiento[0].asunto,
        cuenta_id: requerimiento[0].cuenta_id,
        nombreCuenta: requerimiento[0].nombre,
    }
    const recursos = await pool.query('SELECT idRecurso, nombreRecurso FROM recursos WHERE cuenta_id = ?', [intervencion.cuenta_id]);
    res.render('intervenciones/nuevaIntervencion', { intervencion, recursos });
});

// POST: nuevaIntervencion
router.post('/nuevaIntervencion', isLoggedIn, async (req, res) => {
    const intervencion = {
        nombreIntervencion: req.body.nombreIntervencion,
        descripcionIntervencion: req.body.descripcionIntervencion,
        conclusionIntervencion: req.body.conclusionIntervencion,
        recurso_id: req.body.recurso,
        requerimiento_id: req.body.requerimiento_id,
        cuenta_id: req.body.cuenta_id
    };
    await pool.query('INSERT INTO intervenciones SET ?', [intervencion]);
    req.flash('success', 'Intervención creada correctamente');
    res.redirect('/intervenciones/intervencionesXRequerimiento/' + intervencion.requerimiento_id)
});

// GET:  intervencionesXRequerimiento 
router.get('/intervencionesXRequerimiento/:idRequerimiento', isLoggedIn, async (req, res) => {
    const { idRequerimiento } = req.params;

    const requerimiento = await pool.query('SELECT cuentas.nombre, requerimientos.idRequerimiento, requerimientos.asunto FROM requerimientos INNER JOIN cuentas ON requerimientos.cuenta_id = cuentas.id WHERE idRequerimiento = ?', [idRequerimiento]);
    const intervenciones = await pool.query('SELECT * FROM intervenciones INNER JOIN recursos ON intervenciones.recurso_id = recursos.idRecurso WHERE requerimiento_id = ?', [idRequerimiento]);
    
    // cambio de fecha a formato dd/mm/yyyy
    for (let i = 0; i < intervenciones.length; i++) {
        intervenciones[i].fechaIntervencion = moment(intervenciones[i].fechaIntervencion).format('DD/MM/YYYY');
    }
    res.render('intervenciones/intervencionesXRequerimiento', { intervenciones, requerimiento: requerimiento[0] });
});

module.exports = router;