import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import useGetMyPubli from '../../hooks/useGetMyPubli';
import Loading from './../Recursos/Loading';
import FormatPub from './../Recursos/FormatPub';
import useUser from '../../hooks/useUser'
import { useHistory } from 'react-router-dom';

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

    return (
        <div>
            {<InfiniteScroll
                dataLength={items.length}
                next={moreData}
                hasMore={hasMore}
                loader={<Loading />}
                endMessage={
                    <p >
                        <b>Yay! You have seen it all</b>
                    </p>
                }
            >

                {items.map(val => (
                    <FormatPub key={val.idPublicaciones} publi={val}></FormatPub>
                ))}
            </InfiniteScroll>}
        </div >
    )
}

export default Publicaciones;   