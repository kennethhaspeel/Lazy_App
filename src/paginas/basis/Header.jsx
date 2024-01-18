import { useRef, useState, useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Image from 'react-bootstrap/Image';
import logo from '../../assets/favicon-32x32.png'
import { Button } from 'react-bootstrap';

const Header = ({ huidige_gebruiker }) => {
  const rollen = huidige_gebruiker?.rollen
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/"><Image src={logo} fluid /></Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">Home</Nav.Link>
              {/* <Nav.Link href="#link">Link</Nav.Link> */}
              {
                rollen?.find(role => ["gebruiker"].includes(role))
                  ? <NavDropdown title="Financieel" id="basic-nav-dropdown">
                    <NavDropdown.Item href="/financieel/uitleg">Uitleg</NavDropdown.Item>
                    <NavDropdown.Item href="/financieel/overzicht/:id">Uw Spaarboekske</NavDropdown.Item>

                    {
                      rollen?.find(role => ["admin"].includes(role))
                        ? <><NavDropdown.Divider /><NavDropdown.Item href="#action/3.4">Transactie</NavDropdown.Item></>
                        : ''
                    }

                  </NavDropdown>
                  : ''
              }
            </Nav>
            <Nav>
              {huidige_gebruiker?.rollen !== undefined ? (
                <>
                  <Button href="/identity/loguit" className='me-2 mb-2'>Log Uit</Button>
                </>
              ) : (
                <>
                  <Button href="/identity/registreer" className='me-2 mb-2'>Registreer</Button>
                  <Button href="/identity/login" className='me-2 mb-2'>Log In</Button>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  )
}

export default Header