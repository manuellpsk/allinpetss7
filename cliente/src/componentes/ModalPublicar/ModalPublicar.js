import React, { useState, useRef, useEffect } from 'react'
import { Button, Modal, Form, OverlayTrigger, Tooltip, Row, Col } from 'react-bootstrap'
import * as Icon from 'react-bootstrap-icons';
import './styles.css'
import useGetPubli from './../../hooks/useGetPubli';
import { useHistory } from 'react-router-dom';

export default function ModalPublicar(props) {
    const { doPublicar } = useGetPubli()
    let history = useHistory()

    const inputElement = useRef(null);
    const [newPub, setNewPub] = useState('');
    const [show, setShow] = useState(false);
    const [validated, setValidated] = useState(false);

    const handleClose = () => setShow(false)

    const handleShow = () => setShow(true)
    
    useEffect(() => {
        if (show) {
            inputElement.current.focus();
        }
    }, [show]);

    const handlePublicar = (e) => {
        e.preventDefault()
        e.stopPropagation()
        const form = e.currentTarget
        if (form.checkValidity() === false) {
            form.classList.add('was-validated')
        } else {
            if (newPub.trim().length === 0) {
                setNewPub('')
                setValidated(false)
            } else {
                setValidated(true)
                doPublicar(newPub).then(res => {
                    if (res.status === 200) {
                        history.push('/home/publicacion/' + res.data.pubId)
                    } else {
                        console.log('no hay res')
                    }
                }).catch(console.log('error xdx d')).finally(handleClose())

            }
        }
    }

    return (
        <>
            <OverlayTrigger
                placement={'top'}
                overlay={
                    <Tooltip>
                        Publicar en <strong>AllinPets</strong>
                    </Tooltip>
                }
            >
                <Button id='boton' variant="primary" onClick={e => { handleShow(e) }}>
                    <Icon.Plus size="32"></Icon.Plus>
                </Button>
            </OverlayTrigger>

            <Modal show={show}
                centered
                onHide={handleClose}
                scrollable={false}
                id='mod'
            >
                <Modal.Header closeButton>
                    <Modal.Title>Publicar</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handlePublicar}>
                        <Row>
                            <Col md='12'>
                                <Form.Group>
                                    <Form.Control ref={inputElement} type="text" placeholder="Escribe aquí..." onChange={(e) => setNewPub(e.target.value)} value={newPub} minLength='1' maxLength='255' required />
                                    <Form.Control.Feedback type="invalid">
                                        El campo no puede estar vacío
                            </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md='8'>
                                <small>Caracteres {newPub.length}/255 </small>
                            </Col>
                            <Col md='4'>
                                <Button variant="outline-primary" type='submit' className='pull-right'>
                                    Enviar
                                </Button>
                            </Col>
                        </Row>

                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}
