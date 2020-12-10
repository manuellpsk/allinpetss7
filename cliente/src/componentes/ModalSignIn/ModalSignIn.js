import React, { useState, useEffect } from 'react'
import FacebookLogin from 'react-facebook-login';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap'
import * as Icon from 'react-bootstrap-icons'
import { FaFacebookSquare } from "react-icons/fa"
import useUser from '../../hooks/useUser'
import { ToastContainer } from 'react-toastify';
import { notifyError } from './../Recursos/Toasts';
import 'react-toastify/dist/ReactToastify.css';

import './styles.css'

export default (props) => {
    const [rut, setRut] = useState('');
    const [validated, setValidated] = useState(false);
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
        nav.style.paddingRight = '15px'
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget
        if (form.checkValidity() === false) {
            form.classList.add('was-validated')
            e.stopPropagation();
        } else {
            setValidated(true)
            login(rut, password, null, 1).then(res => {
                if (failLog) {
                    notifyError('Credenciales incorrectas')
                }
            })
        }
    }
    useEffect(() => {
        setRut('')
        setPassword('')
    }, [isLogged])

    const responseFacebook = response => {
        console.log(response)
        //login(null, null, response, 2);
    }

    const validateRut = e => {
        const inpurRut = e.currentTarget
        setRut(e.target.value)
        const fn = {
            // Valida el rut con su cadena completa "XXXXXXXX-X"
            validaRut: function (rutCompleto) {
                if (!/^[0-9]{6,8}[-|‐]{1}[0-9kK]{1}$/.test(rutCompleto))
                    return false;
                var tmp = rutCompleto.split('-');
                var digv = tmp[1];
                var rut = tmp[0];
                if (digv == 'K') digv = 'k';
                return (fn.dv(rut) == digv);
            },
            dv: function (T) {
                var M = 0, S = 1;
                for (; T; T = Math.floor(T / 10))
                    S = (S + T % 10 * (9 - M++ % 6)) % 11;
                return S ? S - 1 : 'k';
            }
        }
        if (fn.validaRut(e.target.value)) {
            inpurRut.classList = 'form-control is-valid'
        } else {
            inpurRut.classList = 'form-control is-invalid'
        }
    }

    return (
        <>
            <ToastContainer limit={1} />
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
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Rut</Form.Label>
                            <Form.Control type="text" placeholder="Ingrese Rut, ejemplo: 123456789-0" onChange={validateRut} value={rut} required pattern="[0-9]{6,8}[-|‐]{1}[0-9kK]{1}" maxLength="10" />
                            <Form.Control.Feedback type="invalid">
                                El formato de rut es incorrecto.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control type="password" placeholder="Ingrese Contraseña" onChange={(e) => setPassword(e.target.value)} required minLength="5" maxLength="30" />
                            <Form.Control.Feedback type="invalid">
                                La contraseña debe tener mínimo 5 caracteres.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer className='d-block'>
                        <Row>
                            <Col md='8' xs='12' className='text-right mt-2'>
                                <span className="align-bottom">
                                    <small>Si aún no tiene una cuenta, </small><a href="/registro">Regístrese aquí</a>
                                </span>
                            </Col>
                            <Col md='4' xs='12'>
                                <Button variant="primary" type="submit">
                                    Ingresar
                                </Button>
                            </Col>
                        </Row>
                        <Row className='py-2 justify-content-center'>
                            <FacebookLogin
                                appId="197569208681605"
                                size='small'
                                textButton=' Ingresa con Facebook'
                                fields="name,email,picture"
                                callback={responseFacebook}
                                cssClass='btn btn-outline-primary mt-2'
                                icon={<FaFacebookSquare />}
                            />
                        </Row>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}

