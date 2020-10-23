import React, { useState } from 'react'
import { Button, Modal, Form } from 'react-bootstrap'
import * as Icon from 'react-bootstrap-icons';
import './styles.css'
import useGetPubli from './../../hooks/useGetPubli';
import { useHistory } from 'react-router-dom';

export default function ModalPublicar(props) {
    const { doPublicar } = useGetPubli()
    let history = useHistory()

    const [newPub, setNewPub] = useState();
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handlePublicar = (e) => {
        e.preventDefault()
        doPublicar(newPub).then(res => {
            if (res.status === 200) {
                history.push('/home/publicacion/'+res.data.pubId)
            }else{
                console.log('no hay res')
            }
        }).catch(console.log('error xdx d')).finally(handleClose())
    }

    return (
        <>
            <Button id='boton' variant="outline-dark" onClick={handleShow}>
                <Icon.Plus size="32"></Icon.Plus>
            </Button>
            <Modal show={show}
                centered
                onHide={handleClose}
                scrollable={false}
                id='mod'
            >
                <Modal.Header closeButton>
                    <Modal.Title>Publicar</Modal.Title>
                </Modal.Header>
                <Form>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Control type="text" placeholder="Escribe aquí..." onChange={(e) => setNewPub(e.target.value)} value={newPub} />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer className='d-block'>
                        <Button variant="primary" onClick={handlePublicar}>
                            Enviar
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}
