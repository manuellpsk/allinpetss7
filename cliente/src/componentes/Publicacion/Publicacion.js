import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom';
import { Card, Button, InputGroup, FormControl, Modal } from 'react-bootstrap'
import * as Icon from 'react-bootstrap-icons';
import './styles.css'
import useComentarios from './../../hooks/useComentarios';
import useGetPubli from './../../hooks/useGetPubli';
import useDenuncias from './../../hooks/useDenuncias';
import { UserContext } from './../../context/UserContext';
import Loading from './../Recursos/Loading';

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
        e.preventDefault()
        updatePub(pub.idPublicaciones, modifyPub).then(res => {
            if (res === 200) {
                setPub(null)
                setEditPub(false)
                setAuxiliar(!auxiliar)
            }
        })
    }

    const handleDelPub = (e) => {
        e.preventDefault()
        delPub(pub.idPublicaciones).then(res => {
            if (res === 200) history.push('/home/publicaciones')
        }).catch(console.log('asdasdad'))
    }

    const handleDenunciar = (e) => {
        e.preventDefault()
        doDenuncia(pub.idPublicaciones, denuncia).then(res => (handleClose()))

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
        <div id='formato' className='mx-auto my-3'>
            <Card key={pub.idPublicaciones} border='primary'>

                <Card.Header>
                    {new Date(pub.fecha).toString().replace('GMT-0300','')}
                    {!canEditPub &&
                        <>
                            <Button variant="warning" onClick={handleShow}>
                                Denunciar
                            </Button>
                            <Modal show={show} onHide={handleClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Estás iniciando una denuncias</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <input placeholder='¿Cuál es el motivo de la denuncia?' value={denuncia} onChange={e => setDenuncia(e.target.value)}></input>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleClose}>
                                        Cancelar
                                    </Button>
                                    <Button variant="primary" onClick={handleDenunciar}>
                                        Denunciar
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </>
                    }
                    {canEditPub && <><Button variant='warning'
                        onClick={() => (setEditPub(!editPub))}>Editar</Button>
                        <Button variant='danger' onClick={handleDelPub}>Eliminar</Button></>
                    }
                </Card.Header>

                <Card.Body variant='light' className='text-left' >
                    <InputGroup className="mb-3">
                        <FormControl
                            disabled={!editPub}
                            placeholder="Escribe un algo..."
                            onChange={(e) => setModifyPub(e.target.value)} value={modifyPub}
                        />
                        {editPub && <Button variant='primary' onClick={handleModPub}>Editar</Button>}
                    </InputGroup>
                </Card.Body>

                <Card.Footer >
                    {comentarios.map(val => (
                        <div key={val.idcomentarios}>
                            < label htmlFor="basic-url">{val.nombre}</label>
                            <InputGroup className="mb-3">
                                <FormControl
                                    id="basic-url"
                                    aria-describedby="basic-addon3"
                                    value={val.comentario} disabled className='cursor-none'
                                    style={{ backgroundColor: 'white' }}>

                                </FormControl>
                            </InputGroup>
                        </div>
                    ))}
                    <InputGroup className="mb-3">
                        <FormControl
                            aria-label="Recipient's username"
                            aria-describedby="basic-addon2"
                            placeholder="Escribe un comentario..."
                            onChange={e => setNewComentario(e.target.value)} value={newComentario}
                        />
                        <InputGroup.Append>
                            <Button variant="outline-primary" 
                            onClick={handleNewComentario}
                            disabled={!Boolean(newComentario.trim().length > 0)}
                            >
                                <Icon.ArrowRightCircle /> Enviar</Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Card.Footer>
            </Card>
        </div >
    )
}