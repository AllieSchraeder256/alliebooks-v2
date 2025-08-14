import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import ImageModal from '../components/ImageModal';

const ExpenseTable = ({expenses}) => {
    const expenseList = expenses && expenses.map && expenses.map(expense => {
         return <tr key={expense.id}>
            <td>{expense.amount}</td>
            <td>{expense.paidOn}</td>
            <td>{expense.merchant}</td>
            <td>{expense.note}</td>
            <td>{expense.property ? expense.property.name : 'N/A'}</td>
            <td>{expense.expenseType ? expense.expenseType.name : 'N/A'}</td>
            <td>{expense.hasImage ? <ImageModal resourceId={expense.id}/> : '' }</td>
            <td>
                <Button size="sm" style={{paddingTop: '0px'}} color="link" tag={Link} to={"/expenses/" + expense.id}>Edit</Button>
            </td>
        </tr>
    });

    return (
        <>
        <Table hover size="sm" className="mt-4">
            <thead>
                <tr>
                    <th>Amount</th>
                    <th>Paid On</th>
                    <th>Merchant</th>
                    <th>Note</th>
                    <th>Property</th>
                    <th>Type</th>
                    <th>Image</th>
                    <th>Edit</th>
                </tr>
            </thead>
            <tbody>{expenseList}</tbody>
        </Table>
        </>
    );
}

export default ExpenseTable;