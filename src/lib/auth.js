const jwt = require('jsonwebtoken');
const pool = require('../database');
const auth = {}

const tipoUser = async (idUser) => {
    const result = await pool.query('SELECT tipo FROM USUARIOS WHERE idUsuarios = ?', idUser);
    if (result.length > 0) {
        return result[0].tipo
    } else {
        return 0
    }
}

auth.comun = async (req, res, next) => {

    try {
        const token = req.headers.authorization;
        const { _idUsuarios } = jwt.verify(token, process.env.SECRET_KEY);
        const x = await tipoUser(_idUsuarios);
        if (_idUsuarios && x >= 1) {
            req.idUsuarios = _idUsuarios;
            next();
        } else {
            res.status(403).json({
                error: 'Acceso denegado, perfil incorrecto'
            });
        }
    } catch {
        res.status(403).json({
            error: 'Acceso denegado, sesion incorrecta'
        });
    }
};

auth.adm = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const { _idUsuarios } = jwt.verify(token, process.env.SECRET_KEY);
        const x = await tipoUser(_idUsuarios);
        if (_idUsuarios && x >= 2) {
            req.idUsuarios = _idUsuarios;
            next();
        } else {
            res.status(403).json({
                error: 'Acceso denegado, perfil incorrecto'
            });
        }
    } catch {
        res.status(403).json({
            error: 'Acceso denegado, sesion incorrecta'
        });
    }
}

module.exports = auth;