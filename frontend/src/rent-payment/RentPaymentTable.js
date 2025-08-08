import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import LeaseCard from '../lease/LeaseCard';

const RentPaymentTable = ({rentPayments}) => {

    const rentPaymentList = rentPayments && rentPayments.map && rentPayments.map(payment => {
         return <tr key={payment.id}>
            <td style={{whiteSpace: 'nowrap'}}>tenantname</td>
            <td style={{whiteSpace: 'nowrap'}}>{payment.lease.unit.property.name} - {payment.lease.unit.name}</td>
            <td style={{whiteSpace: 'nowrap'}}>{payment.amount}</td>
            <td style={{whiteSpace: 'nowrap'}}>{payment.paidOn}</td>
            <td style={{whiteSpace: 'nowrap'}}>{payment.dueOn}</td>
            <td style={{whiteSpace: 'nowrap'}}>{payment.note}</td>
        </tr>
    });

    return (
        <>
        <Table className="mt-4">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Property</th>
                    <th>Amount</th>
                    <th>Paid On</th>
                    <th>Due On</th>
                    <th>Notes</th>
                </tr>
            </thead>
            <tbody>
                {rentPaymentList}
            </tbody>
        </Table>
        </>
    );
}

export default RentPaymentTable;