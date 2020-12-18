import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import useGetMyPubli from '../../hooks/useGetMyPubli';
import Loading from './../Recursos/Loading';
import FormatPub from './../Recursos/FormatPub';
import useUser from '../../hooks/useUser'
import { useHistory } from 'react-router-dom';
import Publicidad from '../Recursos/Publicidad';
import { Col, Row } from 'react-bootstrap';

function Publicaciones(props) {
    const { isLogged } = useUser()
    let history = useHistory()
    const [pge, setPge] = useState(1);
    const { fechMoreData, hasMore } = useGetMyPubli();
    const [items, setItems] = useState([]);
    useEffect(() => {
        if (!isLogged) history.push('/')
        const fechData = async () => {
            const result = await fechMoreData(pge);
            setItems(prev => {
                return [...prev].concat(result)
            })
        }
        fechData();
    }, [pge, isLogged]);

    const moreData = () => {
        setPge(pge + 1)
    }

    if (items.length === 0) {
        return (
            <div className='container-fluid'>
                <Row>
                    <Col md='10'>
                        <h3 className='text-center mt-5'>
                            Aún no tienes publicaciones ¡Publicar es gratis!
                        </h3>
                    </Col>
                    <Col>
                        <div className='sticky-top'>
                            <div className='mt-3'>
                                <Publicidad orientation='z'></Publicidad>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div >

        )
    }

    return (
        <div className='container-fluid'>
            <Row>
                <Col md='10'>
                    {<InfiniteScroll
                        dataLength={items.length}
                        next={moreData}
                        hasMore={hasMore}
                        loader={<Loading />}
                    >

                        {items.map(val => (
                            <FormatPub key={val.idPublicaciones} publi={val}></FormatPub>
                        ))}
                    </InfiniteScroll>}
                </Col>
                <Col>
                    <div className='sticky-top'>
                        <div className='mt-3'>
                            <Publicidad orientation='z'></Publicidad>
                        </div>
                    </div>
                </Col>
            </Row>
        </div >
    )
}

export default Publicaciones;   