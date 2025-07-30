import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import TenantCard from './TenantCard';

const TenantList = () => {

const [tenants, setTenants] = useState('');

    useEffect(() => {
        loadTenants();
    }, []);

    const loadTenants = async () => {
        const tenants = await (await fetch(`/tenants`)).json();
        setTenants(tenants);
    }

    return (
        <>
        placeholder
        </>
    );
}

export default TenantList;