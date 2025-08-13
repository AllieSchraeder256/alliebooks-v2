import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import LeaseCard from '../lease/LeaseCard';
import ImageModal from '../components/ImageModal';

const RentPaymentTable = ({rentPayments, hideColumns}) => {

    const rentPaymentList = rentPayments && rentPayments.map && rentPayments.map(payment => {
         return <tr key={payment.id}>
            { hideColumns && hideColumns.includes('tenantName') ? '' : <td >{payment.lease.tenantList}</td> }
            { hideColumns && hideColumns.includes('property') ? '' : <td>{payment.lease.unit.property.name} - {payment.lease.unit.name}</td> }
            <td>{payment.amount}</td>
            <td>{payment.receivedOn}</td>
            <td>{payment.dueOn}</td>
            <td>{payment.note}</td>
            <td>{payment.hasImage ? <ImageModal resourceId={payment.id}/> : '' }</td>
            { hideColumns && hideColumns.includes('edit') ? '' :
                <td>
                    <Button size="sm" style={{paddingTop: '0px'}} color="link" tag={Link} to={"/rent-payments/" + payment.id}>Edit</Button>
                </td>
            }
        </tr>
    });

    return (
        <>
        <Table className="mt-4">
            <thead>
                <tr>
                    { hideColumns && hideColumns.includes('tenantName') ? '' : <th>Name</th> }
                    { hideColumns && hideColumns.includes('property') ? '' : <th>Property</th>}
                    <th>Amount</th>
                    <th>Received On</th>
                    <th>Due On</th>
                    <th>Notes</th>
                    <th>Image</th>
                    { hideColumns && hideColumns.includes('edit') ? '' : <th>Edit</th> }
                </tr>
            </thead>
            <tbody>{rentPaymentList}</tbody>
        </Table>
        </>
    );
}

export default RentPaymentTable;