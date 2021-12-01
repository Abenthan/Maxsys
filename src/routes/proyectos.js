const express = require('express');
const router = express.Router();
const pool = require('../database');

// proyectos
router.get('/', async (req, res) => {
    const cuenta = req.session.cuenta;
    const proyectos = await pool.query('SELECT * FROM proyectos WHERE cuenta_id = ?', [cuenta.id]);
    res.render('proyectos/proyectos', { proyectos });
});

// nuevo proyecto
router.get('/nuevoProyecto', async (req, res) => {
    res.render('proyectos/nuevoProyecto');
});

// guardar nuevo proyecto
router.post('/nuevoProyecto', async (req, res) => {
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