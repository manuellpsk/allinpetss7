const express = require('express');
const jwt = require('jsonwebtoken')
const router = express.Router();
const pool = require('../database');
const helpers = require('../lib/helpers');
const auth = require('../lib/auth');
const handleDBerrors = require('../lib/handleDBerrors');
const arraytoJson = a => Object.assign({}, a);

router.post('/', auth.comun, async (req, res, next) => {
    try {
        const { _idUsuarios } = jwt.verify(req.headers.authorization, process.env.SECRET_KEY)
        const { userB } = req.body
        try {
            const newChat = [parseInt(_idUsuarios), parseInt(userB)]

            console.log(newChat)
            pool.query('SELECT INSERT_CHAT(?,?)', newChat, (err, result) => {
                handleDBerrors(err, res, () => {
                    //devuelve id del nuevo chat, 0 si ya existe
                    const chatid = Object.values(result[0])[0];
                    if (chatid) {
                        res.status(200).json({
                            chatid,
                            message: 'Nuevo chat creado'
                        })
                    } else {
                        res.status(200).json({
                            chatid,
                            message: 'El chat ya existe'
                        })
                    }
                })
            });
        } catch (error) {
            next(error)
        }

    } catch (error) {
        console.log(error.message)
        next(error)
    }
})

router.get('/', auth.comun, async (req, res, next) => {
    try {
        const { _idUsuarios } = jwt.verify(req.headers.authorization, process.env.SECRET_KEY)
        const { idChat } = req.query
        await pool.query('SELECT * FROM chat WHERE idChat=? AND (idUserA=? OR idUserB=?)', [idChat, _idUsuarios, _idUsuarios], (err, result) => {
            handleDBerrors(err, res, () => {
                if (result.length > 0) {
                    const publicacion = arraytoJson(result[0]);
                    res.status(200).json(publicacion);
                } else {
                    res.status(404).json({
                        message: 'chat no existe'
                    });
                }
            })
        })
    } catch (error) {
        next(error)
    }
})

router.get('/all', auth.comun, async (req, res, next) => {
    try {
        const { _idUsuarios } = jwt.verify(req.headers.authorization, process.env.SECRET_KEY)
        await pool.query("select idchat, concat(idUserA,idUserB) as idUserB, u.nombre from (select idchat, if (idUserA=?,'',idUserA) as idUserA,if(idUserB=?,'',idUserB) as idUserB from (select * from chat where idUserA = ? or idUserB=?) as chatsUser) as finalTable inner join usuarios u on concat(idUserA,idUserB)=u.idUsuarios", [_idUsuarios,_idUsuarios,_idUsuarios,_idUsuarios], (err, result) => {
            handleDBerrors(err, res, () => {
                if (result.length > 0) {
                    const chats = arraytoJson(result);
                    res.status(200).json(chats);
                } else {
                    res.status(404).json({
                        message: 'chat no existe'
                    });
                }
            })
        })
    } catch (error) {
        next(error)
    }
})


router.delete('/', auth.comun, async (req, res, next) => {
    try {
        const { _idUsuarios } = jwt.verify(req.headers.authorization, process.env.SECRET_KEY)
        const { idChat } = req.body
        await pool.query('DELETE FROM chat WHERE idChat = ? AND (idUserA=? OR idUserB=?)', [idChat, _idUsuarios, _idUsuarios], (err, result) => {
            handleDBerrors(err, res, () => {
                console.log(result.affectedRows)
                res.status(200).json({
                    message: 'asd'
                })
            })
        })
    } catch (error) {
        next(error)
    }
})

router.post('/mensaje', auth.comun, async (req, res, next) => {
    try {
        const { _idUsuarios } = jwt.verify(req.headers.authorization, process.env.SECRET_KEY)
        const { idChat, descripcion } = req.body
        const newMensaje = {
            idUsuarios: _idUsuarios,
            idChat,
            descripcion
        }
        pool.query('INSERT INTO mensajes set ?', newMensaje, (err, result) => {
            handleDBerrors(err, res, () => {
                if (result.insertId) {
                    console.log(result.insertId)
                    res.status(200).json({
                        message: "Mensaje exitos",
                        mensajeID: result.insertId
                    });
                }
            })
        })
    } catch (error) {
        next(error)
    }
})

router.get('/mensaje', auth.comun, async (req, res, next) => {
    try {
        const { idChat } = req.query
        if (idChat) {
            await pool.query('SELECT * FROM mensajes WHERE idChat = ? ORDER BY fecha ASC', idChat, (err, result) => {
                handleDBerrors(err, res, () => {
                    if (result.length > 0) {
                        res.status(200).json({
                            chat: idChat,
                            cantidad: result.length,
                            mensajesList: arraytoJson(result)
                        })
                    } else {
                        res.status(404).json({
                            message: 'No hay mensajes'
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
})


module.exports = router;