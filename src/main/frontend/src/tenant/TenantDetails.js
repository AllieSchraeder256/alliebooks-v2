import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button, ButtonGroup, Row, Col } from 'reactstrap';
import LeaseCard from '../lease/LeaseCard';
import HelpText from '../components/HelpText';
import Notes from '../components/Notes';
import { apiFetch } from '../utils/api';

const TenantDetails = () => {
    const id = useParams().id;
    const [tenant, setTenant] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        loadTenant(id);
    });

    const loadTenant = async (id) => {
        const tenant = await (await apiFetch(`/tenants/${id}`)).json();
        setTenant(tenant);
    }

    async function remove(id) {
        await apiFetch(`/tenants/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            navigate('/tenants', { replace: true });
        });
    }

    return (
        <>
        <div >
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h3 className="mb-0">{tenant.firstName} {tenant.lastName}</h3>
                <ButtonGroup>
                    <Button size="sm" color="primary" tag={Link} to={"/tenants/edit/" + tenant.id}>Edit</Button>
                    <Button size="sm" disabled={tenant.tenantLeases && tenant.tenantLeases.length > 0} color="danger" onClick={() => remove(tenant.id)}>Delete</Button>
                </ButtonGroup>
            </div>
            {tenant.tenantLeases && tenant.tenantLeases.length > 0 &&
                <HelpText text="Cannot delete tenants with leases. Delete the leases first." />
            }
            <Row>
                <Col md={3}>
                    Email: {tenant.email}<br />
                </Col>
                <Col md={5}>
                    <Notes tenantId={tenant.id} initialNotes={tenant.notes} />
                </Col>
            </Row>
            <h5>Current Leases</h5>
            { tenant.tenantLeases && tenant.tenantLeases.map && tenant.tenantLeases.map(tenantLease => {
                if (tenantLease.lease.current) {
                    return <LeaseCard lease={tenantLease.lease} />
                }
            }) }
            <h5>Old Leases</h5>
            { tenant.tenantLeases && tenant.tenantLeases.map && tenant.tenantLeases.map(tenantLease => {
                if (!tenantLease.lease.current) {
                    return <LeaseCard lease={tenantLease.lease} />
                }
            }) }
        </div>
        </>
    );
}

export default TenantDetails;