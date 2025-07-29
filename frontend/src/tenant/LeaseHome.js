import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import LeaseCard from './LeaseCard';
import TenantCard from './TenantCard';

const TenantHome = () => {

const [leases, setLeases] = useState('');
const [allTenants, setAllTenants] = useState('');

    useEffect(() => {
        loadLeases();
        loadTenants();
    }, []);

    const loadLeases = async () => {
        const leases = await (await fetch(`/leases/current-leases`)).json();
        setLeases(leases);
    }

    const loadTenants = async () => {
        const tenants = await (await fetch(`/tenants`)).json();
        setAllTenants(tenants);
    }

    return (
        <>
        <div className="float-right">
            <Button color="success" tag={Link} to="/leases/new">Add</Button>
        </div>
        <h3>Leases</h3>
        { leases && leases.map && leases.map(lease => {
            return <LeaseCard lease={lease} />
        }) }
        <div className="float-right">
            <Button color="success" tag={Link} to="/tenants/new">Add</Button>
        </div>
        <h3>All Tenants</h3>
        { allTenants && allTenants.map && allTenants.map(tenant => {
            return <TenantCard tenant={tenant} />
        }) }
        </>
    );
}

export default TenantHome;