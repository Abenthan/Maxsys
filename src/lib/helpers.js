const bcrypt = require('bcryptjs'); // bcryptjs es un mosulo para manejar contraseñas encrptadas
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


module.exports =  helpers;