const pool = require('../database');
const bcrypt = require('bcryptjs'); // bcryptjs es un modulo para manejar contraseñas encrptadas
const helpers = {};

helpers.encryptPassword = async (password) =>{
    const salt = await bcrypt.genSalt(10); //genSalt(10) es para crear un hash 10 veces, entre mas veces mas segura pero mas demorada.
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

helpers.matchPassword = async (password, savedPassword) => { // el metodo matchPassword compara dos contraseñas encriptadas
    try{
        return await bcrypt.compare(password, savedPassword);
    } catch(e){
        console.log(e);
    }

};

//permisos de usuario para la cuenta
helpers.permisos = async (user_id, cuenta_id) => {
    var permisos = {
        user_id,
        cuenta_id,
        perfil: 'estandar',
        usuariosCuenta: false,
        consultaEmail: false,
        permisosCuentaUsuario: false,
        requerimiento: false,
        reqListarXUsuario: false,
        reqListarXCuenta: false,
        reqCrear: false,
        nuevoProyecto: false,
        proyectos: false,
        proyecto: false,
        recursos: false,
        recurso: false,
        nuevoRecurso: false,
    }

    const cuentasUsuario = await pool.query('SELECT * FROM cuentasUsuario WHERE user_id = ? AND cuenta_id = ?', [user_id, cuenta_id]);
    if (cuentasUsuario.length > 0) {
        permisos.perfil = cuentasUsuario[0].perfil;
        const { id } = cuentasUsuario[0];
        const pcu = await pool.query('SELECT * FROM permisosCuentaUsuario WHERE cuentasUsuario_id = ?', [id]);
        if (pcu.length > 0) {
            permisos.usuariosCuenta = pcu[0].usuariosCuenta;
            permisos.consultaEmail = pcu[0].consultaEmail;
            permisos.permisosCuentaUsuario = pcu[0].permisosCuentaUsuario;
            permisos.requerimiento = pcu[0].requerimiento;
            permisos.reqListarXUsuario = pcu[0].reqListarXUsuario;
            permisos.reqListarXCuenta = pcu[0].reqListarXCuenta;
            permisos.reqCrear = pcu[0].reqCrear;
            permisos.nuevoProyecto = pcu[0].nuevoProyecto;
            permisos.proyectos = pcu[0].proyectos,
            permisos.proyecto = pcu[0].proyecto;
            permisos.recursos = pcu[0].recursos,
            permisos.recurso = pcu[0].recurso,
            permisos.nuevoRecurso = pcu[0].nuevoRecurso
        }
    }
   return permisos;

}

helpers.permitirCuenta


module.exports =  helpers;