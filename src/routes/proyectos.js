const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');
const { permisos } = require('../lib/helpers');

// proyectos
router.get('/', isLoggedIn, async (req, res) => {
    const cuenta = req.session.cuenta;
    // validamos si tiene pemisos para ver esta pagina
    
    const permiso = await permisos(req.user.id, cuenta.id);
    if (permiso.proyectos == 1) {
        const proyectos = await pool.query('SELECT * FROM proyectos WHERE cuenta_id = ?', [cuenta.id]);
        res.render('proyectos/proyectos', { proyectos });
    } else {
        req.flash('message', 'No tienes permisos para ver los proyectos');
        res.redirect('/cuentas/perfilCuenta/'+ cuenta.id);
    }
});

// nuevo proyecto
router.get('/nuevoProyecto', isLoggedIn, async (req, res) => {
    res.render('proyectos/nuevoProyecto');
});

// guardar nuevo proyecto
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
    res.redirect('/proyectos/nuevoProyecto');
});






module.exports = router;