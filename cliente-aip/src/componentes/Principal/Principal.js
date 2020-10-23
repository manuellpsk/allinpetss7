import React, { useEffect } from 'react'
import Publicidad from './../Recursos/Publicidad';
import useUser from '../../hooks/useUser'
import { useHistory } from 'react-router-dom'

export default () => {
    const { isLogged } = useUser()
    let history = useHistory()
    useEffect(() => {
        if (!isLogged) history.push('/');
        else history.push('/home')
    }, [isLogged]);
    return (
        <>
            <main role="main" className="text-center" >
                <h1 className="cover-heading">All in Pets</h1>
                <p className="lead">Ayuda a mejorar la calidad de vida de los animales callejeros</p>
                <img src="/images/perroPortada.jpg" className="img-fluid rounded" alt="Perrito"></img>
                <blockquote className="blockquote my-2">
                    <p className="mb-0">"Hasta que no hayas amado a un animal, una parte de tu alma permanecerá dormida"</p>
                    <footer className="blockquote-footer">Anatole France</footer>
                </blockquote>
            </main>
            <Publicidad orientation='x'></Publicidad>
        </>
    );
}
