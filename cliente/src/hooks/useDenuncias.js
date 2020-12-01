import { getAPIdenuncia, doBan, denunciar } from './../services/Funciones';
import { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';

export default function useDenuncias() {

    const { jwt } = useContext(UserContext)
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const fechMoreData = async () => {
        try {
            setLoading(true)
            const res = getAPIdenuncia(jwt);
            setHasMore((await res).data.cantidad != 0)
            setLoading(false)
            console.log((await res).data.denuncias)
            return Object.values((await res).data.denuncias)
        } catch (error) {
            console.log(error)
        }
    }

    const doDenuncia = async (idPub, desc) => {
        try {
            await denunciar(idPub, desc, jwt)
        } catch (error) {
            console.log(error)
        }
    }

    const doban = async (idDenuncias, flag) => {
        try {
            const res = await doBan(idDenuncias, flag, jwt)
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }

    return {
        fechMoreData,
        hasMore,
        loading,
        doban,
        doDenuncia
    }
}