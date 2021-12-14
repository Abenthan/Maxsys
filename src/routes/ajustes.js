const express = require('express');
const router = express.Router();
const pool = require('../database');

const { permisos } = require('../lib/helpers');

router.get('/consultaEmail', (req, res) => {
    res.render('ajustes/consultaEmail')
})

// POST consultaEmail
router.post('/consultaEmail', async (req, res) => {
    const { email } = req.body;
    const usuario = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (usuario.length > 0) {
        const permisosCU = await permisos(usuario[0].id, req.session.cuenta.id);
        const permisosCuenta = {
            fullname: usuario[0].fullname,
            username: usuario[0].username,
            user_id: permisosCU.user_id,
            cuenta_id: permisosCU.cuenta_id,
            perfilPropietario: permisosCU.perfilPropietario,
            perfilAdministrador: false,
            perfilSoporte: false,
            perfilEstandar: false,
            usuariosCuenta: permisosCU.usuariosCuenta,
            consultaEmail: permisosCU.consultaEmail,
            permisosCuentaUsuario: permisosCU.permisosCuentaUsuario,
            requerimiento: permisosCU.requerimiento,
            reqListarXUsuario: permisosCU.reqListarXUsuario,
            reqListarXCuenta: permisosCU.reqListarXCuenta,
            reqCrear: permisosCU.reqCrear,
            nuevoProyecto: permisosCU.nuevoProyecto,
            proyectos: permisosCU.proyectos,
            proyecto: permisosCU.proyecto,
            recursos: permisosCU.recursos,
            recurso: permisosCU.recurso,
            nuevoRecurso: permisosCU.nuevoRecurso
        };
        switch (permisosCU.perfil) {
            case 'propietario':
                permisosCuenta.perfilPropietario = true;
                break;

            case 'administrador':   
                permisosCuenta.perfilAdministrador = true;
                break;
            case 'soporte':
                permisosCuenta.perfilSoporte = true;
                break;
            case 'estandar':
                permisosCuenta.perfilEstandar = true;
                break;
        }
        res.render('ajustes/permisosUsuario', { permisosCuenta });

    } else {
        res.send('No existe el email');
    }
})

// GET permisosUsuario
router.get('/permisosUsuario/:user_id', async (req, res) => {
    const { user_id } = req.params;
    const usuario = await pool.query('SELECT * FROM users WHERE id = ?', [user_id]);
    if (usuario.length > 0) {
        const permisosCU = await permisos(usuario[0].id, req.session.cuenta.id);
        const permisosCuenta = {
            fullname: usuario[0].fullname,
            username: usuario[0].username,
            user_id: permisosCU.user_id,
            cuenta_id: permisosCU.cuenta_id,
            perfilPropietario: false,
            perfilAdministrador: false,
            perfilSoporte: false,
            perfilEstandar: false,
            usuariosCuenta: permisosCU.usuariosCuenta,
            consultaEmail: permisosCU.consultaEmail,
            permisosCuentaUsuario: permisosCU.permisosCuentaUsuario,
            requerimiento: permisosCU.requerimiento,
            reqListarXUsuario: permisosCU.reqListarXUsuario,
            reqListarXCuenta: permisosCU.reqListarXCuenta,
            reqCrear: permisosCU.reqCrear,
            nuevoProyecto: permisosCU.nuevoProyecto,
            proyectos: permisosCU.proyectos,
            proyecto: permisosCU.proyecto,
            recursos: permisosCU.recursos,
            recurso: permisosCU.recurso,
            nuevoRecurso: permisosCU.nuevoRecurso
        };
            
        switch (permisosCU.perfil) {
            case 'propietario':   
                permisosCuenta.perfilPropietario = true;
                break;            
            case 'administrador':   
                permisosCuenta.perfilAdministrador = true;
                break;
            case 'soporte':
                permisosCuenta.perfilSoporte = true;
                break;
            case 'estandar':
                permisosCuenta.perfilEstandar = true;
                break;
        }
        
        res.render('ajustes/permisosUsuario', { permisosCuenta });

    }else{  
        res.send('No existe el usuario');
    }
    
})


// post permisosUsuario
router.post('/permisosUsuario', async (req, res) => {
    function unocero (numero) {
        if (numero != 1) {
            numero=0;
        }
        return numero;
    }

    const cuenta_id = req.session.cuenta.id;
    const user_id = Number(req.body.user_id);
    const perfil = req.body.perfil;
    const usuariosCuenta = unocero(req.body.usuariosCuenta);
    const consultaEmail = unocero(req.body.consultaEmail);
    const permisosCuentaUsuario = unocero(req.body.permisosCuentaUsuario);
    const requerimiento = unocero(req.body.requerimiento);
    const reqListarXUsuario = unocero(req.body.reqListarXUsuario);
    const reqListarXCuenta = unocero(req.body.reqListarXCuenta);
    const reqCrear = unocero(req.body.reqCrear);
    const nuevoProyecto = unocero(req.body.nuevoProyecto);
    const proyectos = unocero(req.body.proyectos);
    const proyecto = unocero(req.body.proyecto);
    const recursos = unocero(req.body.recursos);
    const recurso = unocero(req.body.recurso);
    const nuevoRecurso = unocero(req.body.nuevoRecurso);


    //Buscar en cuentasUsuario el id del nuevo usuario y la cuenta
    const cuentasUsuario = await pool.query('SELECT * FROM cuentasUsuario WHERE user_id = ? AND cuenta_id = ?', [user_id, cuenta_id]);

    const CU = {
        user_id: user_id,
        cuenta_id: cuenta_id,
        perfil: perfil,
        habilitar: 1
    }

    const permisosCU = {
        usuariosCuenta: usuariosCuenta,
        consultaEmail: consultaEmail,
        permisosCuentaUsuario: permisosCuentaUsuario,
        requerimiento: requerimiento,
        reqListarXUsuario: reqListarXUsuario,
        reqListarXCuenta: reqListarXCuenta,
        reqCrear: reqCrear,
        nuevoProyecto: nuevoProyecto,
        proyectos: proyectos,
        proyecto: proyecto,
        recursos: recursos,
        recurso: recurso,
        nuevoRecurso: nuevoRecurso,
        cuentasUsuario_id: ''
    }
    
    //si encuentra registro en cuentasUsuario
    if (cuentasUsuario.length > 0) {
        const id_cuentasUsuario = cuentasUsuario[0].id;
        permisosCU.cuentasUsuario_id = id_cuentasUsuario;
        //actualizar cuentasUsuario
        await pool.query('UPDATE cuentasUsuario SET ? WHERE id = ?', [CU, id_cuentasUsuario]);

        //buscar registro en permisosCuentaUsuario
        const permisosCuentaUsuario = await pool.query('SELECT * FROM permisosCuentaUsuario WHERE cuentasUsuario_id = ?', [id_cuentasUsuario]);

        //si encuentra registro en permisosCuentaUsuario
        if (permisosCuentaUsuario.length > 0) {
            //actualizar registro en permisosCuentaUsuario
            await pool.query('UPDATE permisosCuentaUsuario SET ? WHERE cuentasUsuario_id = ?', [permisosCU, id_cuentasUsuario]);
        } else {
            //insertar registro en permisosCuentaUsuario
            await pool.query('INSERT INTO permisosCuentaUsuario SET ?', [permisosCU]);
        }
    } else {
        //insertar registro en cuentasUsuario
        const result = await pool.query('INSERT INTO cuentasUsuario SET ?', [CU]);

        permisosCU.cuentasUsuario_id = result.insertId;
        
        //insertar registro en permisosCuentaUsuario
        await pool.query('INSERT INTO permisosCuentaUsuario SET ?', [permisosCU]);
    }
    res.redirect('/cuentas/usuariosCuenta/' + cuenta_id);
})

module.exports = router;