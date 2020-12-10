import React, { useState, useEffect } from 'react'
import { Form, Card, Button, Container, Row, Col } from 'react-bootstrap'
import Publicidad from './../Recursos/Publicidad';
import useUser from './../../hooks/useUser';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { notifyError, notifyRight } from './../Recursos/Toasts';
import { useHistory } from 'react-router-dom';

export default () => {

    let history = useHistory()
    const { isLogged, register } = useUser()
    const [rut, setRut] = useState('');
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [validated, setValidated] = useState(false);

    const handleRegister = e => {
        e.preventDefault();
        e.stopPropagation();
        const form = e.currentTarget
        if (form.checkValidity() === false) {
            form.classList.add('was-validated')
        } else {
            setValidated(true);
            console.log(true)
            register(rut, nombre, email, password).then(res => {
                notifyRight('Registro Completado', () => {
                    setRut('')
                    setNombre('')
                    setEmail('')
                    setPassword('')
                    history.push('/home')
                })
            }).catch((e) => {
                console.log(e.message)
                notifyError(e.message)
            })
        }
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

    useEffect(() => {
        if (isLogged) {
            history.push('/home');
        }
    }, [isLogged]);

    return (
        <Container fluid style={{ margin: '.7% 0' }}>
            <Row className='align-items-center'>
                <Col xs='12' lg={'8' && { order: 'first' }} className='mx-auto'>
                    <Publicidad orientation='y'></Publicidad>
                    <p className='lead mt-5 text-justify'>Un agradecimiento especial para todos nuestros colaboradores que hicieron posible la realización de esta proyecto.</p>
                </Col>
                <Col xs={'12' && { order: 'first' }} lg='4'>
                    <Card border="primary" className='mx-auto' style={{ width: '22rem' }}>
                        <Card.Header className='font-weight-bold'>Crear Nueva Cuenta</Card.Header>
                        <Form noValidate validated={validated} onSubmit={handleRegister}>
                            <Card.Body>
                                <Form.Group>
                                    <Form.Label>Rut</Form.Label>
                                    <Form.Control type="text" placeholder="Ingrese Rut, ejemplo: 123456789-0" onChange={validateRut} value={rut} required pattern="[0-9]{6,8}[-|‐]{1}[0-9kK]{1}" maxLength="10" />
                                    <Form.Control.Feedback type="invalid">
                                        El formato de rut es incorrecto.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control type="text" placeholder="Ingrese Nombre" onChange={e => setNombre(e.target.value)} value={nombre} required minLength='2' maxLength='30' />
                                    <Form.Control.Feedback type="invalid">
                                        El nombre debe tener mínimo 2 caracteres.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" placeholder="Ingrese email" onChange={e => setEmail(e.target.value)} value={email} required minLength='6' maxLength='30' />
                                    <Form.Control.Feedback type="invalid">
                                        Email incorrecto.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Contraseña</Form.Label>
                                    <Form.Control type="password" placeholder="Ingrese Contraseña" onChange={e => setPassword(e.target.value)} value={password} required minLength='5' maxLength='30' />
                                    <Form.Control.Feedback type="invalid">
                                        La contraseña debe tener mínimo 5 caracteres.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <p className="d-inline">
                                    <small>Al hacer clic en Registrarse, acepta nuestros
                                <a href="asd"> Términos</a> ,<a href="asd"> Política de datos</a>y<a href="asd"> Política de cookies</a>.</small>
                                </p>
                            </Card.Body>
                            <Card.Footer>
                                <Button variant="primary" type="submit">Registrarse</Button>
                                <ToastContainer limit={1}></ToastContainer>
                            </Card.Footer>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>

    );
}
