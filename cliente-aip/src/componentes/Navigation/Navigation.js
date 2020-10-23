import React from 'react'
import { Navbar, Container, Button } from 'react-bootstrap'
import * as Icon from 'react-bootstrap-icons';
import ModalSignIn from '../ModalSignIn/ModalSignIn'
import Image from 'react-bootstrap/Image'
import './styles.css'
import useUser from './../../hooks/useUser';
import { Link } from 'react-router-dom';

const Drop = () => {
    return (
        <>
            <Navbar.Toggle></Navbar.Toggle>
            <Navbar.Collapse className='justify-content-end'>
                <Link to='/home/configuracion' className='btn btn-outline-dark float-right'>
                    <Icon.Gear size="18"></Icon.Gear>
                    <small className='font-weight-bold'> Mi Cuenta</small>
                </Link>
            </Navbar.Collapse>
        </>
    );
}

const Navigation = () => {
    const { isLogged } = useUser()

    return (
        <div>
            <Navbar id='navbar' expand='lg' variant='light' style={{ backgroundColor: '#80ffff' }} className='navbar-fixed-top'>
                <Container>
                    <Navbar.Brand href='/'><Image src="/images/logoinicio.png" fluid style={{ width: '150px' }, { height: '60px' }} /></Navbar.Brand>
                    {
                        isLogged
                            ? <Drop></Drop>
                            : <ModalSignIn></ModalSignIn>
                    }
                </Container>
            </Navbar>
        </div>
    )
}

export default Navigation