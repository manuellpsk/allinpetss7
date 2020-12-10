import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import useChat from './../../hooks/UseChat';
import { Chat } from '../Chat/Chat'
import useUser from '../../hooks/useUser';

export const Mensajes = () => {
    const [chatList, setChatList] = useState([]);
    const [paintChat, setPaintChat] = useState(0);
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
            <Container className='border border-primary my-1'>
                <Row style={{ height: '550px' }}>
                    <Col lg={4}>
                        <Card className='my-1' style={{ height: '500px' }}>
                            <Card.Header>
                                Destinatarios
                            </Card.Header>
                            <Card.Body>
                                {
                                    chatList.map((val, i) => (
                                        <Button key={i} variant='outline-info' className='d-block w-100 my-1' onClick={
                                            e => (setPaintChat(val.idchat))
                                        }>
                                            {val.nombre}
                                        </Button>
                                    ))
                                }
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={8}>
                        <Chat idChat={paintChat}></Chat>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
