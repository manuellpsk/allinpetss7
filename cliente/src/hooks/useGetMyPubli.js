import { useContext, useState } from 'react'
import { getAPImyPubli } from '../services/Funciones';
import { UserContext } from '../context/UserContext';

export default function useGetMyPubli() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const { jwt } = useContext(UserContext)
    const fechMoreData = async (pge) => {
        try {
            setLoading(true)
            const res = getAPImyPubli(jwt, pge)
            setHasMore((await res).data.cantidad !== 0)
            setError(false)
            setLoading(false)
            return Object.values((await res).data.publicaciones)
        } catch (error) {
            console.log(error)
            setError(true)
        }
    }
    return {
        fechMoreData,
        loading,
        error,
        hasMore
    }
}
