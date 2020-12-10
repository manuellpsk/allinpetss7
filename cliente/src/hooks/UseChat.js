import { getAPIallChats, getMensajesChat } from './../services/Funciones';
import { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import useUser from './useUser';

export default function useChat() {

    const { getInfoUser } = useUser()
    const { jwt } = useContext(UserContext)
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const getAllChats = async () => {
        try {
            setLoading(true)
            const res = getAPIallChats(jwt);
            const valores = Object.values((await res).data)
            console.log(valores)
            return valores
        } catch (error) {
            console.log(error)
            return null
        }
    }

    const getMensajesOfChat = async (idChat) => {
        try {
            const res = await getMensajesChat(jwt, idChat)
            const resMensajes = Object.values(res.mensajesList)
            console.log(resMensajes)
            return resMensajes
        } catch (error) {
            console.log(error)
            return null
        }
    }

    return {
        getAllChats,
        getMensajesOfChat
    }
}