import React, { useEffect, useState, useContext } from 'react'
import { Card, Button, InputGroup, FormControl, Container, OverlayTrigger, Tooltip } from 'react-bootstrap'
import * as Icon from 'react-bootstrap-icons';
import io from 'socket.io-client'
import './style.css'
import { UserContext } from '../../context/UserContext'
import Publicidad from '../Recursos/Publicidad';
import useChat from '../../hooks/UseChat';
import { useRef } from 'react';

export const Chat = (props) => {

    const { idUserGlobal } = useContext(UserContext);
    const { idChat, name } = props
    const [newMensaje, setNewMensaje] = useState('');
    const [mensajesChat, setMensajesChat] = useState([])
    const [socket, setSocket] = useState();
    const { getMensajesOfChat } = useChat()
    const botDiv = useRef(null);

    const sendText = () => {
        const data = {
            idUsuarios: idUserGlobal,
            idChat,
            descripcion: newMensaje
        }
        socket.emit('mensajeToServer', data)
        setNewMensaje('')
    }

    const formatoFecha = (isoDate) => {
        if (new Date(isoDate).toLocaleString().substring(0, 10) === new Date().toLocaleString().substring(0, 10)) {
            return 'Hoy'
        } else {
            return new Date(isoDate).toLocaleDateString()
        }
    }

    useEffect(() => {
        console.log(idChat)
        if (idChat !== 0) {
            setSocket(io("http://localhost:5000/", { query: `idChat=${idChat}&idUser=${idUserGlobal}` }))
            if (socket) {
                socket.emit('conectado', 'holaaaa')
            }
            getMensajesOfChat(idChat).then(res => {
                if (res) {
                    setMensajesChat(res)
                } else {
                    setMensajesChat([])
                }
                console.log(mensajesChat)
            })
        }
        return () => {
            if (socket) { socket.off() }
        }
    }, [idChat])

    useEffect(() => {
        if (socket) {
            socket.on('mensajeToClient', data => {
                console.log(data)
                setMensajesChat([...mensajesChat, data])
            })
        }
        return () => {
            if (socket) { socket.off() }
        }
    }, [mensajesChat]);

    useEffect(() => {
        if (botDiv.current) {
            botDiv.current.scrollIntoView({ behaivor: 'smooth' })
        }
    });

    if (idChat === 0) {
        return (
            <div>
                <h3 className="display-4 text-success pb-3 text-center">¡Tenga en cuenta!</h3>
                <h3 className="display-5 text-danger text-center">No compartir datos personales</h3>
                <h3 className="display-5 text-danger text-center pb-4">Cuidado con links fraudulentos</h3>
                <Publicidad orientation='x'></Publicidad>
            </div>
        )
    } else {
        return (
            <div >
                <Card className='my-1' style={{ height: '500px' }}>
                    <Card.Header className='bg-info text-light'>
                        <Card.Subtitle>
                            {name}
                        </Card.Subtitle>
                    </Card.Header>
                    <Card.Body>
                        <Container id='chatBox' fluid >
                            {
                                mensajesChat.map(val => (
                                    <div key={val.idmensajes}>
                                        {
                                            (val.idUsuarios !== idUserGlobal) && <div className='my-4'>
                                                <span className="border border-primary py-1 px-3 rounded">{val.descripcion}</span>
                                                <OverlayTrigger
                                                    placement={'top'}
                                                    overlay={
                                                        <Tooltip>
                                                            {formatoFecha(val.fecha)}
                                                        </Tooltip>
                                                    }>
                                                    <span className='ml-1 text-muted font-weight-light'>
                                                        <small>{val.fecha.match(/\d\d:\d\d/)[0]}</small></span>
                                                </OverlayTrigger>
                                            </div>
                                        }
                                        {
                                            (val.idUsuarios === idUserGlobal) && <div className='my-4 text-right'><span className="border border-primary py-1 px-3 rounded">{val.descripcion}</span>
                                                <OverlayTrigger
                                                    placement={'top'}
                                                    overlay={
                                                        <Tooltip>
                                                            {formatoFecha(val.fecha)}
                                                        </Tooltip>
                                                    }>
                                                    <span className='ml-1 text-muted font-weight-light'>
                                                        <small>{val.fecha.match(/\d\d:\d\d/)[0]}</small></span>
                                                </OverlayTrigger>
                                            </div>
                                        }
                                    </div>
                                ))
                            }
                            <div ref={botDiv}></div>
                        </Container>
                    </Card.Body>
                    <Card.Footer>
                        <InputGroup className="mb-3">
                            <FormControl
                                placeholder="Escribe un mensaje..."
                                maxLength='20'
                                onChange={e => setNewMensaje(e.target.value)} value={newMensaje}
                                onKeyPress={e => { if (e.key === 'Enter' && e.target.value.length <= 20) sendText() }}
                            />
                            <InputGroup.Append>
                                <Button type='submit' variant="outline-primary"
                                    onClick={sendText}
                                    disabled={!Boolean(newMensaje.trim().length > 0 && newMensaje.trim().length < 20)}
                                >
                                    <Icon.ArrowRightCircle /> Enviar</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Card.Footer>
                </Card>
            </div>
        )
    }
}
