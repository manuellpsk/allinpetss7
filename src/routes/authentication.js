const express = require('express');
const router = express.Router();
const passport = require('passport');
const helprs = require('../lib/helpers');
const pool = require('../database');
const { isLoggedin } = require('../lib/auth');

router.get('/signup', (req, res) => {
    if (!req.isAuthenticated()) {
        res.render('auth/signup');
    } else {
        res.redirect('/perfil/home');
    }
});

router.post('/signup', async (req, res) => {
    rut = req.body.rutRegistro;
    password = req.body.passwordRegistro;
    newUser = {
        rut: rut,
        nombre: req.body.nombre,
        password: password,
        email: req.body.email,
    };
    newUser.rut = parseInt(rut.substring(0, rut.indexOf('-')));
    newUser.password = await helprs.encryptPassword(password);
    try {
        const resul = await pool.query('INSERT INTO Usuarios set ?', [newUser]);
        if (resul.insertId) {
            res.redirect('/');
        } else {
            res.redirect('/signup');
        }
    } catch (error) {
        console.log(error);
        res.redirect('/signup');
    }
});

router.get('/panel', (req, res) => {
    res.send('esto es tuyo');
});

router.get('/signin', (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user) {
            res.render('./perfil/home');
        } else {
            res.render('./');
        }
    } else {
        res.redirect('/');
    }
});

router.post('/signin', (req, res, next) => {
    passport.authenticate('local.singin', {
        successRedirect: './perfil/home',
        failureRedirect: '/',
        failureFlash: true
    })(req, res, next);
    console.log(req.flash('message'));
});

router.get('/logout', (req, res) => {
    if (req.isAuthenticated()) {
        req.logOut();
        req.flash('success','Usuario desconectado');
        res.redirect("/");
    } else {
        res.redirect('/signin');
    }
});

module.exports = router;