const express= require('express');
const router= express.Router();

const pool= require('../database');

router.get('/add', (req, res)=>{
    res.render('profile/add');
});

router.post('/add', async (req, res)=>{
    const{descripcion}= req.body;
    imagen= 'sin imagen';
    Usuarios_idusuarios= 1;
    const nuevaPublicacion= {
        descripcion,
        imagen,
        Usuarios_idusuarios
    };
    await pool.query('INSERT INTO publicaciones set ?', [nuevaPublicacion]);
    res.redirect('/profile');
});

router.get('/', async(req, res)=>{
    const publicaciones= await pool.query('SELECT * FROM publicaciones');
    res.render('profile/myfeed.hbs',{publicaciones});
});

module.exports= router;