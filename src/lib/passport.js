const passport = require('passport');  // este modulo se utiliza  para manejar tareas de registro de usuario
const LocalStrategy = require('passport-local').Strategy;  // este  modulo se utiliza para guardar localmente sesiones de usuario
const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.logIn', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if (validPassword) {
            done(null, user, req.flash('success', 'Bienvenid@ ' + user.fullname));
        } else {
            done(null, false, req.flash('message', 'Contraseña Incorrecta'));
        }
    } else {
       return done(null, false, req.flash('message', 'El usuario no existe!'));
    }

}
));

passport.use('local.nuevoUsuario', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const { fullname, email, telefono } = req.body;
    const newUser = {
        fullname,
        username,
        email,
        telefono,
        password
    }
    newUser.password = await helpers.encryptPassword(password); // encripta el password y lo almacena en el objeto newUser
    const result = await pool.query('INSERT INTO users SET ?', [newUser]);
    newUser.id = result.insertId; // agrego dato y el campo id al objeto newUser
    return done(null, newUser); // retorno newUser para que lo  almacene en una sesion
}));

passport.serializeUser((user, done) => { // guardar datos en session
    done(null, user.id);
})

passport.deserializeUser(async (id, done) => {  //  para cerrar la sesion de memoria
    const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, rows[0]);
});