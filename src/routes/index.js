//almacena todas las rutas principales de la app
const express = require('express');
const router = express.Router();
const { isLoggedin } = require('../lib/auth');

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/home', (req, res) => {
    console.log('home de index');
    if (req.isAuthenticated()) {
        res.redirect('/perfil/home');
    }else{
        res.redirect('/signin');
    }
});

router.get('/perfil', (req, res) => {
    console.log('perfil de index');
    if (req.isAuthenticated()) {
        res.redirect('/perfil/home');
    }else{
        res.redirect('/signin');
    }
});

module.exports = router;