import React, { useContext, useState } from 'react'
import { Popover, OverlayTrigger, Button, Modal, Form, Card } from 'react-bootstrap'
import useChat from '../../hooks/UseChat';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { notifyError, notifyRight } from './../Recursos/Toasts';
import { UserContext } from '../../context/UserContext';
import useUser from '../../hooks/useUser';

export default function StartChat(props) {

    const { getInfoUser } = useUser()
    const { idUserGlobal } = useContext(UserContext)
    const { idUser, name } = props
    const { startNewChat } = useChat()
    const [validated, setValidated] = useState(false);
    const [show, setShow] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [showPop, setShowPop] = useState(false);
    const [newMensaje, setNewMensaje] = useState('');
    const [userInformation, setUserInformation] = useState({});

    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShowPop(false);
        setShow(true);
    }

    const handleCloseInfo = () => setShowInfo(false);
    const handleShowInfo = async () => {
        setShowPop(false);
        setShowInfo(true);
        const res = await getInfoUser(idUser)
        if (!res.descripcion) {
            res.descripcion = 'No especificado'
        }
        setUserInformation(res)
    }

    const handleNewChat = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const form = e.currentTarget
        if (form.checkValidity() === false) {
            form.classList.add('was-validated')
        } else {
            startNewChat(idUser, newMensaje).then(res => {
                if (res) {
                    notifyRight('Mensaje enviado')
                    setShow(false)
                } else {
                    notifyError('Mensaje no enviado')
                    setShow(false)
                }
            })
        }

    }
    const popover = (
        <Popover id="popover-basic"
            show={showPop}
        >
            <Popover.Title>
                Opciones
            </Popover.Title>
            <Popover.Content >
                <Button variant='primary' size='sm' onClick={handleShowInfo} className='d-block mb-1'>
                    Ver Perfil
                </Button>
                <Button variant='primary' size='sm' onClick={handleShow}>
                    Enviar Mensaje
                </Button>
            </Popover.Content>
        </Popover>
    );

    return (
        <div>
            <ToastContainer></ToastContainer>
            {(idUser != idUserGlobal) && <OverlayTrigger trigger='focus' placement="right" overlay={popover}>
                <Button variant="light" onClick={e => (setShowPop(true))} className='font-weight-bold'>{name}</Button>
            </OverlayTrigger>
            }
            {!(idUser != idUserGlobal) && <Button variant="light" className='font-weight-bold'>Tú</Button>}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Nuevo Mensaje</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleNewChat}>
                        <Form.Control placeholder={`Escribe un mensaje para ${name}`} value={newMensaje} onChange={e => setNewMensaje(e.target.value)}
                            required
                            maxLength='250' />
                        <Form.Control.Feedback type='invalid'>
                            El mensaje debe tener máximo 250 caractéres
                        </Form.Control.Feedback>
                        <div className='mt-3'>
                            <Button variant="secondary" className='pull-right' onClick={handleClose}>
                                Cancelar
                            </Button>
                            <Button variant="primary" className='pull-right mr-2' type='submit'>
                                Enviar
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
            <Modal show={showInfo} onHide={handleCloseInfo}>
                <Modal.Header closeButton>
                    <Modal.Title>Información</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Card border='light'>
                        <Card.Body>
                            <Card.Subtitle>
                                Nombre de Usuario: <span className='font-weight-normal'>{userInformation.nombre}</span>
                            </Card.Subtitle>
                            <Card.Subtitle className='my-3'>
                                Descripción: <span className='font-weight-normal'>{userInformation.descripcion}</span>
                            </Card.Subtitle>
                            <Card.Subtitle>
                                Miembro Desde: <span className='font-weight-normal'>{userInformation.fechaCreation}</span>
                            </Card.Subtitle>
                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>
        </div >
    )
}
