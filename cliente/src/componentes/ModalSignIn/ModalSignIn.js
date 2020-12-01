import React, { useState, useEffect } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import * as Icon from 'react-bootstrap-icons';
import useUser from '../../hooks/useUser'
import Alerts from '../Alerts/Alerts'
import './styles.css'

export default (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);
    const { isLogged, login, failLog } = useUser();
    const [showAlert, setShowAlert] = useState(false);

    const handleClose = () => {
        setShow(false)
        const nav = document.getElementById('navbar')
    }
    const handleShow = () => {
        setShow(true);
        const nav = document.getElementById('navbar')
       nav.style.paddingRight='15px'
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        login(username, password);

    }
    useEffect(() => {
        setUsername('')
        setPassword('')
    }, [isLogged])
    return (
        <>
            <Button className="float-right" variant="outline-dark" onClick={handleShow}>
                <Icon.Person size="18"></Icon.Person>
                <small className='font-weight-bold'> Ingresar</small>
            </Button>
            <Modal {...props}
                size="20em"
                aria-labelledby="contained-modal-title-vcenter"
                centered show={show}
                onHide={handleClose}
                id='mod'
            >
                <Modal.Header closeButton>
                    <Modal.Title>Ingreso</Modal.Title>
                </Modal.Header>
                <Form>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Rut</Form.Label>
                            <Form.Control type="text" placeholder="Ingrese Rut, ejemplo: 123456789-0" onChange={(e) => setUsername(e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control type="password" placeholder="Ingrese Contraseña" onChange={(e) => setPassword(e.target.value)} />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer className='d-block'>
                        <div className='p-4 position-relative'>
                            {failLog && <Alerts variant='danger' value='Intento fallido, revise sus credenciales'></Alerts>}
                        </div>
                        <div className="d-flex justify-content-between">
                            <span className="text-left mt-2">
                                <small>Si aún no tiene una cuenta, </small><a href="/registro">Regístrese aquí</a>
                            </span>
                            <Button variant="primary" onClick={handleSubmit}>
                                Ingresar
                        </Button>
                        </div>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}

