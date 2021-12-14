const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash'); // para mensajes
const session = require('express-session'); // permite trabajar en sessiones, para passport y flash
const MySQLStore = require('express-mysql-session') // para almacenar los datos de 'session' en la base de datos
const passport = require('passport');
const moment = require('moment');

const { database } = require('./keys');

// INICIALIZACIONES

const app = express();
require('./lib/passport');

// CONFIGURACIONES
app.set('port', process.env.PORT || 4001); // para usar puerto http = 4001
app.set('views', path.join(__dirname, 'views')); // se le dice al servidor donde esta la carpeta views
app.engine('.hbs', exphbs({
    defaultlayout: 'main', // nombre de la plantilla principal
    layoutsDir: path.join(app.get('views'),'layouts'), // ruta de la carpeta layouts
    partialsDir: path.join(app.get('views'),'partials'), // ruta de la carpeta partials
    extname: '.hbs', // configura la extension de los archivos handlebars
    helpers: require('./lib/handlebars')
})); // configuracion de los parametros para los archivos .hbs

app.set('view engine', '.hbs'); // poner a funcionar el motor handlebars

//MIDDLEWRES
app.use(session({
    secret: 'SessionEnMySQL',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false})); // para aceptar ulr solo con strings
app.use(express.json()); // para enviar y recibir archivos json, cuando se trabaja con varios clientes
app.use(passport.initialize());
app.use(passport.session());

// VARIABLES GLOBALES
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user =  req.user;
    app.locals.cuenta = req.session.cuenta;
    
    next();
});

// RUTAS
app.use(require('./routes'));
app.use('/ajustes', require('./routes/ajustes'));
app.use('/cuentas', require('./routes/cuentas'));
app.use('/requerimientos', require('./routes/requerimientos'));
app.use(require('./routes/autenticaciones'));
app.use('/proyectos', require('./routes/proyectos'));
app.use('/recursos', require('./routes/recursos'));

//ARCHIVOS PUBLICOS
app.use(express.static(path.join(__dirname, 'public'))); // decimos donde esta la carpeta 'public'

// INICIANDO EL SERVIDOR
app.listen(app.get('port'), ()=>{
    console.log('Servidor en puerto', app.get('port'));

});