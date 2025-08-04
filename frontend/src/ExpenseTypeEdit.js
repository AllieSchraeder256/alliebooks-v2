import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';

const emptyExpenseType = {
    name: ''
};

const ExpenseTypeEdit = () => {
    const id = useParams().id || 'new';
    const [expenseType, setExpenseType] = useState(emptyExpenseType);
    const navigate = useNavigate();
    const title = <h2>{expenseType.id ? 'Edit Expense Type' : 'Add Expense Type'}</h2>;

    useEffect(() => {
        loadExpenseType(id);
    }, []);

    const loadExpenseType = async (id) => {
        if (id !== 'new') {
            const expenseType = await (await fetch(`/expense-types/${id}`)).json();
            setExpenseType(expenseType);
        } else {
            setExpenseType(emptyExpenseType);
        }
    }

    function handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        expenseType[name] = value;
        setExpenseType({...expenseType});
    }

    function handleSubmit(event) {
        event.preventDefault();
        saveExpenseType();
    }

    async function saveExpenseType() {
        await fetch('/expense-types' + (expenseType.id ? '/' + expenseType.id : ''), {
            method: (expenseType.id) ? 'PUT' : 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(expenseType),
        }).then(() => {
            navigate('/expense-types', { replace: true });
        });
    }


    return (
        <>
        <div>
            <Container breakpoint="md">
                {title}
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="name">Name</Label>
                        <Input type="text" name="name" id="name" value={expenseType.name || ''}
                               onChange={handleChange} autoComplete="name"/>
                    </FormGroup>
                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>{' '}
                        <Button color="secondary" tag={Link} to="/expense-types">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
        </>
    );
}

export default ExpenseTypeEdit;