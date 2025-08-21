import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import LeaseCard from '../lease/LeaseCard';
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
    async function remove(id) {
        await apiFetch(`/tenants/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            let updatedTenants = [...tenants].filter(i => i.id !== id);
            setTenants(props => ({...props, tenants: updatedTenants}));
        });
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
        <div className="float-right">
            <Button color="success" tag={Link} to="/tenants/edit/new">Add</Button>
        </div>
        <h3>Tenants</h3>
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