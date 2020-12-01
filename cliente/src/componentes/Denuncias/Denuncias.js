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
                            <Card border='primary'>
                                <Card.Header>{val.fecha}</Card.Header>
                                <Card.Body as={Button} variant='light' className='text-left'>
                                    {val.descripcion}
                                    <Link to={{
                                        pathname: '/home/publicacion/' + val.idPublicaciones
                                    }}>Ver publicacion</Link>
                                </Card.Body>
                                <Card.Footer >
                                    <Button variant='warning' onClick={e => {
                                        banear(val.iddenuncias, false)
                                    }}>Archivar</Button>
                                    <Button variant='danger' onClick={e => {
                                        banear(val.iddenuncias, true)
                                    }}>Sancionar</Button>
                                </Card.Footer>
                            </Card>
                        </div>
                    ))}
                </>
            )
        } else {
            return (
                <>
                    No hay denunicas
                </>
            )
        }
    }
}
