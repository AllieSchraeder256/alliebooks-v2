import React, { useEffect, useState } from 'react';
import { Button, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';

const TenantList = () => {

const [tenants, setTenants] = useState('');

    useEffect(() => {
        loadTenants();
    }, []);

    const loadTenants = async () => {
        const tenants = await (await apiFetch(`/tenants`)).json();
        setTenants(tenants);
    }

    const tenantList = tenants && tenants.map && tenants.map(tenant => {
        return <tr key={tenant.id}>
            <td>{tenant.firstName} {tenant.lastName}</td>
            <td>{tenant.email}</td>
            <td>{tenant.hasCurrentLease ? "Yes" : "No"}</td>
            <td>{tenant.tenantLeases.length}</td>
            <td>
                <Button size="sm" style={{paddingTop: '0px'}} color="link" tag={Link} to={"/tenants/" + tenant.id}>Details</Button>
            </td>
        </tr>
    });

    return (
        <>
        <div className="d-flex justify-content-between align-items-center mb-2">
            <h3 className="mb-0">Tenants</h3>
            <Button color="success" tag={Link} to="/tenants/edit/new">Add</Button>
        </div>
        <Table hover>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Is Current</th>
                    <th>Leases</th>
                    <th>Actions</th>
                </tr>
            </thead>
            {tenants && tenants.map &&
            <tbody>
                {tenantList}
            </tbody>}
        </Table>
        </>
    );
}

export default TenantList;