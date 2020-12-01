//almacena todas las rutas principales de la app
const Router = require('express');
const router = Router();
const passport = require('passport');
const query = require('../database');
const jwt = require('jsonwebtoken');
const encryptPassword = require('../lib/helpers');
//Creando API 

//registro de nuevos usuarios
router.post('/signup', async (req, res) => {

    try {
        console.log(req.body)
        rut = req.body.rut;
        password = req.body.password;
        newUser = {
            rut: rut,
            nombre: req.body.nombre,
            password: password,
            email: req.body.email
        };
        newUser.rut = parseInt(rut.substring(0, rut.indexOf('-')));
        newUser.password = await encryptPassword(password);
        const resul = await query('INSERT INTO Usuarios set ?', [newUser]);
        if (resul.insertId) {
            res.status(200).json({ status: newUser.rut + ' registrado' });
        }
    } catch (error) {
        if (error.code === 'ER_BAD_FIELD_ERROR') {
            res.status(422).json({
                message: 'Datos inconrrectos'
            });
        } else if (error.code === 'ER_DUP_ENTRY') {
            res.status(422).json({
                message: 'Usuario ya existe'
            });
        }
        else {
            res.status(500).json({
                message: 'Error no controlado'
            });
        }
    }
});

//login de usuarios
router.post('/signin', (req, res, next) => {
    console.log(req.body)
    try {
        passport.authenticate('local.login', async (err, user, info) => {
            try {
                console.log(err)
                if (err || !user) {
                    if (err.code === 'ECONNREFUSED') {
                        res.status(503).json({
                            message: 'Problemas con la conexion bd'
                        });
                    } else {
                        res.status(404).json({
                            message: 'Los datos son incorrectos o el usuario no existe'
                        });
                    }
                } else {
                    const token = jwt.sign({
                        iat: Math.floor(Date.now() / 1000),
                        exp: Math.floor(Date.now() / 1000) + (parseInt(process.env.TOKEN_TIME_LIVE)),
                        _idUsuarios: user.idUsuarios
                    }, process.env.SECRET_KEY);
                    return res.status(200).json({
                        token: token
                    });
                }
            } catch (e) {
                console.log('asadas')
                next(e);
            }
        })(req, res, next);

    } catch (error) {
        console.log('asdasd')
    }
});

module.exports = router;