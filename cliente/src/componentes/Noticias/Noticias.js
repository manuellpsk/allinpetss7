import React, { useContext, useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap'
import useGetPubli from '../../hooks/useGetPubli';
import InfiniteScroll from 'react-infinite-scroll-component';
import useUser from '../../hooks/useUser'
import Loading from './../Recursos/Loading';
import './styles.css'
import FormatPub from '../Recursos/FormatPub';
import { useHistory } from 'react-router-dom';
import Publicidad from '../Recursos/Publicidad';

export default () => {
    let history = useHistory()
    const [pge, setPge] = useState(1);
    const { fechMoreData, hasMore } = useGetPubli();
    const [items, setItems] = useState([]);
    const { isLogged } = useUser()
    useEffect(() => {
        if (!isLogged) history.push('/')
        const fechData = async () => {
            const result = await fechMoreData(pge);
            setItems(prev => {
                return [...prev].concat(result)
            })
        }
        fechData();
    }, [pge]);

    const moreData = () => {
        setPge(pge + 1)
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