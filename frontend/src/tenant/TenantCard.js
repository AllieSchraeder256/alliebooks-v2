import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Table } from 'reactstrap';
import { Link } from 'react-router-dom';

const TenantCard = (inTenant) => {
    const [tenant, setTenant] = useState(inTenant.tenant); //I don't know why this is necessary

    return (
        <>
        <div key={tenant.id} className="card">
            <div class="card-body">
                <h5 class="card-title">{tenant.firstName} {tenant.lastName}</h5>


            </div>
        </div>
        </>
    );
}

export default TenantCard;