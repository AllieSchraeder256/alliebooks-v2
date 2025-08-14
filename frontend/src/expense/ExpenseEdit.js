import React, { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, Row, Col } from 'reactstrap';
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import moment from 'moment';

const emptyExpense = {
    amount: 0,
    paidOn: moment().format('yyyy-MM-DD'),
    merchant: '',
    note: '',
    propertyId: null,
    expenseTypeId: null
};

const ExpenseEdit = () => {
    const id = useParams().id || 'new';
    const [expense, setExpense] = useState(emptyExpense);
    const [expenseTypes, setExpenseTypes] = useState([]);
    const [properties, setProperties] = useState([]);
    const [updatedImageFile, setUpdatedImageFile] = useState(null);
    const [image, setImage] = useState(null);

    const animatedComponents = makeAnimated();
    const navigate = useNavigate();

    const title = <h2>{id != 'new' ? 'Edit Expense' : 'Add Expense'}</h2>;

    useEffect(() => {
        console.log('expense useEffect called with id:', id);
        if (id != 'new') {
            loadExpense(id);
            loadImage(id);
        }
        loadExpenseTypes();
        loadProperties();
    }, []);

    const loadExpense = async (id) => {
        const expense = await (await fetch(`/expenses/${id}`)).json();
        setExpense(expense);
    }
    const loadImage = async (id) => {
        const imageData = await (await fetch(`/images?resourceId=${id}`)).json();
        setImage(imageData);
    }
    const loadExpenseTypes = async () => {
        const expenseTypes = await (await fetch(`/expense-types`)).json();
        setExpenseTypes(expenseTypes);
    }

    const loadProperties = async () => {
        const properties = await (await fetch(`/properties`)).json();
        setProperties(properties);
    }
    const propertyOptions = properties && properties.map(property => {
        return { value: property.id, label: property.name };
    });
    const expenseTypeOptions = expenseTypes && expenseTypes.map(expenseType => {
        return { value: expenseType.id, label: expenseType.name };
    });

    function setSelectedProperty(choice) {
        expense.propertyId = choice ? choice.value : '';
        setExpense({...expense});
    }
    function setSelectedType(choice) {
        expense.expenseTypeId = choice ? choice.value : '';
        setExpense({...expense});
    }

    function handleSubmit(event) {
        event.preventDefault();
        saveExpense();
    }

    function handleChange(event) {
        const { name, value } = event.target;
        expense[name] = value;
        setExpense({...expense});
    }

    function handleFileChange(event) {
        setImage(null);
        setUpdatedImageFile(event.target.files[0]);
    }

    async function saveExpense() {
        const formData = new FormData();
        formData.append("expense", new Blob([JSON.stringify(expense)], { type: "application/json" }));
        formData.append("imageFile", updatedImageFile);

        await fetch('/expenses' + (expense.id ? '/' + expense.id : ''), {
            method: (expense.id) ? 'PUT' : 'POST',
            body: formData,
        }).then(() => {
            const date = moment(expense.paidOn).startOf('month').format('yyyy-MM-DD');
            navigate(`/expenses?startDate=${encodeURIComponent(date)}`, { replace: true });
        });
    }

    async function remove(id) {
        await fetch(`/expenses/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            navigate('/expenses', { replace: true });
        });
    }

    return (
        <>
        <div>
            <Container breakpoint="md">
                {title}
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="amount">Amount</Label>
                                <Input type="number" name="amount" id="amount" value={expense.amount || ''} onChange={handleChange} />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="paidOn">Paid On</Label>
                                <Input type="date" name="paidOn" id="paidOn" value={expense.paidOn || ''} onChange={handleChange} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label for="merchant">Merchant</Label>
                                <Input type="text" name="merchant" id="merchant" value={expense.merchant || ''} onChange={handleChange} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label for="note">Note</Label>
                                <Input type="text" name="note" id="note" value = {expense.note || ''} onChange={handleChange} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                         <Col md={6}>
                             <FormGroup>
                                 <Label for="propertySelect">Property</Label>
                                 <Select
                                     id = "propertySelect"
                                     options={propertyOptions}
                                     components={animatedComponents}
                                     onChange={choice => setSelectedProperty(choice)}
                                     value = {propertyOptions ? propertyOptions.find(option => option.value === expense.propertyId) : null}
                                     placeholder="Property"
                                     backspaceRemovesValue
                                     isClearable />
                             </FormGroup>
                         </Col>
                         <Col md={6}>
                             <FormGroup>
                                 <Label for="expenseTypeSelect">Expense Type</Label>
                                      <Select
                                          id = "expenseTypeSelect"
                                          options={expenseTypeOptions}
                                          components={animatedComponents}
                                          onChange={choice => setSelectedType(choice)}
                                          value = {expenseTypeOptions ? expenseTypeOptions.find(option => option.value === expense.expenseTypeId) : null}
                                          placeholder="Expense Type"
                                          backspaceRemovesValue
                                          isClearable />
                             </FormGroup>
                         </Col>
                     </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label for="imagePath">File</Label>
                                <Input
                                    id="imagePath"
                                    name="imagePath"
                                    type="file"
                                    onChange={handleFileChange} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>{' '}
                        <Button color="secondary" tag={Link} to="/">Cancel</Button>
                    </FormGroup>
                    <Row>
                        {updatedImageFile && <img src={URL.createObjectURL(updatedImageFile)} alt="Image preview" />}
                        {image && <img src={`data:image/jpeg;base64,${image.data}`} alt="Image preview" />}
                    </Row>
                </Form>
            </Container>
        </div>
        </>
    );
}

export default ExpenseEdit;