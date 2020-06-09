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
    req.flash('success', 'Publicación exitosa');
    res.redirect('/profile');
});

router.get('/', async(req, res)=>{
    const publicaciones= await pool.query('SELECT * FROM publicaciones');
    res.render('profile/myfeed.hbs',{publicaciones});
});

router.get('/delete/:idPublicaciones', async(req, res)=>{
    const {idPublicaciones}= req.params;
    await pool.query('DELETE FROM Publicaciones WHERE idPublicaciones=?',[idPublicaciones]);
    req.flash('success', 'Publicación eliminada');
    res.redirect('/profile');
});

router.get('/pedit/:idPublicaciones', async(req,res)=>{
    const{idPublicaciones}= req.params;
    const publicaciones= await pool.query('SELECT * FROM Publicaciones WHERE idPublicaciones=?',[idPublicaciones]);
    console.log(publicaciones[0]);
    res.render('profile/pubedit', {publicaciones: publicaciones[0]});
});

router.post('/pedit/:idPublicaciones', async(req,res)=>{
    const {idPublicaciones}= req.params;
    const {descripcion}= req.body;
    const neweditPub= {
        descripcion
    };
    await pool.query('UPDATE Publicaciones set ? WHERE idPublicaciones=?',[neweditPub, idPublicaciones]);
    req.flash('success', 'Publicación actualizada');
    res.redirect('/profile');
});

module.exports= router;