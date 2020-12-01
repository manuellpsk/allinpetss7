import React, { useState } from 'react';
import jwt_decode from "jwt-decode";
import Cookies from 'universal-cookie';

export const UserContext = React.createContext({})

export function UserContextProvider({ children }) {
    const cookies = new Cookies();
    const [jwt, setJWT] = useState(() => cookies.get('jwt'))
    const [idUserGlobal, setIdUserGlobal] = useState(() => {
        if (cookies.get('jwt')) {
            return jwt_decode(cookies.get('jwt'))._idUsuarios
        } else {
            return -1
        }
    });

    return <UserContext.Provider value={{ jwt, setJWT, idUserGlobal, setIdUserGlobal, cookies }}>
        {children}
    </UserContext.Provider>
};

export const UserContextConsumer = UserContext.Consumer;