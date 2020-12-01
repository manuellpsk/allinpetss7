import React, { useEffect, useState, useContext } from 'react'
import { Card, Button, InputGroup, FormControl } from 'react-bootstrap'
import * as Icon from 'react-bootstrap-icons';
import io from 'socket.io-client'
//import socket from '../../services/Socket'
import { UserContext } from '../../context/UserContext'

export const Chat = (props) => {

    const { idUserGlobal } = useContext(UserContext);
    const { idChat } = props
    const [newMensaje, setNewMensaje] = useState('');
    const [mensajesChat, setMensajesChat] = useState(['Start...'])
    let socket
    const sendText = () => {
        //socket.emit('mensaje', newMensaje)
        setNewMensaje('')
    }

    useEffect(() => {
        if (idChat !== 0) {
            socket = io("http://localhost:5000/", { query: `idChat=${idChat}&idUser=${idUserGlobal}` })
            //socket.connect()
            socket.emit('conectado', 'holaaaa')
            console.log(socket)
            //socket.emit('conectado', 'holaaaa')
        }
        return () => {
            if (idChat !== 0) socket.off()
        }
    }, [idChat])

    useEffect(() => {
        console.log('efect chat')
        /* socket.on('mensajes', data => {
            setMensajesChat([...mensajesChat, data])
        }) */
        return () => {
            //socket.off()
        }
    }, [mensajesChat])

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
                                <div>
                                    {val}
                                </div>
                            ))
                        }
                    </Card.Body>
                    <Card.Footer>
                        <InputGroup className="mb-3">
                            <FormControl
                                placeholder="Escribe un mensaje..."
                                onChange={e => setNewMensaje(e.target.value)} value={newMensaje}
                                onKeyPress={e => { if (e.key === 'Enter') sendText() }}
                            />
                            <InputGroup.Append>
                                <Button type='submit' variant="outline-primary"
                                    onClick={sendText}
                                    disabled={!Boolean(newMensaje.trim().length > 0)}
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
