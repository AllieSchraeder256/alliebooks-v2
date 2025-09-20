import React, { useEffect, useState } from 'react';
import { Container, Table, Row, Col } from 'reactstrap';
import SignupForm from '../components/SignupForm';
import { apiFetch } from '../utils/api';
import OcrTokenList from './OcrTokenList';

const AdminHome = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        const users = await (await apiFetch(`/auth/users`)).json();
        setUsers(users);
    }

    return (
        <Container>
            <h1>Admin Home</h1>
            <h5>Users</h5>
            <Row>
                <Col md={6}>
                    <Table hover>
                        <thead>
                            <tr>
                                <td>Name</td>
                                <td>Created</td>
                            </tr>
                        </thead>
                        {users && users.map &&
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        }
                    </Table>
                </Col>
                <Col md={6}>
                    <SignupForm />
                </Col>
            </Row>
            <hr />
            <Row>
                <OcrTokenList />
            </Row>

        </Container>
    );
}
export default AdminHome;