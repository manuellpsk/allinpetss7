import React, { useState, useEffect } from 'react';
import useUser from './../../hooks/useUser';
import Loading from './../Recursos/Loading';
import { Card, Form, Button, Accordion } from 'react-bootstrap'
import { useHistory } from 'react-router-dom';
import * as Icon from 'react-bootstrap-icons';

function Configuracion(props) {

    const { getMyDataUser, logout, updateUser } = useUser()
    let history = useHistory()
    const [usuario, setUsuario] = useState({});
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [password, setPassword] = useState('');
    const [disableForm, setDisableForm] = useState(true);
    const [rePassword, setRePassword] = useState('');
    const [error, setError] = useState(false);
    const [exito, setExito] = useState(false);

    const handleLogout = () => {
        logout();
        history.push('/')
    }

    const handleModificar = () => {
        if (password !== rePassword) {
            setError(true)
            return
        } else {
            setError(false)
        }
        const userModify = {
            nombre,
            password,
            email,
            descripcion
        }
        for (let propiedad in userModify) {
            if (userModify[propiedad] === null || userModify[propiedad] === undefined) {
                delete userModify[propiedad]
            }
        }

        updateUser(userModify).then(() => {
            setExito(true)
        }).catch(() => {
            setExito(false)
        })
    }

    useEffect(() => {
        getMyDataUser().then(res => {
            console.log(res)
            setUsuario(res)
            setNombre(res.nombre)
            setDescripcion(res.descripcion)
            setEmail(res.emai)
        }).catch(e => {
            history.push('/')
        })
    }, []);

    if (!Object.keys(usuario).length) return (<Loading />);

    return (
        <div>
            <Card border="primary" style={{ width: '40rem' }}>
                <Card.Header>Información del Usuario</Card.Header>
                <Card.Body>
                    <Card.Title>Rut {usuario.rut}</Card.Title>
                    {exito && <p className='border border-success'>Modificacion exitosa</p>}
                    <Form>
                        <Form.Group>
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="text" placeholder="Ingrese Nuevo Nombre" onChange={e => setNombre(e.target.value)} value={nombre} disabled={disableForm} />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control type="text" placeholder="Ingrese Descripción" onChange={e => setDescripcion(e.target.value)} value={descripcion} disabled={disableForm} />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="text" placeholder="Ingrese email" onChange={e => setEmail(e.target.value)} value={email} disabled={disableForm} />
                        </Form.Group>
                        <Accordion>
                            <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                <Icon.Key /> Cambiar Contraseña
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="0">
                                <Form.Group>
                                    {error && <p className='border border-danger'>Las contraseñas deben ser iguales</p>}
                                    <Form.Label>Nueva Contraseña</Form.Label>
                                    <Form.Control type="password" placeholder="Ingrese Nueva Contraseña" onChange={e => setPassword(e.target.value)} value={password} disabled={disableForm} />
                                    <Form.Control type="password" placeholder="Repita Nueva Contraseña" onChange={e => setRePassword(e.target.value)} value={rePassword} disabled={disableForm} />
                                </Form.Group>
                            </Accordion.Collapse>
                        </Accordion>
                    </Form>
                </Card.Body>
                <Card.Footer>
                    <Button variant="success" disabled={disableForm} onClick={handleModificar}><Icon.ArrowRightCircle></Icon.ArrowRightCircle> Modificar</Button>
                    <Button variant="warning" onClick={e => setDisableForm(!disableForm)}>
                        {
                            disableForm
                                ? <Icon.Pencil />
                                : <Icon.XCircle />
                        }Editar Datos
                    </Button>
                </Card.Footer>
            </Card>
            <Button variant="danger" onClick={handleLogout}><Icon.Power></Icon.Power> Cerrar Sesión</Button>

        </div>
    );
}

export default Configuracion;