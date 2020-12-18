import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import useChat from './../../hooks/UseChat';
import { Chat } from '../Chat/Chat'
import './styles.css'

export const Mensajes = () => {
    const [chatList, setChatList] = useState([]);
    const [paintChat, setPaintChat] = useState(0);
    const [nombre, setNombre] = useState('');
    const { getAllChats } = useChat()

    useEffect(() => {
        const loadData = async () => {
            const result = await getAllChats()
            if (result) { setChatList(result) }
        }
        loadData()
    }, [])

    return (
        <div>
            <Container className=' my-3'>
                <Row style={{ minHeight:'100%' }}>
                    <Col lg={4}>
                        <Card id='mensajesBox' className='my-1' style={{ height: '500px' }} border='light'>
                            <Card.Header className='bg-info text-light'>
                                <Card.Title>
                                    Destinatarios
                                </Card.Title>
                            </Card.Header>
                            <Card.Body>
                                {
                                    chatList.map((val, i) => (
                                        <Button key={i} variant='outline-info' className='d-block w-100 my-1' onClick={
                                            e => {
                                                setPaintChat(val.idchat)
                                                setNombre(val.nombre)
                                            }
                                        }>
                                            {val.nombre}
                                        </Button>
                                    ))
                                }
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={8} >
                        <Chat idChat={paintChat} name={nombre}></Chat>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
