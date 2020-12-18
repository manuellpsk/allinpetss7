import React from 'react';
import { Card, CardDeck, Col, Row } from 'react-bootstrap';
import Publicidad from '../Recursos/Publicidad';

function Adopciones(props) {
    return (
        <div className='container-fluid my-3'>
            <Row>
                <Col md='10'>
                    <CardDeck>
                        <Card>
                            <Card.Img variant="top" src="/images/dulce.png" />
                            <Card.Body className='text-center'>
                                <a href='https://www.fundacionhuellaanimal.cl/dulce/' target="_blank" style={{ textDecoration: 'none' }} rel='noreferrer'>
                                    <Card.Title>
                                        Dulce
                                    </Card.Title>
                                </a>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Img variant="top" src="/images/zeta.png" />
                            <Card.Body className='text-center'>
                                <a href='https://www.fundacionhuellaanimal.cl/zeta/' target="_blank" style={{ textDecoration: 'none' }} rel='noreferrer'>
                                    <Card.Title>
                                        Zeta
                                    </Card.Title>
                                </a>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Img variant="top" src="/images/salvi.png" />
                            <Card.Body className='text-center'>
                                <a href='https://www.fundacionhuellaanimal.cl/salvi/' target="_blank" style={{ textDecoration: 'none' }} rel='noreferrer'>
                                    <Card.Title>
                                        Salvi
                                    </Card.Title>
                                </a>
                            </Card.Body>
                        </Card>
                    </CardDeck>
                    <CardDeck className='mt-3'>
                        <Card>
                            <Card.Img variant="top" src="/images/pili.jpg" />
                            <Card.Body className='text-center'>
                                <a href='https://buscamoscasita.cl/pet/pili/' target="_blank" style={{ textDecoration: 'none' }} rel='noreferrer'>
                                    <Card.Title>
                                        Pili
                                    </Card.Title>
                                </a>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Img variant="top" src="/images/piti.jpg" />
                            <Card.Body className='text-center'>
                                <a href='https://buscamoscasita.cl/pet/piti/' target="_blank" style={{ textDecoration: 'none' }} rel='noreferrer'>
                                    <Card.Title>
                                        Piti
                                    </Card.Title>
                                </a>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Img variant="top" src="/images/lucas.jpg" />
                            <Card.Body className='text-center'>
                                <a href='https://buscamoscasita.cl/pet/lucas/' target="_blank" style={{ textDecoration: 'none' }} rel='noreferrer'>
                                    <Card.Title>
                                        Lucas
                                    </Card.Title>
                                </a>
                            </Card.Body>
                        </Card>
                    </CardDeck>
                </Col>
                <Col>
                    <div className='sticky-top'>
                        <div className='mt-3'>
                            <Publicidad orientation='z'></Publicidad>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
}
export default Adopciones;