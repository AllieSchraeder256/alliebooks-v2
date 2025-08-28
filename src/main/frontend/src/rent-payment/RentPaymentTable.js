import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import LeaseCard from '../lease/LeaseCard';
import ImageViewModal from '../components/ImageViewModal';

const RentPaymentTable = ({rentPayments, hideColumns}) => {

    const rentPaymentList = rentPayments && rentPayments.map && rentPayments.map(payment => {
         return <tr key={payment.id}>
            { hideColumns && hideColumns.includes('tenantName') ? null : <td >{payment.lease.tenantList}</td> }
            { hideColumns && hideColumns.includes('property') ? null : <td>{payment.lease.unit.property.name} - {payment.lease.unit.name}</td> }
            <td>{payment.amount}</td>
            <td>{payment.receivedOn}</td>
            <td>{payment.dueOn}</td>
            <td>{payment.note}</td>
            <td>{payment.hasImage ? <ImageViewModal resourceId={payment.id}/> : null }</td>
            { hideColumns && hideColumns.includes('edit') ? null :
                <td>
                    <Button size="sm" style={{paddingTop: '0px'}} color="link" tag={Link} to={"/rent-payments/" + payment.id}>Edit</Button>
                </td>
            }
        </tr>
    });

    return (
        <>
        <Table responsive hover size="sm" >
            <thead>
                <tr>
                    { hideColumns && hideColumns.includes('tenantName') ?  null : <th>Name</th> }
                    { hideColumns && hideColumns.includes('property') ? null : <th>Property</th>}
                    <th>Amount</th>
                    <th>Received On</th>
                    <th>Due On</th>
                    <th>Notes</th>
                    <th>Image</th>
                    { hideColumns && hideColumns.includes('edit') ? null : <th>Edit</th> }
                </tr>
            </thead>
            {rentPayments && rentPayments.map &&
                <tbody>{rentPaymentList}</tbody>}
        </Table>
        </>
    );
}

export default RentPaymentTable;