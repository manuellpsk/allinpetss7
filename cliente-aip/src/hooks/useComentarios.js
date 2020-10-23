import { useContext } from 'react'
import { UserContext } from '../context/UserContext';
import { doComentario, getAPIComentarios } from './../services/Funciones';

export default function useComentarios() {

    const { jwt } = useContext(UserContext)

    const getComentarios = async (idPub) => {
        try {
            const resp = await getAPIComentarios(jwt, idPub)
            return Object.values(resp.data.Comentarios)
        } catch (error) {
            return []
        }
    }

    const comentar = async (comentario, idPub) => {
        try {
            const resp = await doComentario(jwt, comentario, idPub)
            return resp
        } catch (error) {
            console.log(error)
        }
    }
    return {
        getComentarios,
        comentar
    }
}
