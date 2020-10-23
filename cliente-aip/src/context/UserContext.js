import React, { useState } from 'react';
import jwt_decode from "jwt-decode";

export const UserContext = React.createContext({})

export function UserContextProvider({ children }) {
    const [jwt, setJWT] = useState(() => window.sessionStorage.getItem('jwt'))
    const [idUserGlobal, setIdUserGlobal] = useState(() => {
        if (window.sessionStorage.getItem('jwt')) {
            return jwt_decode(window.sessionStorage.getItem('jwt'))._idUsuarios
        } else {
            return -1
        }
    });

    return <UserContext.Provider value={{ jwt, setJWT, idUserGlobal, setIdUserGlobal }}>
        {children}
    </UserContext.Provider>
};

export const UserContextConsumer = UserContext.Consumer;