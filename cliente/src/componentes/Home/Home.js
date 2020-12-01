import React, { useEffect, useState } from 'react';
import Principal from '../Principal/Principal'
import useUser from '../../hooks/useUser'
import { useHistory, Route, Link } from 'react-router-dom'

import Noticias from '../Noticias/Noticias'
import Publicaciones from '../Publicaciones/Publicaciones'
import Adopciones from '../Adopciones/Adopciones'
import Configuracion from '../Configuracion/Configuracion'
import ModalPublicar from './../ModalPublicar/ModalPublicar';
import Publicacion from './../Publicacion/Publicacion';
import { Denuncias } from './../Denuncias/Denuncias'
import { Mensajes } from './../Mensajes/Mensajes'
import './custom.css';


function Home(props) {

    const { isLogged, dataUser, logout } = useUser()
    let history = useHistory()
    const [userType, setUserType] = useState()
    useEffect(() => {
        if (!isLogged) history.push('/')
        dataUser.then(res => {
            setUserType(res.tipo)
        }).catch(e => {
            console.log(e)
        })
    }, [isLogged]);

    return (
        <>
            <div className="sidenav">
                <Link to='/home/noticias' style={{ top: '15%' }}>Noticias</Link>
                <Link to='/home/publicaciones' style={{ top: '20%' }}>Mis Publicaciones</Link>
                <Link to='/home/adopciones' style={{ top: '25%' }}>Adopciones</Link>
                <Link to='/home/mensajes' style={{ top: '30%' }}>Mensajes</Link>
                {userType === 2 && <Link to='/home/denuncias' style={{ top: '35%' }}>Denuncias</Link>}
                {isLogged && <ModalPublicar></ModalPublicar>}
            </div>

            <div className="main">
                <Route path="/home/noticias" component={Noticias} />
                <Route path="/home/publicaciones" component={Publicaciones} />
                <Route path="/home/publicacion/:idpublicacion" component={Publicacion} />
                <Route path="/home/configuracion" component={Configuracion} />
                <Route path="/home/adopciones" component={Adopciones} />
                <Route path="/home/mensajes" component={Mensajes} />
                <Route path="/home/denuncias" component={Denuncias} />
                <Route path='/home/' component={Principal} exact></Route>
            </div>

        </>
    );
}
export default Home