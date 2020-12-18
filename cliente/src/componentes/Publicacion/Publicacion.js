import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom';
import { Card, Button, Popover, Modal, Col, Row, Form, FormGroup, ListGroup } from 'react-bootstrap'
import * as Icon from 'react-bootstrap-icons';
import './styles.css'
import useComentarios from './../../hooks/useComentarios';
import useGetPubli from './../../hooks/useGetPubli';
import useDenuncias from './../../hooks/useDenuncias';
import { UserContext } from './../../context/UserContext';
import Loading from './../Recursos/Loading';
import Publicidad from '../Recursos/Publicidad';
import StartChat from '../Recursos/StartChat';
import { notifyError, notifyRight } from '../Recursos/Toasts';
import { ToastContainer } from 'react-toastify';
//props.location.publicacion
export default function Publicacion(props) {
    const { idUserGlobal } = useContext(UserContext)
    let history = useHistory()
    const [canEditPub, setCanEditPub] = useState(false)
    const { doDenuncia } = useDenuncias()
    const rescuePubId = props.match.params.idpublicacion
    const { getComentarios, comentar } = useComentarios()
    const { getOnePublicacion, updatePub, delPub } = useGetPubli()

    const [pub, setPub] = useState(props.location.publicacion)
    const [newComentario, setNewComentario] = useState('');
    const [denuncia, setDenuncia] = useState('');
    const [comentarios, setComentarios] = useState([]);
    const [auxiliar, setAuxiliar] = useState(true);
    const [editPub, setEditPub] = useState(false);
    const [modifyPub, setModifyPub] = useState(() => {
        if (!pub) return '';
        return pub.descripcion;
    });
    const [show, setShow] = useState(false);
    const [validated, setValidated] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const handleNewComentario = (e) => {
        e.preventDefault()
        comentar(newComentario, pub.idPublicaciones)
            .then((res) => {
                if (res === 200) {
                    setAuxiliar(!auxiliar)
                }
            })
            .catch(() => (console.log('errror')))
            .finally(
                setNewComentario('')
            )
    }

    const handleModPub = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const form = e.currentTarget
        if (form.checkValidity() === false) {
            form.classList.add('was-validated')
        } else {
            updatePub(pub.idPublicaciones, modifyPub).then(res => {
                if (res === 200) {
                    setPub(null)
                    setEditPub(false)
                    setAuxiliar(!auxiliar)
                }
            })
        }
    }

    const handleDelPub = (e) => {
        e.preventDefault()
        delPub(pub.idPublicaciones).then(res => {
            if (res === 200) history.push('/home/publicaciones')
        }).catch(console.log('asdasdad'))
    }

    const handleDenunciar = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const form = e.currentTarget
        if (form.checkValidity() === false) {
            form.classList.add('was-validated')
        } else {
            doDenuncia(pub.idPublicaciones, denuncia).then(res => {
                notifyRight('Reporte enviado')
                handleClose()
            }).catch(e => {
                notifyError('Reporte no se pudo enviar')
                handleClose()
            })
        }

    }

    const formatoFecha = (isoDate) => {
        console.log(new Date(isoDate).toLocaleString().substring(0, 10),'  ',)
        if (new Date(isoDate).toLocaleString().substring(0, 10) === new Date().toLocaleString().substring(0, 10)) {
            return 'Hoy'
        } else {
            return new Date(isoDate).toLocaleDateString()
        }
    }

    useEffect(() => {
        if (!pub) {
            getOnePublicacion(rescuePubId).then(res => {
                setPub(res)
                setModifyPub(res.descripcion)
                console.log(res.idUsuarios, '-', idUserGlobal)
                setCanEditPub(res.idUsuarios == idUserGlobal)
                getComentarios(res.idPublicaciones).then(resp => (setComentarios(resp)))

            }).catch(e => { setPub(null); history.push('/home/publicaciones'); })
        } else {
            const aux = async () => {
                const res = await getComentarios(pub.idPublicaciones)
                setComentarios(res)
            }
            aux()
        }
    }, [auxiliar])

    if (!pub) return (<Loading></Loading>);
    return (
        <Row>
            <Col md='10'>
                <div id='formato' className='mx-auto my-3'>
                    <Card key={pub.idPublicaciones} border='primary'>
                        <ToastContainer></ToastContainer>
                        <Card.Header>
                            <Card.Title className='w-50 d-inline-block'>
                                <StartChat idUser={pub.idUsuarios} name={pub.nombre}></StartChat>
                            </Card.Title>
                            {!canEditPub &&
                                <>
                                    <Button variant="warning" className='pull-right' onClick={handleShow}>
                                        Reportar
                                    </Button>
                                    <Modal show={show} onHide={handleClose}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Reportar Publicación</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <Form noValidate validated={validated} onSubmit={handleDenunciar}>
                                                <Form.Control placeholder='¿Cuál es el motivo?' value={denuncia} onChange={e => setDenuncia(e.target.value)}
                                                    required
                                                    maxLength='250' />
                                                <Form.Control.Feedback type='invalid'>
                                                    Debe especificar en máximo 250 caractéres
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
                                </>
                            }
                            {canEditPub && <>
                                <Button className='pull-right' variant='danger' onClick={handleDelPub}>Eliminar</Button>
                                <Button className='pull-right mr-2' variant='warning' onClick={() => (setEditPub(!editPub))}>Editar</Button>
                            </>
                            }
                        </Card.Header>

                        <Card.Body variant='light' className='text-left' >
                            <Form className="mb-3" noValidate validated={validated} onSubmit={handleModPub}>
                                <Form.Group>
                                    <Row>
                                        <Col md='10'>
                                            <Form.Control
                                                disabled={!editPub}
                                                placeholder="Escribe un algo..."
                                                onChange={(e) => setModifyPub(e.target.value)} value={modifyPub}
                                                required
                                                maxLength='250'
                                                plaintext={!canEditPub}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                No puede quedar vacio
                                            </Form.Control.Feedback>
                                        </Col>
                                        <Col md='2'>
                                            {editPub && <Button className='d-inline' variant='primary' type='submit' >Guardar</Button>}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md='12' className='mt-4'>
                                            <span className='pull-right'>
                                                <Card.Subtitle>
                                                    Fecha de Publicación: {formatoFecha(pub.fecha)}
                                                </Card.Subtitle>
                                            </span>

                                        </Col>
                                    </Row>
                                </Form.Group>
                            </Form>
                            <ListGroup variant="flush">
                                {comentarios.map(val => (
                                    <ListGroup.Item className='d-flex'>
                                        <Card.Title className='d-inline-block'>
                                            <StartChat idUser={val.idUsuariosComentario} name={val.nombre}></StartChat>
                                        </Card.Title>
                                        <div className='d-inline-block mt-2'>
                                            {': ' + val.comentario}
                                        </div>
                                    </ListGroup.Item>

                                ))}
                            </ListGroup>
                        </Card.Body>

                        <Card.Footer >

                            <Form className="mb-3" validate>
                                <Row>
                                    <Col md='10'>
                                        <Form.Control
                                            aria-label="Recipient's username"
                                            aria-describedby="basic-addon2"
                                            placeholder="Escribe un comentario..."
                                            onChange={e => setNewComentario(e.target.value)} value={newComentario}
                                            required
                                            maxLength='250'
                                        />
                                    </Col>
                                    <Col>
                                        <Button variant="success"
                                            onClick={handleNewComentario}
                                            disabled={!Boolean(newComentario.trim().length > 0)}
                                        >
                                            <Icon.ArrowRightCircle /> Enviar</Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Footer>
                    </Card>
                </div >
            </Col>
            <Col md='2'>
                <div className='sticky-top'>
                    <div className='mt-3'>
                        <Publicidad orientation='z'></Publicidad>
                    </div>
                </div>
            </Col>
        </Row>
    )
}