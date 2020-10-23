import React from 'react'
import { Col, Row } from 'react-bootstrap';
import Image from 'react-bootstrap/Image'

export default function Publicidad(props) {
    const orientation = props.orientation;
    return (
        <div className='container-fluid my-2'>
            <Row className='align-items-center'>
                <Col>
                    <Image src='./images/arca.png' fluid />
                </Col>
                <Col>
                    <Image src="./images/masterdog.png" fluid className='mx-auto d-block' />
                </Col>
                <Col>
                    <Image src='./images/dr.jpg' fluid rounded />
                </Col>
            </Row>
        </div>
    )
}
