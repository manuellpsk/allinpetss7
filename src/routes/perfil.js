const express = require('express');
const router = express.Router();
const pool = require('../database');
const helpers = require('../lib/handlebars');
const encripthelp = require('../lib/helpers');
const auth = require('../lib/auth');
const handleDBerrors = require('../lib/handleDBerrors');

const arraytoJson = (a) => Object.assign({}, a);

//                      API REST USUARIOS: obtener y modificar


//Buscar datos del perfil del propio usuarios
router.get('/user', auth.comun, async (req, res, next) => {
    //si no se envian parametros, devuelve los datos personales del usuario de la session
    //si envia idUsuario como parametro, solo se motrara informacion publica
    const iduser = req.idUsuarios == req.query.iduser ? null : req.query.iduser;
    try {
        if (!iduser) {
            //All information si no se envian parametros, devuelve los datos personales del usuario de la session
            await pool.query('SELECT * FROM Usuarios WHERE idUsuarios=?', [req.idUsuarios], (err, result) => {
                handleDBerrors(err, res, () => {
                    if (result.length > 0) {
                        const user = result[0];
                        res.status(200).json({
                            rut: user.rut,
                            nombre: user.nombre,
                            descripcion: user.descripcion,
                            emai: user.email,
                            fechaCreation: helpers.timeago(user.fecha),
                            password: user.password,
                            tipo: user.tipo
                        });
                    } else {
                        res.status(404).json({
                            message: 'Usuarios no encontrado'
                        });
                    }
                });
            });
        } else {
            //General information si envia idUsuario como parametro, solo se motrara informacion publica
            await pool.query('SELECT * FROM Usuarios WHERE idUsuarios=?', [iduser], (err, result) => {
                handleDBerrors(err, res, () => {
                    if (result.length > 0) {
                        const user = result[0];
                        res.status(200).json({
                            nombre: user.nombre,
                            descripcion: user.descripcion,
                            fechaCreation: helpers.timeago(user.fecha)
                        });
                    } else {
                        res.status(404).json({
                            message: 'Usuarios no encontrado'
                        });
                    }
                });
            });
        }
    } catch (error) {
        next(error);
    }
});

//Cambiar los datos propios de los usuarios
router.put('/user', auth.comun, async (req, res, next) => {
    const { userModify } = req.body;
    console.log(userModify)
    console.log(req.idUsuarios)
    const _idUsuarios = req.idUsuarios;
    if (_idUsuarios) {
        if (Object.keys(userModify).length > 1 && userModify.constructor === Object) {
            try {
                if (userModify.password) {
                    userModify.password = await encripthelp.encryptPassword(userModify.password);
                }
                await pool.query('UPDATE Usuarios set ? WHERE idUsuarios=?', [userModify, _idUsuarios], (err, result) => {
                    handleDBerrors(err, res, () => {
                        if (result.affectedRows == 1) {
                            res.status(200).json({
                                message: 'Modificado Correctamente'
                            });
                        }
                    });
                });
            } catch (error) {
                next(error);
            }
        } else {
            res.status(422).json({
                message: 'Información insuficiente o erronea'
            });
        }
    } else {
        res.status(403).json({
            message: 'Acceso denegado'
        });
    }
    /*
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
    }*/
});


//                      API REST PUBLICACIONES: obtener, ingresar, modificar y eliminar


//Obtener una publicacion, buscar una publicacion por el id y mostar los datos.
router.get('/publicacion', auth.comun, async (req, res, next) => {
    const { idPub } = req.query;
    try {
        const result = await pool.query('SELECT idUsuarios FROM PUBLICACIONES WHERE idPublicaciones = ? and disponible=1', idPub);
        if (result.length > 0) {
            iduser = result[0].idUsuarios;
            pool.query('SELECT idPublicaciones,p.descripcion,p.fecha,p.imagen,u.nombre,p.idUsuarios,p.lastmfecha,p.disponible FROM publicaciones p INNER JOIN usuarios u ON p.idUsuarios=u.idUsuarios WHERE idpublicaciones = ?', idPub, (err, result) => {
                handleDBerrors(err, res, () => {
                    if (result.length > 0) {
                        const publicacion = arraytoJson(result[0]);
                        res.status(200).json(publicacion);
                    } else {
                        res.status(404).json({
                            message: 'La publicacion no existe'
                        });
                    }
                })
            });
        } else {
            res.status(403).json({
                message: 'Este contenido no esta disponible'
            });
        }
    } catch (error) {
        next(error);
    }
});

//Realizar nueva publicacion, solo se necesita la publicacion, el id del usuario se saca del token
router.post('/publicacion', auth.comun, async (req, res, next) => {
    const { descripcion } = req.body;
    const nuevaPublicacion = {
        descripcion,
        idUsuarios: req.idUsuarios
    };
    console.log(nuevaPublicacion)
    try {
        await pool.query('INSERT INTO publicaciones set ?', [nuevaPublicacion], (err, resul) => {
            handleDBerrors(err, res, () => {
                if (resul.insertId) {
                    console.log(resul.insertId)
                    res.status(200).json({
                        message: "Publicaicon exitosa",
                        pubId: resul.insertId
                    });
                }
            });
        });
    } catch (error) {
        next(error)
    }
});

//Modifica una publicacion propia
router.put('/publicacion', auth.comun, async (req, res, next) => {
    const { pubUpdate } = req.body;
    console.log(pubUpdate)
    const idPub = pubUpdate.idPublicaciones;
    const publicacion = {
        descripcion: pubUpdate.descripcion,
        lastmfecha: new Date()
    }
    try {
        const result = await pool.query('SELECT idUsuarios FROM PUBLICACIONES WHERE idPublicaciones = ? and disponible=1', idPub);
        if (result.length && req.idUsuarios == result[0].idUsuarios) {
            await pool.query('UPDATE Publicaciones set ? WHERE idPublicaciones=?', [publicacion, idPub], (err, result) => {
                handleDBerrors(err, res, () => {
                    if (result.affectedRows == 1) {
                        res.status(200).json({
                            message: 'Modificado Correctamente'
                        });
                    } else {
                        res.status(404).json({
                            message: `No se encontro el recurso ${req.originalUrl}`
                        });
                    }
                })
            });
        } else {
            res.status(403).json({
                message: 'No tiene acceso para visualizar este recurso'
            });
        }
    } catch (error) {
        next(error);
    }
});

//elimina una publicacion propia
router.delete('/publicacion', auth.comun, async (req, res) => {
    const { idPub } = req.query;
    try {
        const result = await pool.query('SELECT idUsuarios FROM PUBLICACIONES WHERE idPublicaciones = ? and disponible=1', idPub);
        if (result.length && req.idUsuarios == result[0].idUsuarios) {
            await pool.query('DELETE FROM Publicaciones WHERE idPublicaciones = ?', idPub, (err, result) => {
                handleDBerrors(err, result, () => {
                    if (!err && result.affectedRows == 1) {
                        res.status(200).json({
                            message: 'Eliminancion correcta'
                        });
                    } else {
                        res.status(404).json({
                            message: 'Publicacion 404'
                        });
                    }
                });
            });
        }
    } catch (error) {
        next(error);
    }
});


//                      API REST FEED: obtener las publicaciones propias o todas para el menu principal


//muestra todas las publicaciones de los usuarios menos las propias
router.get('/feed', auth.comun, async (req, res, next) => {
    const pge = req.query.pge || 1;
    const limit = 5
    const offset = pge <= 1 ? 0 : limit * (pge - 1);
    const parametersSql = [req.idUsuarios, limit, offset]
    try {
        await pool.query('SELECT mv.* FROM (select @f1:= ? p) param , vista_publicaciones_home mv ORDER BY fecha DESC LIMIT ? OFFSET ?;', parametersSql, (err, result) => {
            if (!err) {
                res.status(200).json({
                    cantidad: result.length,
                    publicaciones: arraytoJson(result)
                });
            } else {
                res.status(404).json({
                    message: 'No se encontraron registros'
                });
            }
        });
    } catch (error) {
        next(error)
    }
});

//muestra todas nuestras publicaciones 
router.get('/myfeed', auth.comun, async (req, res, next) => {
    const pge = req.query.pge || 1;
    const limit = 5
    const offset = pge <= 1 ? 0 : limit * (pge - 1);
    const parametersSql = [req.idUsuarios, limit, offset]
    try {
        await pool.query('SELECT * FROM publicaciones WHERE idUsuarios = ? AND disponible=1 ORDER BY fecha DESC LIMIT ? OFFSET ?', parametersSql, (err, result) => {
            if (!err) {
                res.status(200).json({
                    cantidad: result.length,
                    publicaciones: arraytoJson(result)
                });
            } else {
                res.status(404).json({
                    message: 'No se encontraron publicaciones'
                })
            }
        });
    } catch (error) {
        next(error)
    }
});


//                      API REST COMENTARIOS: obtenerlos de una publicacion, ingresar, modificar y eliminar comentario


//muestra todos los comentarios realizados en una publicacion, se necesita el id de la publicacion
router.get('/comentario', auth.comun, async (req, res, next) => {
    const { idPub } = req.query;
    try {
        if (idPub) {
            await pool.query('SELECT idcomentarios,idUsuariosComentario,comentario,comentarios.fecha,usuarios.nombre FROM comentarios INNER JOIN usuarios on comentarios.idUsuariosComentario=usuarios.idUsuarios where idPublicaciones=? order by comentarios.fecha asc', idPub, (err, result) => {
                handleDBerrors(err, res, () => {
                    if (result.length > 0) {
                        res.status(200).json({
                            Publicacion: idPub,
                            Cantidad: result.length,
                            Comentarios: arraytoJson(result)
                        })
                    } else {
                        res.status(404).json({
                            message: 'No hay comentarios'
                        });
                    }
                })
            });
        } else {
            res.status(404).json({
                message: 'Recurso no encontrado'
            });
        }
    } catch (error) {
        next(error)
    }
});

//ingresar un comentario
router.post('/comentario', auth.comun, async (req, res, next) => {
    const { comentario, idPub } = req.body;
    const nuevoComentario = {
        idPublicaciones: idPub,
        idUsuariosComentario: req.idUsuarios,
        comentario: comentario
    }
    try {
        pool.query('INSERT INTO COMENTARIOS SET ?', nuevoComentario, (err, result) => {
            handleDBerrors(err, res, () => {
                if (result.insertId) {
                    res.status(200).json({
                        message: 'Operación Correcta'
                    })
                }
            })
        });
    } catch (error) {
        next(error)
    }
});



//                      API REST DENUNCIAS: denunciar publicaciones y ver denuncias sólo por administradores



//Enviar denuncia para ser revisada, necesita id de la publicacion a la cual denuncia y la descripcion de la denuncia
router.post('/denuncia', auth.comun, async (req, res, next) => {
    const { denuncia, idPub } = req.body;
    try {
        await pool.query('SELECT idUsuarios FROM PUBLICACIONES WHERE idPublicaciones=?', idPub, (err, result) => {
            handleDBerrors(err, res, async () => {
                if (result.length > 0) {
                    const newDenuncia = {
                        idUsuariosf: req.idUsuarios,
                        idUsuariost: result[0].idUsuarios,
                        idPublicaciones: idPub,
                        descripcion: denuncia
                    };
                    await pool.query('INSERT INTO DENUNCIAS set ?', newDenuncia, (err, result) => {
                        handleDBerrors(err, res, () => {
                            if (result.insertId) {
                                res.status(200).json({
                                    message: 'Operacion Correcta'
                                })
                            } else {
                                res.status(422).json({
                                    message: 'Operación Incompleta'
                                })
                            }
                        })
                    });
                } else {
                    res.status(404).json({
                        message: 'Recurso no encontrado'
                    })
                }
            });
        });
    } catch (error) {
        next(error)
    }
});

//Listar denuncias para los ADMINISTRADORES y que puedan revisar
router.get('/denuncia', auth.adm, async (req, res, next) => {
    try {
        await pool.query('SELECT iddenuncias,idUsuariosf,u1.nombre as denunciante,idUsuariost,u2.nombre as denunciado,d.idPublicaciones,p.descripcion as publicacion,d.fecha,d.descripcion,d.estado,d.comprobacion FROM denuncias d inner join usuarios u1 on idUsuariosf=u1.idusuarios inner join usuarios u2 on idUsuariost=u2.idUsuarios inner join publicaciones p on d.idPublicaciones=p.idPublicaciones where estado=1;', (err, result) => {
            handleDBerrors(err, res, () => {
                if (result.length >= 0) {
                    res.status(200).json({
                        Cantidad: result.length,
                        Denuncias: arraytoJson(result)
                    })
                }
            })
        })
    } catch (error) {
        next(error)
    }
})

router.get('/ban', auth.adm, async (req, res, next) => {
    const { iddenuncias, flag } = req.query;
    const aux = (flag == 'true')
    console.log(iddenuncias, flag, aux)
    try {
        if (aux) {
            await pool.query('call banear(?)', iddenuncias, (err, result) => {
                console.log(result)
                handleDBerrors(err, res, () => {
                    if (result.affectedRows > 0) {
                        res.status(200).json({
                            message: 'Operación Correcta',
                            procesos: 'BAN',
                            info: result
                        });
                    } else {
                        res.status(404).json({
                            message: 'Recurso no encontrado'
                        })
                    }
                })
            });
        } else {
            await pool.query('UPDATE DENUNCIAS SET estado=0,comprobacion=0 where iddenuncias=?', iddenuncias, (err, result) => {
                handleDBerrors(err, res, () => {
                    if (result.affectedRows == 1) {
                        res.status(200).json({
                            message: 'Operación exitosa',
                            proceso: 'NO BAN',
                            info: result
                        })
                    } else {
                        res.status(404).json({
                            message: 'Recurso no encontrado'
                        })
                    }
                })
            });
        }
    } catch (error) {
        next(error)
    }

})


module.exports = router;