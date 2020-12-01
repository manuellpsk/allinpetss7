import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, Button, FormControl, InputGroup } from 'react-bootstrap'
import './styles.css'
import * as Icon from 'react-bootstrap-icons';
import useComentarios from './../../hooks/useComentarios';

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
    return (
        <div id='formato' className='mx-auto my-3' key={publi.idPublicaciones}>
            <Card border='primary'>
                <Card.Header>{publi.nombre || new Date(publi.fecha).toString().replace('GMT-0300', '')}</Card.Header>
                <Card.Body variant='light'>
                    <p >
                        {publi.descripcion}
                    </p>
                    <span className='pull-right'>
                        <Link to={{
                            pathname: '/home/publicacion/' + publi.idPublicaciones
                        }}>Ver más</Link>
                    </span>
                </Card.Body>
                <Card.Footer >
                    <InputGroup className="mb-3">
                        <FormControl
                            key={publi.idPublicaciones}
                            aria-label="Recipient's username"
                            aria-describedby="basic-addon2"
                            placeholder="Escribe un comentario..." onChange={e => setNewComentario(e.target.value)} value={newComentario}
                        />
                        <InputGroup.Append>
                            <Button variant="outline-primary" onClick={handleNewComentario}
                                disabled={!Boolean(newComentario.trim().length > 0)}
                            > <Icon.ArrowRightCircle /> Enviar</Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Card.Footer>
            </Card>
        </div>
    )
}
