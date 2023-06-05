import React from 'react';
import { Navbar, Container } from 'react-bootstrap';

const NavbarApp = () => {
    return (
        <Navbar bg="dark" variant="dark">
            <Container>
            <Navbar.Brand href="#home" style={ {height: '38px'} } className='fst-italic fw-semibold'>
                <img
                alt=""
                src={require("../imgs/lizard.png")}
                width="50"
                height="50"
                className="d-inline-block align-top"
                />{' '}
                    Lagarto 17
                </Navbar.Brand>
            </Container>
        </Navbar>
        );
};

export default NavbarApp;