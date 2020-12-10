import axios from 'axios'
const baseUrl = 'http://localhost:4000'

export const doRegister = async newUser => {
    try {
        const resp = await axios({
            url: `${baseUrl}/signup`,
            method: 'post',
            data: newUser
        });
        return resp
    } catch (err) {
        console.log(err.response)
        throw { name: 'Error', message: err.response.data.message };
    }
}

//funcion para hacer login
export const doLogin = async user => {
    try {
        const resp = await axios({
            url: `${baseUrl}/signin`,
            method: 'post',
            data: user
        });
        console.log(resp)
        return resp;
    } catch (err) {
        console.log(err.message)
        throw { name: 'Error', message: err.response };
    }
}

//funcion para hacer login con facebook
export const doLoginFacebook = async user => {
    try {
        const resp = await axios({
            url: `${baseUrl}/signFacebook`,
            method: 'post',
            data: user
        });
        return resp;
    } catch (err) {
        console.log(err.message)
        throw { name: 'Error', message: err.response };
    }
}

//Modificar datos de usuario
export const doUpdateUser = async (modifyUser, token) => {
    try {
        console.log(modifyUser)
        const resp = await axios({
            url: `${baseUrl}/perfil/user`,
            method: 'put',
            data: {
                'userModify': modifyUser
            },
            headers: {
                'Authorization': token
            }
        })
    } catch (err) {
        console.log(err.response)
        throw { name: 'Error', message: err.response };
    }
}

//metodo para obetener las publicaciones, el feed principal
export const getAPIPubli = async (token, pge = 1) => {
    try {
        const resp = await axios({
            url: `${baseUrl}/perfil/feed`,
            method: 'get',
            headers: {
                'Authorization': token
            },
            params: {
                pge
            }
        });
        return resp;
    } catch (err) {
        console.log(err.response)
        throw { name: 'Error', message: err.response };
    }
}

//metodo para consultar por todas mis publicaciones
export const getAPImyPubli = async (token, pge = 1) => {
    try {
        const resp = await axios({
            url: `${baseUrl}/perfil/myfeed`,
            method: 'get',
            headers: {
                'Authorization': token
            },
            params: {
                pge
            }
        });
        return resp;
    } catch (err) {
        console.log(err.response)
        throw { name: 'Error', message: err.response };
    }
}

//metodo para consultar solo por una publicacion en especifico
export const getAPIOnePubli = async (idPub, token) => {
    try {
        const resp = await axios({
            url: `${baseUrl}/perfil/publicacion`,
            method: 'get',
            headers: {
                'Authorization': token
            },
            params: {
                idPub
            }
        });
        return resp;
    } catch (err) {
        console.log(err.response)
        throw { name: 'Error', message: err.response };
    }
}

//update publicacion
export const doUpdatePub = async (pubMod, token) => {
    try {
        console.log(pubMod)
        const resp = await axios({
            url: `${baseUrl}/perfil/publicacion`,
            method: 'put',
            headers: {
                'Authorization': token
            },
            data: {
                'pubUpdate': pubMod
            }
        });
        console.log(resp)
        return resp.status;
    } catch (err) {
        console.log(err.response)
        throw { name: 'Error', message: err.response };
    }
}

//elimiar publicacion
export const doDelPub = async (idPub, token) => {
    try {
        if (token) {
            const resp = await axios({
                url: `${baseUrl}/perfil/publicacion`,
                method: 'delete',
                headers: {
                    'Authorization': token
                },
                params: {
                    idPub
                }
            });
            return resp.status;
        }
    } catch (err) {
        console.log(err.response)
        throw { name: 'Error', message: err.response };
    }
}

//obtener informacion del usuario
export const getMyUser = async (token) => {
    try {
        if (token) {
            const resp = await axios({
                url: `${baseUrl}/perfil/user`,
                method: 'get',
                headers: {
                    'Authorization': token
                }
            });
            return resp;
        }
    } catch (err) {
        console.log(err.response)
        throw { name: 'Error', message: err.response };
    }
}

export const getDataUser = async (token, iduser) => {
    try {
        if (token) {
            const resp = await axios({
                url: `${baseUrl}/perfil/user`,
                method: 'get',
                headers: {
                    'Authorization': token
                },
                params: {
                    iduser
                }
            });
            return resp;
        }
    } catch (err) {
        console.log(err.response)
        throw { name: 'Error', message: err.response };
    }
}

//obtener los comentarios
export const getAPIComentarios = async (token, idPub) => {
    try {
        if (token) {
            const resp = await axios({
                url: `${baseUrl}/perfil/comentario`,
                method: 'get',
                headers: {
                    'Authorization': token
                },
                params: {
                    idPub
                }
            });
            return resp;
        }
    } catch (err) {
        console.log(err.response)
        throw { name: 'Error', message: err.response };
    }
}

//Comentar una publicacion
export const doComentario = async (token, comentario, idPub) => {
    try {
        const resp = await axios({
            url: `${baseUrl}/perfil/comentario`,
            method: 'post',
            data: {
                'comentario': comentario,
                'idPub': idPub
            },
            headers: {
                'Authorization': token
            }
        })
        return resp.status
    } catch (err) {
        throw { name: 'Error', message: err.response };
    }
}

//Crear publicacion
export const doAPIPublicacion = async (token, descripcion) => {
    try {
        const resp = await axios({
            url: `${baseUrl}/perfil/publicacion`,
            method: 'post',
            data: {
                descripcion
            },
            headers: {
                'Authorization': token
            }
        })
        return resp
    } catch (err) {
        throw { name: 'Error', message: err.response };
    }
}

//obtener denuncias, sólo para administradores
export const getAPIdenuncia = async (token) => {
    try {
        if (token) {
            const resp = await axios({
                url: `${baseUrl}/perfil/denuncia`,
                method: 'get',
                headers: {
                    'Authorization': token
                }
            });
            console.log(resp)
            return resp;
        }
    } catch (err) {
        console.log(err.response)
        throw { name: 'Error', message: err.response };
    }
}

//denunciar una publicacion
export const denunciar = async (idPub, denuncia, token) => {
    try {
        const resp = await axios({
            url: `${baseUrl}/perfil/denuncia`,
            method: 'post',
            headers: {
                'Authorization': token
            },
            data: {
                idPub,
                denuncia
            }
        })
        console.log(resp)
    } catch (err) {
        console.log(err.response)
        throw { name: 'Error', message: err.response }
    }
}

//archivar la denuncia o banear al usuario culpable
export const doBan = async (iddenuncias, flag, token) => {
    try {
        console.log(iddenuncias, flag)
        const resp = await axios({
            url: `${baseUrl}/perfil/ban`,
            method: 'put',
            headers: {
                'Authorization': token
            },
            data: {
                iddenuncias,
                flag
            }
        });
        console.log(resp)
        return resp.status;
    } catch (err) {
        console.log(err.response)
        throw { name: 'Error', message: err.response }
    }
}

export const getAPIallChats = async (token) => {
    try {
        if (token) {
            const resp = await axios({
                url: `${baseUrl}/chat/all`,
                method: 'get',
                headers: {
                    'Authorization': token
                }
            });
            return resp;
        }
    } catch (err) {
        console.log(err.response)
        throw { name: 'Error', message: err.response };
    }
}

export const getMensajesChat = async (token, idChat) => {
    try {
        if (token) {
            const resp = await axios({
                url: `${baseUrl}/chat/mensaje`,
                method: 'get',
                headers: {
                    'Authorization': token
                },
                params: {
                    idChat
                }
            });
            console.log(resp.data)
            return resp.data;
        }
    } catch (err) {
        console.log(err.response)
        throw { name: 'Error', message: err.response };
    }
}

