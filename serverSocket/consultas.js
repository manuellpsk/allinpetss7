const query = require('./database')

//insertar un nuevo mensaje en la tabla mensajes
export const insertMensaje = async (idUsuarios, idChat, descripcion) => {

    try {
        const fecha = new Date().toISOString()
        const newMensaje = {
            idUsuarios,
            idChat,
            descripcion,
            fecha
        }
        const res = await query('INSERT INTO mensajes SET ?', newMensaje);
        const lastInsert = res.insertId
        if (lastInsert) {
            return {
                idmensajes: lastInsert,
                idUsuarios,
                idChat,
                descripcion,
                fecha
            }
        } else {
            return null
        }
    } catch (error) {
        console.log(error.mensage)
        return null
    }
}

