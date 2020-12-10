import jwt_decode from "jwt-decode";
import { useContext, useCallback, useState, useRef } from 'react'
import { UserContext } from '../context/UserContext'
import { doLogin, doLoginFacebook } from '../services/Funciones'
import { getDataUser, getMyUser, doRegister, doUpdateUser } from './../services/Funciones';
export default function useUser() {

    const { jwt, setJWT, setIdUserGlobal, cookies } = useContext(UserContext);
    const failLog = useRef(false)
    const [dataUser, setDataUser] = useState(async () => {
        try {
            const res = getMyUser(jwt)
            return (await res).data
        } catch (e) {
            logout()
        }
    });

    const login = useCallback(async (username, password, objFacebook, tipoLogin) => {
        try {
            failLog.current = false
            const user = tipoLogin === 1 ? { rut: username, password } : objFacebook
            const res = tipoLogin === 1 ? await doLogin(user) : await doLoginFacebook(user)
            const { token } = res.data
            cookies.set('jwt', token, {
                path: '/'
            })
            setJWT(token)
            setIdUserGlobal(jwt_decode(token)._idUsuarios)
        } catch (error) {
            failLog.current = true
            setJWT(null)
            cookies.remove('jwt')
        } finally {
            console.log(failLog.current)
        }
    }, [setJWT, failLog])

    const logout = useCallback(() => {
        cookies.remove('jwt')
        setJWT(null)
        setIdUserGlobal(null)
    }, [setJWT, jwt])

    const getMyDataUser = async () => {
        try {
            const res = getMyUser(jwt)
            return (await res).data
        } catch (e) {
            setJWT(null)
            cookies.remove('jwt')
        }
    }

    const getInfoUser = async (idUser) => {
        try {
            const res = getDataUser(jwt, idUser)
            return (await res).data
        } catch (e) {
            return null
        }
    }

    const updateUser = async (modifyUser) => {
        try {
            doUpdateUser(modifyUser, jwt)
        } catch (e) {
            console.log(e)
        }
    }

    const register = async (rut, nombre, email, password) => {
        try {
            const newUser = {
                rut,
                nombre,
                email,
                password
            }
            const res = doRegister(newUser)
            return (await res).data
        } catch (e) {
            throw e
        }
    }
    return {
        isLogged: Boolean(jwt),
        register,
        login,
        logout,
        getMyDataUser,
        dataUser,
        getInfoUser,
        updateUser,
        failLog
    }
}