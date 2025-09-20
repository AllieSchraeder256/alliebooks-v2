import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import { apiFetch } from '../utils/api';
import Select from 'react-select'
import makeAnimated from 'react-select/animated';

const emptyOcrToken = {
    regex: '',
    merchant: '',
    expenseTypeId: null
};

const OcrTokenEdit = () => {
    const id = useParams().id || 'new';
    const [ocrToken, setOcrToken] = useState(emptyOcrToken);
    const [expenseTypes, setExpenseTypes] = useState([]);
    const navigate = useNavigate();
    const animatedComponents = makeAnimated();
    const title = <h2>{ocrToken.id ? 'Edit OCR Token' : 'Add OCR Token'}</h2>;

    useEffect(() => {
        loadOcrToken(id);
    }, [id]);

    const loadOcrToken = async (id) => {
        if (id !== 'new') {
            const ocrToken = await (await apiFetch(`/ocr-tokens/${id}`)).json();
            setOcrToken(ocrToken);
        } else {
            setOcrToken(emptyOcrToken);
        }
        loadExpenseTypes();
    }

    const loadExpenseTypes = async () => {
        const expenseTypes = await (await apiFetch(`/expense-types`)).json();
        setExpenseTypes(expenseTypes);
    }
    const expenseTypeOptions = expenseTypes && expenseTypes.map(expenseType => {
        return { value: expenseType.id, label: expenseType.name };
    });

    function setSelectedType(choice) {
        ocrToken.expenseTypeId = choice ? choice.value : '';
        setOcrToken({...ocrToken});
    }

    function handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        ocrToken[name] = value;
        setOcrToken({...ocrToken});
    }

    function handleSubmit(event) {
        event.preventDefault();
        saveOcrToken();
    }

    async function saveOcrToken() {
        await apiFetch('/ocr-tokens' + (ocrToken.id ? '/' + ocrToken.id : ''), {
            method: (ocrToken.id) ? 'PUT' : 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ocrToken),
        }).then(() => {
            navigate('/ocr-tokens', { replace: true });
        });
    }


    return (
        <>
        <div>
            <Container breakpoint="md">
                {title}
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="regex">Regex</Label>
                        <Input type="text" name="regex" id="regex" style={{fontFamily: 'monospace'}} value={ocrToken.regex || ''} onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="merchant">Merchant</Label>
                        <Input type="text" name="merchant" id="merchant" value={ocrToken.merchant || ''} onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                         <Label for="expenseTypeSelect">Expense Type</Label>
                              <Select
                                  id = "expenseTypeSelect"
                                  options={expenseTypeOptions}
                                  components={animatedComponents}
                                  onChange={choice => setSelectedType(choice)}
                                  value = {expenseTypeOptions ? expenseTypeOptions.find(option => option.value === ocrToken.expenseTypeId) : null}
                                  placeholder="Expense Type"
                                  backspaceRemovesValue
                                  isClearable />
                    </FormGroup>
                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>{' '}
                        <Button color="secondary" tag={Link} to="/admin#ocr-tokens">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
        </>
    );
}

export default OcrTokenEdit;