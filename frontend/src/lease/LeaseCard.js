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
import RentPaymentTable from '../rent-payment/RentPaymentTable';

const LeaseCard = ({lease}) => {
    const [rentPayments, setRentPayments] = useState([]);
    const [accordionOpen, setAccordionOpen] = useState('');
    const toggle = (id) => {
        if (accordionOpen === id) {
            setAccordionOpen();
        } else {
            setAccordionOpen(id);
        }
    };

    useEffect(() => {
        loadRentPayments(lease.id);
    }, []);

    const loadRentPayments = async (leaseId) => {
        const payments = await (await fetch(`/rent-payments?leaseId=${leaseId}`)).json();
        setRentPayments(payments);
    }

    function LeaseInfoHeader({ balance, rent }) {
      return (
        <>
        <Container fluid className="ps-0 d-flex justify-content-between">
            <span>Rent: ${lease.rent}</span>
            <span>Tenants: {lease.tenantList}</span>
            { balance > 0 ?
                <span className="overdue-balance">OVERDUE BALANCE: ${lease.balance} </span>
                : <span/>
            }
        </Container>
         </>);
    }
    function RentPaymentHeader({ nextPaymentDueOn }) {
      return (
        <>
        <Container fluid className="ps-0 d-flex justify-content-between">
            <span>Rent Payments</span>
            <span className={moment(nextPaymentDueOn) < moment() ? "overdue-balance" : ""}>Payment Due: {nextPaymentDueOn ? moment(nextPaymentDueOn).format('MMM DD YYYY') : 'N/A'}</span>
            <Button size="sm" color="primary" tag={Link} to={"/rent-payments/new?leaseId=" + lease.id}>New Payment</Button>

        </Container>
         </>);
    }

    return (
        <>
        <div key={lease.id} className="card">
            <div class="card-body">
                <div className="float-right">
                    <Button outline color="success" size="sm" tag={Link} to={"/leases/" + lease.id} >Edit</Button>
                </div>
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
                            <RentPaymentHeader nextPaymentDueOn = {lease.nextPaymentDueOn} />
                        </AccordionHeader>
                        <AccordionBody accordionId="2">
                            <RentPaymentTable
                                rentPayments={rentPayments}
                                hideColumns = {['tenantName', 'property']}/>
                        </AccordionBody>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
        </>
    );
}

export default LeaseCard;