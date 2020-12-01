import { getAPIallChats } from './../services/Funciones';
import { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';

export default function useChat() {

    const { jwt } = useContext(UserContext)
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const getAllChats = async () => {
        try {
            setLoading(true)
            const res = getAPIallChats(jwt);
            setLoading(false)
            console.log((await res).data)
            return Object.values((await res).data)
        } catch (error) {
            console.log(error)
        }
    }

    return {
        getAllChats
    }
}