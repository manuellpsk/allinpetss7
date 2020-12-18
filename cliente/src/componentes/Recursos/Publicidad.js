import React from 'react'
import { Col, Row } from 'react-bootstrap';
import Image from 'react-bootstrap/Image'

export default function Publicidad(props) {
    const orientation = props.orientation;
    if (orientation === 'x') {
        return (
            <div className='container-fluid my-2'>
                <Row className='align-items-center'>
                    <Col>
                        <Image src='/images/arca.png' fluid />
                    </Col>
                    <Col>
                        <Image src="/images/masterdog.png" fluid className='mx-auto d-block' />
                    </Col>
                    <Col>
                        <Image src='/images/dr.jpg' fluid rounded />
                    </Col>
                </Row>
            </div>
        )
    } else if (orientation === 'y') {
        return (
            <div className='container-fluid my-2'>
                <Row className='align-items-center'>
                    <Col>
                        <Image src='/images/masterdog.png' fluid className='mx-auto d-block' />
                    </Col>
                </Row>

                <Row className='my-3 align-items-center'>
                    <Col>
                        <Image src="/images/arca.png" fluid />
                    </Col>
                </Row>

                <Row className='align-items-center'>
                    <Col>
                        <Image src='/images/dr.jpg' fluid rounded />
                    </Col>
                </Row>
            </div>
        )
    } else if (orientation === 'z') {
        return (
            <div className='container-fluid my-2'>
                <Row className='align-items-center pt-5'>
                    <Col>
                        <Image src='/images/arca.png' fluid />
                    </Col>
                </Row>

                <Row className='my-5 align-items-center'>
                    <Col>
                        <Image src="/images/masterdog.png" fluid className='mx-auto d-block' />
                    </Col>
                </Row>

                <Row className='align-items-center'>
                    <Col>
                        <Image src='/images/dr.jpg' fluid rounded />
                    </Col>
                </Row>

                <Row className='mt-5 align-items-center'>
                    <Col>
                        <Image src='/images/logoHuella.png' fluid />
                    </Col>
                </Row>
            </div>
        )
    }

}
