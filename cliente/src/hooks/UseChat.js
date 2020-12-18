import { doNewChat, getAPIallChats, getMensajesChat } from './../services/Funciones';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

export default function useChat() {

    const { jwt } = useContext(UserContext)
    const getAllChats = async () => {
        try {
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

    const startNewChat = async (idUserB, newMensaje) => {
        try {
            const res = await doNewChat(idUserB, newMensaje, jwt)
            return res
        } catch (error) {
            console.log(error)
            return false
        }
    }

    return {
        getAllChats,
        getMensajesOfChat,
        startNewChat
    }
}