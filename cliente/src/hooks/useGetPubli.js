import { useContext, useState } from 'react'
import { doDelPub, getAPIOnePubli, getAPIPubli, doUpdatePub, doAPIPublicacion } from '../services/Funciones';
import { UserContext } from '../context/UserContext';

export default function useGetPubli() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const { jwt } = useContext(UserContext)
    const fechMoreData = async (pge) => {

        try {
            setLoading(true)
            const res = getAPIPubli(jwt, pge)
            setHasMore((await res).data.cantidad !== 0)
            setError(false)
            setLoading(false)
            return Object.values((await res).data.publicaciones)
        } catch (error) {
            console.log(error)
            setError(true)
        }
    }

    const getOnePublicacion = async (idPub) => {
        try {
            console.log(jwt)
            const res = await getAPIOnePubli(idPub, jwt)

            console.log(res.status)
            return res.data
        } catch (e) {
            if (e.message.status === 403) {
                throw new Error(e.message.data.message)
            }
        }
    }

    const updatePub = async (idPublicaciones, descripcion) => {
        try {
            const res = await doUpdatePub({
                idPublicaciones,
                descripcion
            }, jwt)
            return res
        } catch (error) {
            console.log(error)
        }
    }

    const delPub = async (idPub) => {
        try {
            const res = await doDelPub(idPub, jwt)
            console.log(res)
            return res
        } catch (error) {
            console.log(error)
        }
    }

    const doPublicar = async (descripcion) => {
        try {
            const res = await doAPIPublicacion(jwt, descripcion)
            console.log(res)
            return res
        } catch (error) {
            console.log(error)
        }
    }

    return {
        fechMoreData,
        loading,
        error,
        hasMore,
        getOnePublicacion,
        doPublicar,
        updatePub,
        delPub
    }
}
