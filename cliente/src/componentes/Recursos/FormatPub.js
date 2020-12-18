import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, Button, FormControl, InputGroup } from 'react-bootstrap'
import './styles.css'
import * as Icon from 'react-bootstrap-icons';
import useComentarios from './../../hooks/useComentarios';
import StartChat from './StartChat';

export default function FormatPub(props) {
    const { publi } = props
    const [newComentario, setNewComentario] = useState('');
    const { comentar } = useComentarios()
    const handleNewComentario = (e) => {
        e.preventDefault()
        comentar(newComentario, publi.idPublicaciones)
            .then((res) => {
                if (res === 200) {
                    setNewComentario('')
                }
            })
            .catch(() => (console.log('errror')))
            .finally(
                setNewComentario('')
            )
    }

    const formatoFecha = (isoDate) => {
        console.log(new Date(isoDate).toLocaleString().substring(0, 10), '  ',)
        if (new Date(isoDate).toLocaleString().substring(0, 10) === new Date().toLocaleString().substring(0, 10)) {
            return 'Hoy'
        } else {
            return new Date(isoDate).toLocaleDateString()
        }
    }


    return (
        <div id='formato' className='my-3' key={publi.idPublicaciones}>
            <Card border='primary'>
                <Card.Header className='d-flex'>
                    <Card.Title className='w-50 d-inline-block'>
                        <StartChat idUser={publi.idUsuarios} name={publi.nombre}></StartChat>
                    </Card.Title>
                    <Card.Subtitle className='w-50 d-inline-block text-right'>
                        Fecha de Publicación: {formatoFecha(publi.fecha)}
                    </Card.Subtitle>
                </Card.Header>
                <Card.Body variant='light'>
                    <p >
                        {publi.descripcion}
                    </p>
                    <span className='pull-right'>
                        <Link to={{
                            pathname: '/home/publicacion/' + publi.idPublicaciones
                        }} style={{ color: 'black' }} >Ver publicación</Link>
                    </span>
                </Card.Body>
                <Card.Footer >
                    <InputGroup className="mb-3">
                        <FormControl
                            key={publi.idPublicaciones}
                            aria-label="Recipient's username"
                            aria-describedby="basic-addon2"
                            placeholder="Escribe un comentario..." onChange={e => setNewComentario(e.target.value)} value={newComentario}
                            required
                            maxLength='250'
                        />
                        <InputGroup.Append>
                            <Button variant="success" onClick={handleNewComentario}
                                disabled={!Boolean(newComentario.trim().length > 0)}
                            > <Icon.ArrowRightCircle /> Enviar</Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Card.Footer>
            </Card>
        </div>
    )
}
