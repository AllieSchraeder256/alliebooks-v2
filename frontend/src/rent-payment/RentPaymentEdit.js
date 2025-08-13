import React, { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, Row, Col } from 'reactstrap';
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import moment from 'moment';

const emptyPayment = {
    amount: 0,
    receivedOn: moment().format('yyyy-MM-DD'),
    dueOn: null,
    note: null,
    leaseId: null
};

const RentPaymentEdit = () => {
    const id = useParams().id || 'new';
    const [searchParams, setSearchParams] = useSearchParams();
    const [rentPayment, setRentPayment] = useState(emptyPayment);
    const [lease, setLease] = useState(null);
    const [updatedImageFile, setUpdatedImageFile] = useState(null);
    const [image, setImage] = useState(null);
    const [currentLeaseSummary, setCurrentLeaseSummary] = useState([]);
//todo make current lease summary a parameter
    const animatedComponents = makeAnimated();
    const navigate = useNavigate();

    const leaseId = searchParams.get('leaseId');
    const title = <h2>{id != 'new' ? 'Edit Rent Payment' : 'Add Rent Payment'}</h2>;

    useEffect(() => {
    console.log('useEffect called with id:', id);
        if (id != 'new') {
            loadRentPayment(id);
            loadImage(id);
        }
        if (leaseId) {
            loadLease(leaseId);
        }
        if (currentLeaseSummary.length === 0) {
            loadCurrentLeaseSummary();
        }
    }, []);

    const loadRentPayment = async (id) => {
        const rentPayment = await (await fetch(`/rent-payments/${id}`)).json();
        setRentPayment(rentPayment);
    }
    const loadImage = async (id) => {
        const imageData = await (await fetch(`/images?resourceId=${id}`)).json();
        setImage(imageData);

    }

    const loadLease = async (id) => {
        const lease = await (await fetch(`/leases/${id}`)).json();
        setLease(lease);
        rentPayment.leaseId = lease.id;
        rentPayment.amount = lease.rent;
        rentPayment.dueOn = lease.nextPaymentDueOn;
        setRentPayment({...rentPayment});
    }

    const loadCurrentLeaseSummary = async () => {
        const leaseSummary = await (await fetch('/leases/current-lease-summary')).json();
        setCurrentLeaseSummary(leaseSummary);
    }

    const currentLeaseOptions = currentLeaseSummary && currentLeaseSummary.map(leaseSummary => {
        return { value: leaseSummary.leaseId, label: leaseSummary.details };
    });

    function handleSubmit(event) {
        event.preventDefault();
        saveRentPayment();
    }

    function handleChange(event) {
    console.log('Input changed:', event.target.name, event.target.value);
        const { name, value } = event.target;
        rentPayment[name] = value;
        setRentPayment({...rentPayment});
    }

    function handleFileChange(event) {
        setImage(null);
        setUpdatedImageFile(event.target.files[0]);
    }

    function setSelectedLease(choice) {
        rentPayment.leaseId = choice ? choice.value : '';
        if (rentPayment.leaseId) {
            loadLease(rentPayment.leaseId);
        }
        setRentPayment({...rentPayment});
    }

    async function saveRentPayment() {
        const formData = new FormData();
        formData.append("rentPayment", new Blob([JSON.stringify(rentPayment)], { type: "application/json" }));
        formData.append("imageFile", updatedImageFile);

        await fetch('/rent-payments' + (rentPayment.id ? '/' + rentPayment.id : ''), {
            method: (rentPayment.id) ? 'PUT' : 'POST',
            body: formData,
        }).then(() => {
            navigate(`/rent-payments?startDate=${encodeURIComponent(rentPayment.dueOn)}`, { replace: true });//TODO redirect to month that the payment was due on
        });
    }

    async function remove(id) {
        await fetch(`/rent-payments/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            navigate('/rent-payments', { replace: true });
        });
    }

    return (
        <>
        <div>
            <Container breakpoint="md">
                {title}
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <FormGroup>
                            <Label for="leaseSelect">Lease</Label>
                            <Select
                                id = "leaseSelect"
                                options={currentLeaseOptions}
                                components={animatedComponents}
                                onChange={choice => setSelectedLease(choice)}
                                value = {currentLeaseOptions ? currentLeaseOptions.find(option => option.value === rentPayment.leaseId) : null}
                                placeholder="Lease"
                                backspaceRemovesValue
                                isClearable />
                        </FormGroup>
                    </Row>

                    <Row>
                        <Col md={3}>
                            <FormGroup>
                                <Label for="amount">Rent Amount</Label>
                                <Input type="number" name="amount" id="amount" value={rentPayment.amount || ''} onChange={handleChange} />
                            </FormGroup>
                        </Col>

                    </Row>
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="receivedOn">Received On</Label>
                                <Input type="date" name="receivedOn" id="receivedOn" value={rentPayment.receivedOn || ''} onChange={handleChange} />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="dueOn">Due On</Label>
                                <Input type="date" name="dueOn" id="dueOn" value={rentPayment.dueOn || ''} onChange={handleChange} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label for="note">Note</Label>
                                <Input type="text" name="note" id="note" value = {rentPayment.note || ''} onChange={handleChange} />
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

export default RentPaymentEdit;