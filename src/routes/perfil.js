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
        const publicaciones = await pool.query('SELECT * FROM publicaciones where idUsuarios =? and disponible=1', req.user.idUsuarios);
        res.render('perfil/myfeed', { publicaciones });
    } else {
        res.redirect('/signin');
    }
});

//llegan a la ruta para eliminar, llegan a través de GET
router.get('/delete/:idPublicaciones', async (req, res) => {
    if (req.isAuthenticated()) {
        const { idPublicaciones } = req.params;
        const pubIdUsuarios = await pool.query('SELECT idUsuarios FROM PUBLICACIONES WHERE idPublicaciones = ? and disponible=1', idPublicaciones);
        if (req.user.idUsuarios == pubIdUsuarios[0].idUsuarios) {
            await pool.query('DELETE FROM Publicaciones WHERE idPublicaciones=?', [idPublicaciones]);
            req.flash('success', 'Publicación eliminada');
            res.redirect('/perfil/myfeed');
        } else {
            req.flash('error', 'No puede realizar esta operación');
            res.redirect('/perfil/myfeed');
        }
    } else {
        res.redirect('/signin');
    }

});

//se accede por get y muestra un nuevo formulario para modificar la publicacion
router.get('/pedit/:idPublicaciones', async (req, res) => {
    if (req.isAuthenticated()) {
        const { idPublicaciones } = req.params;
        const pubIdUsuarios = await pool.query('SELECT idUsuarios FROM PUBLICACIONES WHERE idPublicaciones = ? and disponible=1', idPublicaciones);
        if (req.user.idUsuarios == pubIdUsuarios[0].idUsuarios) {
            const publicaciones = await pool.query('SELECT * FROM Publicaciones WHERE idPublicaciones=?', idPublicaciones);
            res.render('perfil/pubedit', { publicaciones: publicaciones[0] });
        } else {
            req.flash('error', 'No puede realizar esta operación');
            res.redirect('/perfil/myfeed');
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
    if (req.isAuthenticated()) {
        const { rut } = req.user;
        res.render('perfil/configuracion', { rut });
    } else {
        res.redirect('/signin');
    }
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
        if (!(await helprs.matchPassword(newpassword, req.user.password)) && newpassword.length >= 6) {
            userModify.password = await helprs.encryptPassword(newpassword);
        }
        //descripcion diferente al actual y mayor o igual a 1 caracter
        if (req.user.descripcion != descripcion && descripcion.length > 0) {
            userModify.descripcion = descripcion;
        }
        if (Object.keys(userModify).length != 0 && userModify.constructor === Object) {
            await pool.query('UPDATE Usuarios set ? WHERE rut=?', [userModify, rut]);
            req.flash('success', 'Usuario Modifcado Correctamente');
            res.redirect('/perfil/home');
        }else{
            req.flash('message','No hubo datos modificados');
            res.redirect('/perfil/home');
        }
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
        const publicaciones = await pool.query('select idPublicaciones,p.descripcion,p.idPublicaciones,p.fecha,p.imagen,p.idUsuarios,p.lastmfecha,u.nombre from publicaciones p inner join usuarios u on p.idusuarios=u.idusuarios where idPublicaciones=? and p.disponible=1', [idPublicaciones]);
        if (publicaciones[0]) {
            const comentarios = await pool.query("SELECT idcomentarios,idPublicaciones,idUsuariosComentario,comentario,comentarios.fecha,usuarios.nombre FROM comentarios INNER JOIN usuarios on comentarios.idUsuariosComentario=usuarios.idUsuarios where idPublicaciones=? order by comentarios.fecha asc", idPublicaciones);
            res.render('perfil/comentario', { comentarios: comentarios, publicaciones: publicaciones });
        } else {
            req.flash('error', 'No puede realizar esta operación');
            res.redirect('/perfil/myfeed');
        }
    } else {
        res.redirect('/signin');
    }
});

router.post('/comentario', async (req, res) => {
    if (req.isAuthenticated()) {
        const { comentario } = req.body;
        const { idPublicaciones } = req.body;
        const nuevoComentario = {
            idPublicaciones: idPublicaciones,
            idUsuariosComentario: req.user.idUsuarios,
            comentario: comentario
        };
        console.log(nuevoComentario);
        await pool.query('INSERT INTO COMENTARIOS SET ?', nuevoComentario);
        res.redirect('/perfil' + req.url + '/' + idPublicaciones);
    } else {
        res.redirect('/signin');
    }
});

//redirecciona para mostrar las denuncias sólo a los administradores
router.get('/denuncias', async (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.tipo == 2) {
            const denuncias = await pool.query('SELECT iddenuncias,idUsuariosf,u1.nombre as denunciante,idUsuariost,u2.nombre as denunciado,d.idPublicaciones,p.descripcion as publicacion,d.fecha,d.descripcion,d.estado,d.comprobacion FROM denuncias d inner join usuarios u1 on idUsuariosf=u1.idusuarios inner join usuarios u2 on idUsuariost=u2.idUsuarios inner join publicaciones p on d.idPublicaciones=p.idPublicaciones where estado=1;');
            console.log(denuncias);
            res.render('perfil/denuncias', { arreglo: denuncias });
        } else {
            req.flash('error', 'No puede realizar esta operación');
            res.redirect('/perfil/myfeed');
        }
    } else {
        res.redirect('/signin');
    }
});

//aplica el respoectivo ban en caso de ser así, si bool==1 ? ban:no ban
router.get('/denunciar/proceder/:iddenuncias/:bool', async (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.tipo == 2) {
            const { iddenuncias } = req.params;
            const { bool } = req.params;
            if (bool) {
                await pool.query('call banear(?)', iddenuncias);
                res.redirect('/perfil/denuncias');
            } else {
                await pool.query('UPDATE DENUNCIAS SET estado=0,comprobacion=0 where iddenuncias=?', iddenuncias);
                res.redirect('/perfil/denuncias');
            }
        } else {
            req.flash('error', 'No puede realizar esta operación');
            res.redirect('/perfil/myfeed');
        }
    } else {
        res.redirect('/signin');
    }
});

router.get('/suser/:idUsuario', async (req, res) => {
    if (req.isAuthenticated()) {
        const { idUsuario } = req.params;
        if (idUsuario == req.user.idUsuarios) {
            const findUsuario = {
                name: req.user.nombre,
                fechac: req.user.fecha,
            }
            res.render('perfil/suser', { findUsuario: findUsuario });
        } else {
            const findUser = await pool.query('SELECT nombre as name,fecha as fechac FROM USUARIOS WHERE idUsuarios=?', idUsuario);
            if (findUser[0]) {
                console.log(findUser[0]);
                res.render('perfil/suser', { findUsuario: findUser[0] });
            } else {
                req.flash('error', 'No se puedo encontrar al usuario');
                res.redirect('/perfil/home');
            }
        }
    } else {
        res.redirect('/signin');
    }
});

module.exports = router;