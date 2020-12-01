import jwt_decode from "jwt-decode";
import { useContext, useCallback, useState } from 'react'
import { UserContext } from '../context/UserContext'
import { doLogin } from '../services/Funciones'
import { getMyUser, doRegister, doUpdateUser } from './../services/Funciones';

export default function useUser() {
    const { jwt, setJWT, setIdUserGlobal, cookies } = useContext(UserContext);
    const [failLog, setfailLog] = useState(false);
    const [dataUser, setDataUser] = useState(async () => {
        try {
            const res = getMyUser(jwt)
            return (await res).data
        } catch (e) {
            logout()
        }
    });

    const login = useCallback(async (username, password) => {
        const user = {
            rut: username,
            password
        }
        try {
            setfailLog(false)
            const res = await doLogin(user);
            const { token } = res.data;
            cookies.set('jwt', token, {
                path: '/',
                maxAge: 3600
            })
            setJWT(token)
            setIdUserGlobal(jwt_decode(token)._idUsuarios)
        } catch (error) {
            setJWT(null)
            cookies.remove('jwt')
            setfailLog(true)
            console.log(error)
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
        updateUser,
        failLog: failLog
    }
}