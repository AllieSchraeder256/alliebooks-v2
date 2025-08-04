import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import LeaseCard from '../lease/LeaseCard';

const TenantList = () => {

const [tenants, setTenants] = useState('');

    useEffect(() => {
        loadTenants();
    }, []);

    const loadTenants = async () => {
        const tenants = await (await fetch(`/tenants`)).json();
        setTenants(tenants);
    }
    async function remove(id) {
        await fetch(`/tenants/${id}`, {
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
            <td style={{whiteSpace: 'nowrap'}}>{tenant.firstName} {tenant.lastName}</td>
            <td style={{whiteSpace: 'nowrap'}}>{tenant.email}</td>
            <td style={{whiteSpace: 'nowrap'}}>{tenant.hasCurrentLease ? "Yes" : "No"}</td>
            <td style={{whiteSpace: 'nowrap'}}>{tenant.tenantLeases.length}</td>
            <td>
                <Button size="sm" color="primary" tag={Link} to={"/tenants/" + tenant.id}>Go</Button>
            </td>
        </tr>
    });

    return (
        <>
        <div className="float-right">
            <Button color="success" tag={Link} to="/tenants/edit/new">Add</Button>
        </div>
        <h3>Tenants</h3>
        <Table className="mt-4">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Is Current</th>
                    <th>Leases</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {tenantList}
            </tbody>
        </Table>
        </>
    );
}

export default TenantList;