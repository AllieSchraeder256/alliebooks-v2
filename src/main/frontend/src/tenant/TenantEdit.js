import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button, Form, FormGroup, Input, Label, Row, Col } from 'reactstrap';
import { apiFetch } from '../utils/api';

const emptyTenant = {
    firstName: '',
    lastName: '',
    email: ''
};

const TenantEdit = () => {
    const id = useParams().id || 'new';
    const [tenant, setTenant] = useState(emptyTenant);
    const navigate = useNavigate();

    const title = <h2>{ tenant.id ? 'Edit Tenant' : 'Add Tenant'}</h2>;

    useEffect(() => {
        loadTenant(id);
    });

    const loadTenant = async (id) => {
        if (id !== 'new') {
            const tenant = await (await apiFetch(`/tenants/${id}`)).json();
            setTenant(tenant);
        } else {
            setTenant(emptyTenant);
        }
    }

    function handleChange(event) {
        tenant[event.target.name] = event.target.value;
        setTenant({...tenant});
    }

    function handleSubmit(event) {
        event.preventDefault();
        saveTenant();
    }

    async function saveTenant() {
        await apiFetch('/tenants' + (tenant.id ? '/' + tenant.id : ''), {
            method: (tenant.id) ? 'PUT' : 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tenant),
        }).then(() => {
            navigate('/tenants', { replace: true });
        });
    }

    return (
        <>
        <div>
            {title}
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col sm={4}>
                        <FormGroup>
                            <Label for="firstName">First Name</Label>
                            <Input type="text" name="firstName" id="firstName" value={tenant.firstName || ''} onChange={handleChange} />
                        </FormGroup>
                    </Col>
                    <Col sm={4}>
                        <FormGroup>
                            <Label for="lastName">Last Name</Label>
                            <Input type="text" name="lastName" id="lastName" value={tenant.lastName || ''} onChange={handleChange} />
                        </FormGroup>
                    </Col>
                    <Col sm={4}>
                        <FormGroup>
                            <Label for="email">Email Address</Label>
                            <Input type="email" name="email" id="email" value={tenant.email || ''} onChange={handleChange} />
                        </FormGroup>
                    </Col>
                </Row>

                <FormGroup className="mt-4">
                    <Button color="primary" type="submit">Save</Button>{' '}
                    <Button color="secondary" tag={Link} to="/properties">Cancel</Button>
                </FormGroup>
            </Form>
        </div>
        </>
    );
}

export default TenantEdit;