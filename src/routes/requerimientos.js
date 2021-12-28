const express = require('express');
const router = express.Router();
const pool = require('../database');
const moment = require('moment');
const { isLoggedIn, cuentaAbierta } = require('../lib/auth');
const { permisos } = require('../lib/helpers');

// GET: crear requerimiento
router.get('/crear', (req, res) => {
    const cuenta = req.session.cuenta;
    res.render('requerimientos/crear', { cuenta })
});

// POST: crear requerimiento
router.post('/crear', async (req, res) => {
    const cuenta = req.session.cuenta;
    const newRequerimiento = {
        asunto: req.body.asunto,
        descripcion: req.body.descripcion,
        estado: 'Abierto',
        cuenta_id: cuenta.id,
        user_id: req.user.id};    
    const idRequerimiento = await pool.query('INSERT INTO requerimientos SET ?', [newRequerimiento]);
    req.flash('success', 'Requerimiento enviado satisfactoriamente');
    res.redirect('/requerimientos/listarXUsuario');
});

//Lista de requerimientos de una cuenta 
router.get('/listarXCuenta/:id', async (req, res) => {
    //const cuenta = req.session.cuenta;
    const { id } = req.params;
    const requerimientos = await pool.query('SELECT users.username, requerimientos.asunto, requerimientos.estado FROM requerimientos INNER JOIN users ON requerimientos.user_id = users.id WHERE cuenta_id = ?', [id]);
    res.render('requerimientos/listarXCuenta', { requerimientos });
});

// Lista de requerimientos de un proyecto
router.get('/listarXProyecto/:idProyecto', async (req, res) => {
    const { idProyecto } = req.params;
    const proyecto = await pool.query('SELECT * FROM proyectos WHERE idProyecto = ?', [idProyecto]);
    const requerimientos = await pool.query('SELECT * FROM requerimientos WHERE proyecto_id = ?', [idProyecto]);
    console.log(requerimientos);
    
    res.render('requerimientos/listarXProyecto', { proyecto: proyecto[0], requerimientos });
});



// GET: Requerimiento
router.get('/requerimiento/:idRequerimiento',isLoggedIn, async (req, res) => {
    const { idRequerimiento } = req.params;
    const requerimientos = await pool.query('SELECT * FROM requerimientos WHERE idRequerimiento = ?', [idRequerimiento]);
    if (requerimientos.length > 0) {
        const requerimiento = {
            idRequerimiento,
            asunto: requerimientos[0].asunto,
            descripcion: requerimientos[0].descripcion,
            conclusion: requerimientos[0].conclusion,
            estadoAbierto: false,
            estadoCerrado: false,
            cuenta_id: requerimientos[0].cuenta_id,
            permisoProyecto: false
        };
        switch (requerimientos[0].estado) {
            case 'Abierto':
                requerimiento.estadoAbierto = true;
                break;
            case 'Cerrado':
                requerimiento.estadoCerrado = true;
                break;
            default:
                break;
        }
        const permiso = await permisos(req.user.id, requerimiento.cuenta_id);
        if (permiso.requerimiento) {
            var proyectos = '';
            if (permiso.perfil == 'propietario' || permiso.perfil == 'soporte') {
                requerimiento.permisoProyecto = true;
                proyectos = await pool.query('SELECT * FROM proyectos WHERE cuenta_id = ?', [requerimiento.cuenta_id]);
            }
            
            res.render('requerimientos/requerimiento', { requerimiento, proyectos });
        } else {
            req.flash('message', 'No tienes permisos para ver este requerimiento');
            res.redirect('/requerimientos/listarXUsuario');
        }
    }else{
        req.flash('message', 'No existe el requerimiento');
        res.redirect('/requerimientos/listarXUsuario');
    }
  
});

// POST: Requerimiento 
router.post('/requerimiento/:idRequerimiento', async (req, res) => {
    const { idRequerimiento } = req.params;
    const { proyecto, conclusion, estado } = req.body;
    console.log(req.body);
/*     switch (estado) {
        case 'Abierto':
            await pool.query('UPDATE requerimientos SET estado = ?, conclusion = ?, proyecto_id = ? WHERE idRequerimiento = ?', [ estado, conclusion, proyecto, idRequerimiento]);
            break;

        case 'Cerrado':
            const fechaFinalizacion = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            await pool.query('UPDATE requerimientos SET fechaFinalizacion = ?, estado = ?, conclusion = ?, proyecto_id = ? WHERE idRequerimiento = ?', [ fechaFinalizacion, estado, conclusion, proyecto, idRequerimiento]);
            break;

        default:
            req.flash('message', 'El estado debe ser Abierto o Cerrado');
            res.redirect('/requerimientos/requerimiento/' + idRequerimiento);
            break;
    } */
    req.flash('success', 'Requerimiento actualizado correctamente');
    res.redirect('/requerimientos/listarXUsuario');
    
});



//Listar todos los requerimientos
router.get('/listar', async (req, res) => {
    const cuenta = req.session.cuenta;
    const requerimientos = await pool.query('SELECT * FROM requerimientos');
    res.render('requerimientos/listar', { requerimientos, cuenta });
});

//Listar todos los requerimientos del usuario
router.get('/listarXUsuario', async (req, res) => {
    const consulta = "SELECT requerimientos.idRequerimiento, requerimientos.asunto, requerimientos.estado, cuentas.nombre FROM requerimientos INNER JOIN cuentas ON requerimientos.cuenta_id = cuentas.id INNER JOIN cuentasUsuario ON cuentas.id = cuentasUsuario.cuenta_id INNER JOIN permisosCuentaUsuario ON cuentasUsuario.id = permisosCuentaUsuario.cuentasUsuario_id WHERE cuentasUsuario.user_id = ? AND permisosCuentaUsuario.reqListarXUsuario = 1";
    const requerimientos = await pool.query(consulta, [req.user.id]);
    res.render('requerimientos/listarXUsuario', { requerimientos });
});

module.exports = router;