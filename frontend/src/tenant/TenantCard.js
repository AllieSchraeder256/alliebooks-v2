import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Table } from 'reactstrap';
import { Link } from 'react-router-dom';

const TenantCard = (tenant) => {

    return (
        <>
        <div>
            <h3>{tenant.firstName} {tenant.lastName}</h3>
            { tenant.leaseId ?
                <p>Lease ID: {tenant.leaseId}</p> :
                <div>
                    <Button color="primary" tag={Link} to={`/tenants/${tenant.id}/leases/new`}>New Lease</Button>
                    <Button color="primary" tag={Link} to={`/tenants/${tenant.id}/leases/new`}>Add To Existing Lease</Button>
                </div>
            }

        </div>
        </>
    );
}

export default TenantCard;