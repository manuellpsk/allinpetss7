import React, { useContext, useState, useEffect } from 'react';
import useGetPubli from '../../hooks/useGetPubli';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loading from './../Recursos/Loading';
import './styles.css'
import FormatPub from '../Recursos/FormatPub';

export default () => {

    const [pge, setPge] = useState(1);
    const { fechMoreData, hasMore } = useGetPubli();
    const [items, setItems] = useState([]);
    useEffect(() => {
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

/**
 * <div id='publicacion' key={val.idPublicaciones}>
                        {val.descripcion}
                    </div>
 */