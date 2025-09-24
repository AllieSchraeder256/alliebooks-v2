import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

export const AppNavbar = () => {
    return (
        <>
        <div>
            <Navbar bg="dark" >
                <Container fluid>
                    <Navbar.Brand as={Link} to="/">Alliebooks</Navbar.Brand>
                    <Nav>
                        <Nav.Link as={Link} to="/leases">Leases</Nav.Link>
                        <Nav.Link as={Link} to="/expenses">Expenses</Nav.Link>
                        <Nav.Link as={Link} to="/rent-payments">Rent Payments</Nav.Link>
                        <Nav.Link as={Link} to="/properties">Properties</Nav.Link>
                        <Nav.Link as={Link} to="/tenants">Tenants</Nav.Link>
                        <Nav.Link as={Link} to="/expense-types">Expense Types</Nav.Link>
                        <Nav.Link as={Link} to="/admin">Admin</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </div>
        <Container fluid className="bg-light md">
            <Container className="md py-3">
                <Outlet/>
            </Container>
        </Container>
        </>
    );
}
export default AppNavbar;