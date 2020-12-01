const jwt = require('jsonwebtoken');
const pool = require('../database');
const auth = {}

//retorn el tipo de usuarios, 1 comun, 2 adm
const getTipoUser = async (idUser) => {
    const result = await pool.query('SELECT tipo FROM USUARIOS WHERE idUsuarios = ?', idUser);
    if (result.length > 0) {
        return result[0].tipo
    } else {
        return 0
    }
}

const validateTokenTime = token => {
    try {
        const { _idUsuarios, iat, exp } = jwt.verify(token, process.env.SECRET_KEY)
        //fecha de creacion en miliseconds, tiempo de vide del token (.env file)
        const tokenValid = ((iat * 1000) <= Date.now()) && (exp - iat === parseInt(process.env.TOKEN_TIME_LIVE))
        const timeToExpire = Math.round(exp - (Date.now() / 1000))
        console.log(`Quedan ${timeToExpire} segundos antes de expirar el token.`)
        return tokenValid ? _idUsuarios : null
    } catch (e){
        console.log(e.message)
        return null
    }
}

auth.getUserType = async (token) => {
    const { _idUsuarios } = jwt.verify(token, process.env.SECRET_KEY);
    const usertipo = await getTipoUser(_idUsuarios)
    return usertipo;
}

//midleware para rutas con acceso comun
auth.comun = async (req, res, next) => {
    try {
        //recibo token y verifico si el tiempo de duracion es correct
        const token = req.headers.authorization
        const _idUsuarios = validateTokenTime(token)
        //si encuentro el token, entonces verifico el idUsuario, luego termina el middleware con next o error.
        if (_idUsuarios) {
            const tipouser = await getTipoUser(_idUsuarios);
            if (_idUsuarios && tipouser >= 1) {
                req.idUsuarios = _idUsuarios;
                next();
            } else {
                res.status(403).json({
                    error: 'Acceso denegado, perfil incorrecto'
                });
            }
        } else {
            res.status(403).json({
                error: 'Token expiro'
            });
        }
    } catch (e) {
        console.log(e.message)
        res.status(403).json({
            error: e.message
        });
    }
};

//midleware para rutas con acceso de administracion, tambien permite el ingreso a rutas de usuarios comunes
auth.adm = async (req, res, next) => {
    try {
        //recibo token y verifico si el tiempo de duracion es correct
        const token = req.headers.authorization;
        const _idUsuarios = validateTokenTime(token)
        //si encuentro el token, entonces verifico el idUsuario, luego termina el middleware con next o error.
        if (_idUsuarios) {
            const tipouser = await getTipoUser(_idUsuarios);
            if (_idUsuarios && tipouser >= 2) {
                req.idUsuarios = _idUsuarios;
                next();
            } else {
                res.status(403).json({
                    error: 'Acceso denegado, perfil incorrecto'
                });
            }
        } else {
            res.status(403).json({
                error: 'Token expiro'
            });
        }
    } catch {
        res.status(403).json({
            error: 'Token invalido'
        });
    }
}

module.exports = auth;