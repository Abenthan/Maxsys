const express = require('express');
const router = express.Router(); // router es el metodo que utilizamos del modulo express para configurar rutas 

const passport = require('passport'); // passport es el metodo que utilizamos para autenticaciones
const {isLoggedIn, isNotLoggedIn} = require('../lib/auth');

router.get('/nuevoUsuario', (req, res) => {
    res.render('auth/nuevousuario');
});

router.post('/nuevoUsuario', isNotLoggedIn,
    passport.authenticate('local.nuevoUsuario', { // configuro el metodo authenticate del passport
        successRedirect: '/perfil', // donde se va a  dirigir cuando el proceso nuevoUsuario sea correcto
        failureRedirect: '/nuevoUsuario', // cuando falla el proceso de registro lo redirije nuevoUsuario
        failureFash: true  // le permite a passport poder recibir estos mensajes Flash
    })
);

router.get('/logIn', isNotLoggedIn, (req, res) => {
    res.render('auth/logIn');
});

router.post('/logIn', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.logIn', {
        successRedirect: '/perfil',
        failureRedirect: '/logIn',
        failureFlash: true
    })(req, res, next)
});

router.get('/perfil', isLoggedIn, (req, res) => {
    res.render('perfil');
});

router.get('/logout', isLoggedIn, (req, res) => { 
    req.logOut();
    res.redirect('/logIn');
});
module.exports = router;