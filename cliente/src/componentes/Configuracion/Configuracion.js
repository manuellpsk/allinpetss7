import React, { useState, useEffect, useRef } from 'react';
import useUser from './../../hooks/useUser';
import Loading from './../Recursos/Loading';
import { Card, Form, Button, Accordion, Row, Col } from 'react-bootstrap'
import { useHistory } from 'react-router-dom';
import * as Icon from 'react-bootstrap-icons';
import Publicidad from '../Recursos/Publicidad';
import { ToastContainer } from 'react-toastify'; import 'react-toastify/dist/ReactToastify.css';
import { notifyError, notifyRight } from './../Recursos/Toasts';

function Configuracion(props) {

    const { getMyDataUser, logout, updateUser } = useUser()
    let history = useHistory()
    const inputPassword = useRef(null)
    const [invalidPassword, setInvalidPassword] = useState(false);
    const [validated, setValidated] = useState(false);
    const [usuario, setUsuario] = useState({});
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [password, setPassword] = useState('');
    const [disableForm, setDisableForm] = useState(true);
    const [rePassword, setRePassword] = useState('');

    const handleLogout = () => {
        logout();
        history.push('/')
    }

    const handleModificar = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const form = e.currentTarget
        if (form.checkValidity() === false) {
            form.classList.add('was-validated')
            if (password !== rePassword) {
                setInvalidPassword(true)
                form.classList.remove('was-validated')
            } else {
                setInvalidPassword(false)
            }
        } else {
            if (password !== rePassword) {
                setInvalidPassword(true)
            } else {
                setInvalidPassword(false)
                setValidated(true)
                const userModify = {
                    nombre,
                    password,
                    email,
                    descripcion
                }
                for (let propiedad in userModify) {
                    if (userModify[propiedad] === null || userModify[propiedad] === undefined || userModify[propiedad] === '') {
                        delete userModify[propiedad]
                    }
                }

                updateUser(userModify).then(() => {
                    notifyRight('Datos Modificados')
                }).catch(() => {
                    notifyError('Modificación Incorrecta')
                })

            }
        }
    }

    useEffect(() => {
        getMyDataUser().then(res => {
            console.log(res)
            if (!res.rut) {
                res.rut = '-'
            }
            setUsuario(res)
            setNombre(res.nombre)
            setDescripcion(res.descripcion)
            setEmail(res.emai)
        }).catch(e => {
            console.log(e)
            history.push('/')
        })
        return () => {
            setUsuario({})
        }
    }, []);

    if (!Object.keys(usuario).length) {
        return (<Loading />)
    } else {
        return (
            <div>
                <ToastContainer limit={1}></ToastContainer>
                <Row className='mt-2'>
                    <Col md='7'>
                        <Card>
                            <Card.Header>Información Personal</Card.Header>
                            <Card.Body>
                                <Card.Title>
                                    <Row>
                                        <Col md='5'>
                                            Rut {usuario.rut}
                                        </Col>
                                        <Col md='7' className='d-flex align-items-center'>
                                            <small className='font-weight-light'>Modificar datos personales &rarr; &nbsp;</small>
                                            <Button className='pull-right' variant="outline-success" onClick={e => setDisableForm(!disableForm)}>
                                                {
                                                    disableForm
                                                        ? <Icon.Pencil />
                                                        : <Icon.XCircle />
                                                } Modificar
                                </Button>
                                        </Col>
                                    </Row>
                                </Card.Title>
                                <Form noValidate onSubmit={handleModificar} validated={validated}>
                                    <Form.Group>
                                        <Form.Label>Nombre</Form.Label>
                                        <Form.Control type="text" placeholder="Ingrese Nuevo Nombre" onChange={e => setNombre(e.target.value)} value={nombre} disabled={disableForm} maxLength='30' minLength='2' required />
                                        <Form.Control.Feedback type="invalid">
                                            El nombre es necesario
                            </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Descripción</Form.Label>
                                        <Form.Control type="text" placeholder="Ingrese Descripción" onChange={e => setDescripcion(e.target.value)} value={descripcion} disabled={disableForm}
                                            maxLength='240'
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email" placeholder="Ingrese email" onChange={e => setEmail(e.target.value)} value={email} disabled={disableForm} required
                                            maxLength='30'
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            El email es necesario
                            </Form.Control.Feedback>
                                    </Form.Group>
                                    <Accordion>
                                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                            <Icon.Key /> Cambiar Contraseña
                            </Accordion.Toggle>
                                        <Accordion.Collapse eventKey="0">
                                            <Form.Group>
                                                <Form.Label>Nueva Contraseña</Form.Label>
                                                <Form.Control ref={inputPassword} type="password" placeholder="Ingrese Nueva Contraseña"
                                                    onChange={e => setPassword(e.target.value)}
                                                    value={password} disabled={disableForm} isInvalid={invalidPassword}
                                                    maxLength='30'
                                                />

                                                <Form.Control className='mt-1' type="password" placeholder="Repita Nueva Contraseña"
                                                    onChange={e => setRePassword(e.target.value)}
                                                    value={rePassword} disabled={disableForm}
                                                    maxLength='30'
                                                />

                                                <Form.Control.Feedback type="invalid">
                                                    Las contraseñas deben ser iguales
                                    </Form.Control.Feedback>
                                            </Form.Group>
                                        </Accordion.Collapse>
                                    </Accordion>
                                    <Row className='mt-2'>
                                        <Col md='12' className='d-flex justify-content-end'>
                                            <Button className='mr-2' type='submit' variant="warning" disabled={disableForm}><Icon.ArrowRightCircle></Icon.ArrowRightCircle> Guardar Cambios</Button>
                                            <Button variant="danger" onClick={handleLogout}><Icon.Power></Icon.Power> Cerrar Sesión</Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md='5'>
                        <Card>
                            <Publicidad orientation='y'></Publicidad>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Configuracion;