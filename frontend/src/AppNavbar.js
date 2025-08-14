import React from 'react';
import { Outlet } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

export const AppNavbar = () => {
    return (
        <>
        <div>
            <Navbar bg="dark" >
                <Container fluid>
                    <Navbar.Brand href="/">Alliebooks</Navbar.Brand>
                    <Nav>
                        <Nav.Link href="/leases">Leases</Nav.Link>
                        <Nav.Link href="/expenses">Expenses</Nav.Link>
                        <Nav.Link href="/rent-payments">Rent Payments</Nav.Link>
                        <Nav.Link href="/properties">Properties</Nav.Link>
                        <Nav.Link href="/tenants">Tenants</Nav.Link>
                        <Nav.Link href="/expense-types">Expense Types</Nav.Link>
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