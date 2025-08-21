import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import { apiFetch } from './utils/api';

const ExpenseTypeList = () => {

const [expenseTypes, setExpenseTypes] = useState('');

    useEffect(() => {
        loadExpenseTypes();
    }, []);

    const loadExpenseTypes = async () => {
        const expenseTypes = await (await apiFetch(`/expense-types`)).json();
        setExpenseTypes(expenseTypes);
    }

    async function remove(id) {
        await fetch(`/expense-types/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            let updatedExpenseTypes = [...expenseTypes].filter(i => i.id !== id);
            setExpenseTypes(props => ({...props, expenseTypes: updatedExpenseTypes}));
        });
    }

    const expenseTypeList = expenseTypes && expenseTypes.map && expenseTypes.map(expenseType => {
        return <tr key={expenseType.id}>
            <td>{expenseType.name}</td>
            <td>
                <ButtonGroup>
                    <Button size="sm" color="primary" tag={Link} to={"/expense-types/" + expenseType.id}>Edit</Button>
                    <Button size="sm" color="danger" onClick={() => remove(expenseType.id)}>Delete</Button>
                </ButtonGroup>
            </td>
        </tr>
    });

    return (
        <>
        <div className="float-right">
            <Button color="success" tag={Link} to="/expense-types/new">New Type</Button>
        </div>
        <h3>Expense Types</h3>
        <Table hover>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Action</th>
                </tr>
            </thead>
            {expenseTypes && expenseTypes.map &&
                <tbody>
                    {expenseTypeList}
                </tbody>
            }
        </Table>
        </>
    );
}

export default ExpenseTypeList;