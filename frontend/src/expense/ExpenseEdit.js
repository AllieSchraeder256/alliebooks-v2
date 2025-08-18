import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, Row, Col } from 'reactstrap';
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import moment from 'moment';
import HelpText from '../components/HelpText';
import ImageUploadModal from '../components/ImageUploadModal';

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
    const [imageIsProcessing, setImageIsProcessing] = useState(false);
    const [receiptData, setReceiptData] = useState('');

    const animatedComponents = makeAnimated();
    const navigate = useNavigate();
    const location = useLocation();
    const imageProcessedRef = useRef(false);

    const title = <h2>{id != 'new' ? 'Edit Expense' : 'Add Expense'}</h2>;

    useEffect(() => {
        console.log('expense useEffect called with id:', id);
        if (id != 'new') {
            loadExpense(id);
        } else if (
            location.state &&
            location.state.imageFile &&
            !imageProcessedRef.current
        ) {
            setUpdatedImageFile(location.state.imageFile);
            processImage(location.state.imageFile);
            imageProcessedRef.current = true;
        }

        loadExpenseTypes();
        loadProperties();
    }, [location.state]);

    const loadExpense = async (id) => {
        const expense = await (await fetch(`/expenses/${id}`)).json();
        setExpense(expense);

        if (expense.hasImage) {
            console.log('Loading image for expense with id:', id);
            const imageData = await (await fetch(`/images?resourceId=${id}`)).json();
            setImage(imageData);
        }
    }
    const loadExpenseTypes = async () => {
        const expenseTypes = await (await fetch(`/expense-types`)).json();
        setExpenseTypes(expenseTypes);
    }

    const loadProperties = async () => {
        const properties = await (await fetch(`/properties`)).json();
        setProperties(properties);
    }
    const processImage = async (file) => {
        setImageIsProcessing(true);
        const formData = new FormData();
        formData.append("file", file);

        const response = await(await fetch('/images/ocr', {
            method: 'POST',
            body: formData,
        })).json();

        if (response.amount) {
            expense.amount = response.amount;
        }
        if (response.date) {
            console.log('Processing paidOn date:', response.date);
            expense.paidOn = moment(response.date).format('yyyy-MM-DD');
        }
        if (response.merchant) {
            expense.merchant = response.merchant;
        }
        setReceiptData(response);
        setExpense({...expense});
        setImageIsProcessing(false);
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

        processImage(event.target.files[0]);
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
                        <Col md={4}>
                            <FormGroup>
                                <Label for="amount">Amount</Label>
                                <Input type="number" name="amount" id="amount" value={expense.amount || ''} onChange={handleChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="paidOn">Paid On</Label>
                                <Input type="date" name="paidOn" id="paidOn" value={expense.paidOn || ''} onChange={handleChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="merchant">Merchant</Label>
                                <Input type="text" name="merchant" id="merchant" value={expense.merchant || ''} onChange={handleChange} />
                            </FormGroup>
                            <FormGroup>
                                <ImageUploadModal
                                    from = "expenseEdit"
                                    onImageSelected={file => {
                                        setUpdatedImageFile(file);
                                        processImage(file);
                                }}/>
                                {imageIsProcessing && <HelpText text="Processing image, please wait..." />}
                                <Input
                                    id="imagePath"
                                    name="imagePath"
                                    type="file"
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange} />
                            </FormGroup>
                            <br/>
                            <FormGroup>
                                <Button color="primary" type="submit">Save</Button>{' '}
                                <Button color="secondary" tag={Link} to="/">Cancel</Button>
                            </FormGroup>
                        </Col>
                        <Col md={4}>
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
                            <FormGroup>
                                <Label for="note">Note</Label>
                                <Input type="text" name="note" id="note" value = {expense.note || ''} onChange={handleChange} />
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            {updatedImageFile ?
                                <img style={{objectFit: 'cover', maxHeight:'800px', maxWidth:'100%'}} src={URL.createObjectURL(updatedImageFile)} alt="Image preview" />
                                : image && <img style={{objectFit: 'cover', maxHeight:'100vh', maxWidth:'100%'}}  src={`data:image/jpeg;base64,${image.data}`} alt="Image preview" />
                            }
                        </Col>
                    </Row>
                </Form>
            </Container>
        </div>
        </>
    );
}

export default ExpenseEdit;