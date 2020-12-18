//almacena todas las rutas principales de la app
const Router = require('express');
const router = Router();
const passport = require('passport');
const pool = require('../database');
const jwt = require('jsonwebtoken');
const passwordSecure = require('secure-random-password');
const helpers = require('../lib/helpers');
const handleDBerrors = require('../lib/handleDBerrors');
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
        newUser.password = await helpers.encryptPassword(password);
        const resul = await pool.query('INSERT INTO Usuarios set ?', [newUser]);
        console.log(resul)
        if (resul.insertId) {
            res.status(200).json({ status: newUser.rut + ' registrado' });
        } else {
            res.status(500).json({ status: 'no se pudo registrar' });
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
                console.log('err', err)
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
                console.log('Chat register db')
                next(e);
            }
        })(req, res, next);

    } catch (error) {
        console.log('Chat register')
    }
});

//login with facebook
//login de usuarios
router.post('/signFacebook', async (req, res, next) => {

    console.log('login with facebook...', req.body)
    try {
        const isRegister = await pool.query('SELECT * FROM usuarios WHERE email = ?', req.body.email)
        if (isRegister.length > 0) {
            const idUser = isRegister[0].idUsuarios
            const token = jwt.sign({
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + (parseInt(process.env.TOKEN_TIME_LIVE)),
                _idUsuarios: idUser
            }, process.env.SECRET_KEY);
            return res.status(200).json({
                token: token
            });
        } else {
            newUser = {
                nombre: req.body.name,
                email: req.body.email,
                password: passwordSecure.randomPassword()
            }
            newUser.password = await helpers.encryptPassword(newUser.password)
            await pool.query('INSERT INTO Usuarios set ?', [newUser], (err, result) => {
                handleDBerrors(err, res, () => {
                    if (result.insertId) {
                        console.log(result.insertId)
                        const token = jwt.sign({
                            iat: Math.floor(Date.now() / 1000),
                            exp: Math.floor(Date.now() / 1000) + (parseInt(process.env.TOKEN_TIME_LIVE)),
                            _idUsuarios: result.insertId
                        }, process.env.SECRET_KEY);
                        return res.status(200).json({
                            token: token
                        });
                    }
                });
            });
        }
    } catch (error) {
        console.log(error)
        console.log('chat login facebook register')
    }
});



module.exports = router;