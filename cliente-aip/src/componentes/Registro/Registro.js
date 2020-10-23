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
    const { isLogged } = useUser()
    const [rut, setRut] = useState('');
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useUser()
    const handleRegister = e => {
        e.preventDefault();
        register(rut, nombre, email, password).then(res => {
            notifyRight()
            setRut('')
            setNombre('')
            setEmail('')
            setPassword('')
        }).catch((e) => {
            notifyError(e.message)
        }
        )
    }
    useEffect(() => {
        if (isLogged) history.push('/home');
    }, [isLogged]);

    return (
        <Container fluid style={{ marginTop: '5.5%' }}>
            <Row className='align-items-center'>
                <Col xs='12' lg='8' lg={{ order: 'first' }} className='mx-auto'>
                    <Publicidad orientation='y'></Publicidad>
                    <p className='lead mt-5 text-justify'>Un agradecimiento especial para todos nuestros colaboradores que hicieron posible la realización de esta proyecto.</p>
                </Col>
                <Col xs='12' xs={{ order: 'first' }} lg='4'>
                    <Card border="primary" className='mx-auto' style={{ width: '22rem' }}>
                        <Card.Header className='font-weight-bold'>Crear Nueva Cuenta</Card.Header>
                        <Form>
                            <Card.Body>
                                <Form.Group>
                                    <Form.Label>Rut</Form.Label>
                                    <Form.Control type="text" placeholder="Ingrese Rut, ejemplo: 123456789-0" onChange={e => setRut(e.target.value)} value={rut} />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control type="text" placeholder="Ingrese Nombre" onChange={e => setNombre(e.target.value)} value={nombre} />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="text" placeholder="Ingrese email" onChange={e => setEmail(e.target.value)} value={email} />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Contraseña</Form.Label>
                                    <Form.Control type="password" placeholder="Ingrese Contraseña" onChange={e => setPassword(e.target.value)} value={password} />
                                </Form.Group>

                                <p className="d-inline">
                                    <small>Al hacer clic en Registrarse, acepta nuestros
                                <a href="asd"> Términos</a> ,<a href="asd"> Política de datos</a>y<a href="asd"> Política de cookies</a>. Puede optar por no participar en cualquier momento.
                                </small>
                                </p>
                            </Card.Body>
                            <Card.Footer>
                                <Button variant="primary" onClick={handleRegister}>Registrarse</Button>
                                <ToastContainer limit={1}></ToastContainer>
                            </Card.Footer>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>

    );
}
