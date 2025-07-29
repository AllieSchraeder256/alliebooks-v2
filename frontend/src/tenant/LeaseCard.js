import React, { useEffect, useState } from 'react';
import {
    Button,
    ButtonGroup,
    Table,
    Accordion,
    AccordionBody,
    AccordionHeader,
    AccordionItem,
    Container
} from 'reactstrap';
import { Link } from 'react-router-dom';
import moment from 'moment';

const LeaseCard = (inLease) => {
    const [lease, setLease] = useState(inLease.lease); //I don't know why this is necessary
    const [accordionOpen, setAccordionOpen] = useState('');
    const toggle = (id) => {
        if (accordionOpen === id) {
            setAccordionOpen();
        } else {
            setAccordionOpen(id);
        }
    };

    const tenantList = lease.tenantLeases && lease.tenantLeases.map(tenantLease => {
        return <span key={tenantLease.id}>
            {tenantLease.tenant.firstName} {tenantLease.tenant.lastName}
            {lease.tenantLeases && lease.tenantLeases.indexOf(tenantLease) < lease.tenantLeases.length - 1 ? ', ' : ''}
        </span>
    });

    function LeaseInfoHeader({ balance, rent }) {
      return (
        <>
        <Container fluid className="ps-0 d-flex justify-content-between">
            <span>Rent: ${lease.rent} - Tenants: {tenantList}</span>
            { balance > 0 &&
                <span className="overdue-balance">OVERDUE BALANCE: ${lease.balance} </span>
            }
        </Container>
         </>);
    }

    return (
        <>
        <div key={lease.id} className="card">
            <div class="card-body">
                <h5 class="card-title">{lease.unit.property.name} - {lease.unit.name}</h5>
                <Accordion flush open={accordionOpen} toggle={toggle} style={{padding: '0px'}}>
                    <AccordionItem>
                        <AccordionHeader targetId="1">
                            <LeaseInfoHeader
                                balance={lease.balance}
                                rent={lease.rent}/>
                        </AccordionHeader>
                        <AccordionBody accordionId="1">
                            <p>Lease Term: {moment(lease.startDate).format('MMM DD YYYY')} {lease.endDate ? " to " +moment(lease.endDate).format('MMM DD YYYY') : " (month to month)"}</p>
                            <p>Deposit: ${lease.deposit}</p>
                            <p>Deposit Paid: { moment(lease.depositPaidDate).format('MMM DD YYYY')}</p>
                        </AccordionBody>
                    </AccordionItem>
                    <AccordionItem>
                        <AccordionHeader targetId="2">
                            <Container fluid className="ps-0 d-flex justify-content-between">
                                <span>Rent Payments</span>
                                <Button size="sm" color="primary" tag={Link} to={"/rent-payments/" + lease.id}>New Payment</Button>
                            </Container>

                        </AccordionHeader>
                        <AccordionBody accordionId="2">
                            <p>test</p>
                        </AccordionBody>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
        </>
    );
}

export default LeaseCard;