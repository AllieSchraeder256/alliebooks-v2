import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import LeaseCard from './LeaseCard';

const LeaseHome = () => {

const [leases, setLeases] = useState('');
const [oldLeases, setOldLeases] = useState('');

    useEffect(() => {
        loadLeases();
        loadOldLeases();
    }, []);

    const loadLeases = async () => {
        const leases = await (await fetch(`/leases/current-leases`)).json();
        setLeases(leases);
    }
    const loadOldLeases = async () => {
        const oldLeases = await (await fetch(`/leases/old-leases`)).json();
        setOldLeases(oldLeases);
    }

    return (
        <>
        <div className="float-right">
            <Button color="success" tag={Link} to="/leases/new">Add</Button>
        </div>
        <h3>Current Leases</h3>
        { leases && leases.map && leases.map(lease => {
            return <LeaseCard lease={lease} />
        }) }

        <h3>Old Leases</h3>
        { oldLeases && oldLeases.map && oldLeases.map(oldLease => {
            return <LeaseCard lease={oldLease} />
        }) }
        </>
    );
}

export default LeaseHome;