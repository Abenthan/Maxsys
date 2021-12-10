module.exports = {
    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/login');
    },

    isNotLoggedIn(req, res, next){
        if (!req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/perfil');
    },

    cuentaAbierta(req, res, next){
        const cuenta = req.session.cuenta;
        console.log(cuenta);
        if (typeof cuenta !== 'undefined') {
                return next();
        }else{
            return res.redirect('/cuentas');
        }
    }
}