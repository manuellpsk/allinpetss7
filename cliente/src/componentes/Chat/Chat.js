import React, { useEffect, useState, useContext } from 'react'
import { Card, Button, InputGroup, FormControl } from 'react-bootstrap'
import * as Icon from 'react-bootstrap-icons';
import io from 'socket.io-client'
//import socket from '../../services/Socket'
import { UserContext } from '../../context/UserContext'
import useChat from '../../hooks/UseChat';

export const Chat = (props) => {

    const { idUserGlobal } = useContext(UserContext);
    const { idChat } = props
    const [newMensaje, setNewMensaje] = useState('');
    const [mensajesChat, setMensajesChat] = useState([])
    const [socket, setSocket] = useState();
    const { getMensajesOfChat } = useChat()

    const sendText = () => {
        const data = {
            idUsuarios: idUserGlobal,
            idChat,
            descripcion: newMensaje
        }
        socket.emit('mensajeToServer', data)
        setNewMensaje('')
    }

    useEffect(() => {
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

    if (idChat === 0) {
        return (
            <div>
                No ha seleccionado chat
            </div>
        )
    } else {
        return (
            <div>
                <Card className='my-1' style={{ height: '500px' }}>
                    <Card.Header>
                        {idChat}
                    </Card.Header>
                    <Card.Body>
                        {
                            mensajesChat.map(val => (
                                <div key={val.idmensajes}>
                                    {val.descripcion}
                                </div>
                            ))
                        }
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
