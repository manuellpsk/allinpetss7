//almacena todas las rutas principales de la app
const express = require('express');
const router = express.Router();
const passport = require('passport');
const pool = require('../database');
const jwt = require('jsonwebtoken');
const { isLoggedin } = require('../lib/auth');
const helpers = require('../lib/helpers');

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
    passport.authenticate('local.singin', async (err, user, info) => {
        try {
            if (err || !user) {
                res.status(404).json({
                    message: 'Los datos son incorrectos o el usuario no existe'
                });
            } else {
                req.login(user, { session: false }, async (err) => {
                    if (err) return next(err);
                    const token = jwt.sign({ _idUsuarios: user.idUsuarios }, process.env.SECRET_KEY, {
                        expiresIn: 3600 * 8
                    });
                    return res.status(200).json({
                        token: token
                    });
                })
            }
        } catch (e) {
            return next(e);
        }
    })(req, res, next);
});


module.exports = router;