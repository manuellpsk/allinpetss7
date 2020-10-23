import React, { useState, useEffect, useContext } from 'react'
import { Card, Button, InputGroup, FormControl } from 'react-bootstrap'
import './styles.css'
import * as Icon from 'react-bootstrap-icons';
import useComentarios from './../../hooks/useComentarios';
import Loading from './../Recursos/Loading';
import useGetPubli from './../../hooks/useGetPubli';
import { UserContext } from './../../context/UserContext';
import { useHistory } from 'react-router-dom';


//props.location.publicacion
export default function Publicacion(props) {
    const { idUserGlobal } = useContext(UserContext)
    let history = useHistory()
    const [canEditPub, setCanEditPub] = useState(false);
    const rescuePubId = props.match.params.idpublicacion
    const { getComentarios, comentar } = useComentarios()
    const { getOnePublicacion, updatePub, delPub } = useGetPubli()

    const [pub, setPub] = useState(props.location.publicacion)
    const [newComentario, setNewComentario] = useState('');
    const [comentarios, setComentarios] = useState([]);
    const [auxiliar, setAuxiliar] = useState(true);
    const [editPub, setEditPub] = useState(false);
    const [modifyPub, setModifyPub] = useState(() => {
        if (!pub) return '';
        return pub.descripcion;
    });

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
                    {pub.fecha}
                    {canEditPub && <><Button variant='warning'
                        onClick={() => (setEditPub(!editPub))}>Editar</Button>
                        <Button variant='danger' onClick={handleDelPub}>Eliminar</Button></>}
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
                            <Button variant="outline-primary" onClick={handleNewComentario}>
                                <Icon.ArrowRightCircle /> Enviar</Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Card.Footer>
            </Card>
        </div >
    )
}
/**
 *
 */