import React, { useState, useEffect } from 'react';
import useDenuncias from './../../hooks/useDenuncias';
import Loading from './../Recursos/Loading';
import { Button, Card } from 'react-bootstrap'
import './styles.css'
import { Link } from 'react-router-dom';

export const Denuncias = () => {
    const [denuncias, setDenuncias] = useState();
    const [auxiliar, setAuxiliar] = useState(false);
    const { fechMoreData, doban } = useDenuncias();

    const banear = (id, flag) => {
        doban(id, flag).then(res => {
            setAuxiliar(!auxiliar)
        })
    }

    useEffect(() => {
        const fechData = async () => {
            fechMoreData().then(res => {
                if (res) {
                    setDenuncias(Object.values(res))
                } else {
                    setDenuncias([])
                }
            })
        }
        fechData();
    }, [auxiliar]);

    if (!denuncias) {
        return (<Loading></Loading>)
    }
    else {
        if (denuncias.length) {
            return (
                <>
                    {denuncias.map(val => (
                        <div id='formato' className='mx-auto my-3' key={val.iddenuncias}>
                            <h1 class="display-4 text-danger pb-3 text-center">Sitio sólo para Administradores</h1>
                            <Card border='primary'>

                                <Card.Header className='d-flex'>
                                    <Card.Title className='w-50 d-inline-block'>
                                        &#8470;{` ${val.iddenuncias} Denunciante: ${val.denunciante} - Denunciado: ${val.denunciado}`}
                                    </Card.Title>
                                    <Card.Subtitle className='w-50 d-inline-block text-right'>
                                        Fecha de Denuncia: {new Date(val.fecha).toLocaleDateString()}
                                    </Card.Subtitle>

                                </Card.Header>
                                <Card.Body variant='light'>
                                    <p >
                                        {val.descripcion}
                                    </p>
                                    <span className='pull-right'>
                                        <Link to={{
                                            pathname: '/home/publicacion/' + val.idPublicaciones
                                        }} style={{ color: 'black' }} >Ver publicación</Link>
                                    </span>
                                </Card.Body>
                                <Card.Footer >
                                    <Button variant='warning' onClick={e => {
                                        banear(val.iddenuncias, false)
                                    }} className='pull-right'>Archivar</Button>
                                    <Button variant='danger' onClick={e => {
                                        banear(val.iddenuncias, true)
                                    }} className='pull-right mr-2'>Sancionar</Button>
                                </Card.Footer>
                            </Card>
                        </div>
                    ))}
                </>
            )
        } else {
            return (
                <>
                    <h1 class="display-4 text-danger pb-3 text-center">Sitio sólo para Administradores</h1>
                    <h1 class="display-5 text-danger pb-3 text-center">Aún no hay denuncias</h1>
                </>
            )
        }
    }
}
