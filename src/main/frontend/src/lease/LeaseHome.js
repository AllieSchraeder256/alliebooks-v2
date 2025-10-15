import React, { useEffect, useState } from 'react';
import { Button, Collapse } from 'reactstrap';
import { Link } from 'react-router-dom';
import LeaseCard from './LeaseCard';
import { apiFetch } from '../utils/api';

const LeaseHome = () => {

    const [leases, setLeases] = useState('');
    const [oldLeases, setOldLeases] = useState('');
    const [collapse, setCollapse] = useState(false);

    useEffect(() => {
        loadLeases();
        loadOldLeases();
    }, []);

    const loadLeases = async () => {
        const leases = await (await apiFetch(`/leases/current-leases`)).json();
        setLeases(leases);
    }
    const loadOldLeases = async () => {
        const oldLeases = await (await apiFetch(`/leases/old-leases`)).json();
        setOldLeases(oldLeases);
    }
    const toggle = () => setCollapse(!collapse);

    return (
        <>
        <div className="d-flex justify-content-between align-items-center mb-2">
            <h3 className="mb-0">Current Leases ({leases.length})</h3>
            <Button color="success" tag={Link} to="/leases/new">New Lease</Button>
        </div>
        { leases && leases.map && leases.map(lease => {
            return <LeaseCard key={lease.id} lease={lease} />
        }) }
        <div className="d-flex align-items-center mb-2">
            <h3>Old Leases ({oldLeases.length})</h3>
            <Button color="link" onClick={toggle}>{collapse ? "Hide" : "Show"}</Button>
        </div>
        <Collapse isOpen={collapse}>
            { oldLeases && oldLeases.map && oldLeases.map(oldLease => {
                return <LeaseCard key={oldLease.id} lease={oldLease} />
            }) }
        </Collapse>
        </>
    );
}

export default LeaseHome;