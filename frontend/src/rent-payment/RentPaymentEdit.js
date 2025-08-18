import React, { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, Row, Col } from 'reactstrap';
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import moment from 'moment';
import ImageUploadModal from '../components/ImageUploadModal';

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
        if (rentPayment.hasImage) {
            loadImage(id);
        }
    }
    const loadImage = async (id) => {
        try {
            const imageData = await (await fetch(`/images?resourceId=${id}`)).json();
            setImage(imageData);
        } catch (error) {
            console.log(error);
        }
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
            const date = moment(rentPayment.dueOn).startOf('month').format('yyyy-MM-DD');
            navigate(`/rent-payments?startDate=${encodeURIComponent(date)}`, { replace: true });
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
                        <Col md={4}>
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
                            <FormGroup>
                                <Label for="amount">Rent Amount</Label>
                                <Input type="number" name="amount" id="amount" value={rentPayment.amount || ''} onChange={handleChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="note">Note</Label>
                                <Input type="text" name="note" id="note" value = {rentPayment.note || ''} onChange={handleChange} />
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="receivedOn">Received On</Label>
                                <Input type="date" name="receivedOn" id="receivedOn" value={rentPayment.receivedOn || ''} onChange={handleChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="dueOn">Due On</Label>
                                <Input type="date" name="dueOn" id="dueOn" value={rentPayment.dueOn || ''} onChange={handleChange} />
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            {updatedImageFile ?
                                <img style={{objectFit: 'cover', maxHeight:'800px', maxWidth:'100%'}} src={URL.createObjectURL(updatedImageFile)} alt="Image preview" />
                                : image && <img style={{objectFit: 'cover', maxHeight:'100vh', maxWidth:'100%'}}  src={`data:image/jpeg;base64,${image.data}`} alt="Image preview" />
                            }
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Input
                                    id="imagePath"
                                    name="imagePath"
                                    type="file"
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange} />
                            </FormGroup>
                            <ImageUploadModal
                                from = "rentPaymentEdit"
                                onImageSelected={file => {setUpdatedImageFile(file);}}
                            />
                        </Col>
                    </Row>
                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>{' '}
                        <Button color="secondary" tag={Link} to="/">Cancel</Button>
                    </FormGroup>

                </Form>
            </Container>
        </div>
        </>
    );
}

export default RentPaymentEdit;