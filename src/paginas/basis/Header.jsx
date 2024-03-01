import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  return (
    <>
      <Navbar collapseOnSelect  expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand onClick={()=>{navigate('')}}><Image src={logo} fluid /></Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {
                rollen?.find(role => ["gebruiker"].includes(role))
                  ? <NavDropdown title="Financieel" id="basic-nav-dropdown">
                    <NavDropdown.Item onClick={()=>{navigate('financieel/uitleg')}}>Uitleg</NavDropdown.Item>
                    <NavDropdown.Item onClick={()=>{navigate('financieel/overzichtspaarboek')}}>Uw Spaarboekske</NavDropdown.Item>
                    {
                      rollen?.find(role => ["financieel"].includes(role))
                        ? <>
                          <NavDropdown.Divider />
                          <NavDropdown.Item onClick={()=>{navigate('financieel/TransactieOverzicht')}}>Alle Verrichtingen</NavDropdown.Item>
                          <NavDropdown.Item onClick={()=>{navigate('financieel/TransactieToevoegen')}}>Transactie Toevoegen</NavDropdown.Item>
                        </>
                        : ''
                    }

                  </NavDropdown>
                  : ''

              }
              {
                rollen?.find(role => ["gebruiker"].includes(role))
                  ? <NavDropdown title="Missies" id="basic-nav-dropdown">
                    <NavDropdown.Item onClick={()=>{navigate('missies/MissieOverzicht')}}>Missie Overzicht</NavDropdown.Item>
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