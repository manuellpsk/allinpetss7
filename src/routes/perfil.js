const express = require('express');
const router = express.Router();
const pool = require('../database');
const helprs = require('../lib/helpers');
const auth = require('../lib/auth');
//publicaciones del usuario, nuevo, modificar y eliminar

//al ingresar a publicar por get de redirige y muestra el formulario
router.get('/publicar', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('perfil/add');
    } else {
        res.redirect('/signin');
    }
});

//aca llegan los datos de nueva publicación
router.post('/publicar', async (req, res) => {
    if (req.isAuthenticated()) {

        const { descripcion } = req.body;
        const nuevaPublicacion = {
            descripcion,
            idUsuarios: req.user.idUsuarios
        };
        await pool.query('INSERT INTO publicaciones set ?', [nuevaPublicacion]);
        req.flash('success', 'Publicación exitosa');
        res.redirect('/perfil/myfeed');
    } else {
        res.redirect('/signin');
    }
});

//muestra todas las publicaciones de los usuarios menos las propias
router.get('/home', async (req, res) => {
    if (req.isAuthenticated()) {
        const publicaciones = await pool.query('select mv.* from (select @f1:= ? p) param , vista_publicaciones_home mv order by fecha desc;', req.user.idUsuarios);
        res.render('perfil/home', { publicaciones });
    } else {
        res.redirect('/signin');
    }
});

//muestra las propias publicaciones
router.get('/myfeed', async (req, res) => {
    if (req.isAuthenticated()) {
        const publicaciones = await pool.query('SELECT * FROM publicaciones where idUsuarios =?', req.user.idUsuarios);
        res.render('perfil/myfeed', { publicaciones });
    } else {
        res.redirect('/signin');
    }
});

//llegan a la ruta para eliminar, llegan a través de GET
router.get('/delete/:idPublicaciones', async (req, res) => {
    if (req.isAuthenticated()) {
        const { idPublicaciones } = req.params;
        const pubIdUsuarios = await pool.query('SELECT idUsuarios FROM PUBLICACIONES WHERE idPublicaciones = ?', idPublicaciones);
        if (req.user.idUsuarios == pubIdUsuarios[0].idUsuarios) {
            await pool.query('DELETE FROM Publicaciones WHERE idPublicaciones=?', [idPublicaciones]);
            req.flash('success', 'Publicación eliminada');
            res.redirect('/perfil/home');
        }
    } else {
        res.redirect('/signin');
    }

});

//se accede por get y muestra un nuevo formulario para modificar la publicacion
router.get('/pedit/:idPublicaciones', async (req, res, next) => {
    if (req.isAuthenticated()) {
        const { idPublicaciones } = req.params;
        const pubIdUsuarios = await pool.query('SELECT idUsuarios FROM PUBLICACIONES WHERE idPublicaciones = ?', idPublicaciones);
        if (req.user.idUsuarios == pubIdUsuarios[0].idUsuarios) {
            const publicaciones = await pool.query('SELECT * FROM Publicaciones WHERE idPublicaciones=?', idPublicaciones);
            res.render('perfil/pubedit', { publicaciones: publicaciones[0] });
        }
    } else {
        res.redirect('/signin');
    }
});

//llega por post la publicación editada y modificar el bd
router.post('/pedit/:idPublicaciones', async (req, res) => {
    if (req.isAuthenticated()) {
        const { idPublicaciones } = req.params;
        const { descripcion } = req.body;
        const pubIdUsuarios = await pool.query('SELECT idUsuarios FROM PUBLICACIONES WHERE idPublicaciones = ?', idPublicaciones);
        if (req.user.idUsuarios == pubIdUsuarios[0].idUsuarios) {
            const neweditPub = {
                descripcion
            };
            await pool.query('UPDATE Publicaciones set ? WHERE idPublicaciones=?', [neweditPub, idPublicaciones]);
            req.flash('success', 'Publicación actualizada');
            res.redirect('/perfil/myfeed');
        }
    } else {
        res.redirect('/signin');
    }
});

//Configuración y modificación de usuario
router.get('/configuracion', (req, res) => {
    const { rut } = req.user;
    res.render('perfil/configuracion', { rut });
});

router.post('/configuracion', async (req, res) => {
    if (req.isAuthenticated()) {
        const { rut, nombre, email, newpassword, descripcion } = req.body;
        const userModify = {}
        //nombre de usuario de sesion y nuevo nombre son diferentes, y ademas el tamaño es mayor a 1
        if (req.user.nombre != nombre && nombre.length > 1) {
            userModify.nombre = nombre;
        }
        //email diferente a la actual y mayor a 6 caracteres
        if (req.user.email != email && email.length > 6) {
            userModify.email = email;
        }
        //contraseña diferente a la actual y mayor a 6 caracteres
        if (!(await helprs.matchPassword(newpassword, req.user.password)) && newpassword.length > 6) {
            userModify.password = await helprs.encryptPassword(newpassword);
        }
        //descripcion diferente al actual y mayor o igual a 1 caracter
        if (req.user.descripcion != descripcion && descripcion > 0) {
            userModify.descripcion = descripcion;
        }
        await pool.query('UPDATE Usuarios set ? WHERE rut=?', [userModify, rut]);
        req.flash('success', 'Usuario Modifcado Correctamente');
        res.redirect('/perfil/home');
    } else {
        res.redirect('/signin');
    }
});

//adopciones get, redirecciona a las adopciones
router.get('/adopciones', (req, res, next) => {
    res.render('ayuda/adopciones');
});

//
router.post('/denunciar', async (req, res, next) => {
    const { denuncia, idPub } = req.body;
    console.log(denuncia, idPub);
    if (req.isAuthenticated()) {
        const usert = await pool.query('SELECT idUsuarios FROM PUBLICACIONES WHERE idPublicaciones=?', idPub);
        const newDenuncia = {
            idUsuariosf: req.user.idUsuarios,
            idUsuariost: usert[0].idUsuarios,
            idPublicaciones: idPub,
            descripcion: denuncia,
        };
        await pool.query('INSERT INTO DENUNCIAS set ?', [newDenuncia]);
        req.flash('success', 'Gracias por mejorar la comunidad');
        res.redirect('/perfil/home');
    } else {
        res.redirect('/signin');
    }
});

//ver publicacion y comentarios
router.get('/comentario/:idPublicaciones', async (req, res) => {
    if (req.isAuthenticated()) {
        const { idPublicaciones } = req.params;
        const publicaciones = await pool.query('select mv.* from (select @f1:= ? p) param , vista_publicaciones_home mv where idpublicaciones=? order by fecha desc;', [req.user.idUsuarios, idPublicaciones]);
        if (publicaciones[0]) {
            const comentarios = await pool.query('SELECT * FROM COMENTARIOS WHERE idPublicaciones=?', idPublicaciones);
            console.log(publicaciones);
            console.log(comentarios);
            res.render('perfil/comentario', { publicaciones: publicaciones, comentarios: comentarios });
        } else {
            res.redirect('/perfil/home');
        }
    } else {
        res.redirect('/signin');
    }
});

router.post('/comentario/:idPublicaciones', async (req, res) => {
    if (req.isAuthenticated()) {
        const { comentario } = req.body;
        const { idPublicaciones } = req.params;
        const nuevoComentario = {
            idPublicaciones: idPublicaciones,
            idUsuariosComentario: req.user.idUsuarios,
            comentario: comentario
        };
        await pool.query('INSERT INTO COMENTARIOS SET ?', nuevoComentario);
        res.redirect('/perfil/'+req.url);
    } else {
        res.redirect('/signin');
    }
});


module.exports = router;