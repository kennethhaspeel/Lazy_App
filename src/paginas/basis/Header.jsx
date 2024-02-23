import { useRef, useState, useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Image from 'react-bootstrap/Image';
import logo from '../../assets/favicon-32x32.png'
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

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
                    <Link to="financieel/uitleg" className='nav-link'>
                      Uitleg
                    </Link>
                    <Link to="financieel/overzichtspaarboek" className='nav-link'>
                      Uw Spaarboekske
                    </Link>

                    {
                      rollen?.find(role => ["financieel"].includes(role))
                        ? <>
                          <NavDropdown.Divider />
                          <Link to="financieel/TransactieOverzicht" className='nav-link' >
                            Alle Verrichtingen
                          </Link>
                          <Link to="financieel/TransactieToevoegen" className='nav-link' >
                            Transactie Toevoegen
                          </Link>
                        </>
                        : ''
                    }

                  </NavDropdown>
                  : ''

              }
              {
                rollen?.find(role => ["gebruiker"].includes(role))
                  ? <NavDropdown title="Missies" id="basic-nav-dropdown">
                    <Link to="missies/MissieOverzicht" className='nav-link' >
                      Missie Overzicht
                    </Link>
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
                <Link to='identity/registreer' className='me-2 mb-2 btn btn-info'>Registreer</Link>
                <Link to='identity/login' className='me-2 mb-2 btn btn-info'>Log in</Link>
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