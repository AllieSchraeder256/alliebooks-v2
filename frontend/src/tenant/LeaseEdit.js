import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, Row, Col } from 'reactstrap';
import Select from 'react-select'
import makeAnimated from 'react-select/animated';


const emptyLease = {
    rent: null,
    startDate: null,
    endDate: null,
    balance: 0,
    current: true,
    deposit: null,
    depositPaidDate: null,
    depositReturned: null,
    depositReturnDate: null,
    unitId: null,
    tenantIds: []
};

const LeaseEdit = () => {
    const id = useParams().id || 'new';
    const [lease, setLease] = useState(emptyLease);
    const [properties, setProperties] = useState([]);
    const [units, setUnits] = useState([]);
    const [tenants, setTenants] = useState([]);

    const animatedComponents = makeAnimated();
    const navigate = useNavigate();
    const title = <h2>{lease.id ? 'Edit Lease' : 'Add Lease'}</h2>;

    useEffect(() => {
        loadLease(id);
        loadProperties();
        loadTenants();
    }, []);

    const loadTenants = async () => {
        const tenants = await (await fetch(`/tenants`)).json();
        setTenants(tenants);
    }

    const loadLease = async (id) => {
        if (id !== 'new') {
            const lease = await (await fetch(`/leases/${id}`)).json();
            setLease(lease);
        } else {
            setLease(emptyLease);
        }
    }
    const loadProperties = async () => {
        const properties = await (await fetch(`/properties`)).json();
        setProperties(properties);
        if (properties.length > 0 && properties[0].units) {
            setUnits(properties[0].units);
            console.log('setting units in LoadProperties' + properties[0].units[0].id);
            updateUnit(properties[0].units[0].id);
        }
    }
    const tenantOptions = tenants.map(tenant => {
        return { value: tenant.id, label: `${tenant.firstName} ${tenant.lastName}` };
    });

    function setSelectedTenants(selectedOptions) {
        lease.tenantIds = selectedOptions.map(option => option.value);
        setLease({...lease});
        console.log('setSelectedTenants', lease.tenants);
    }

    function handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        lease[name] = value;

        if (name === "rent") {
            lease.deposit = lease.rent;
        }
        setLease({...lease});
    }

    function handleSubmit(event) {
        event.preventDefault();
        saveLease();
        navigate('/', { replace: true });//back home
    }

    function toggleIsCurrent(event) {
        const value = event.target.value;
        lease.current = value;
        setLease({...lease});
    }

    function handlePropertyChange(event) {
        const value = event.target.value;
        const selectedProperty = properties.filter((p) => p.id === value)[0];
        setUnits(selectedProperty.units || []);
        updateUnit(selectedProperty.units && selectedProperty.units.length > 0 ? selectedProperty.units[0].id : null);
    }

    function handleUnitChange(event) {
        const target = event.target;
        const value = target.value;

        updateUnit(value);
    }

    function updateUnit(unitId) {
        lease.unitId = unitId;
        console.log('setting unit id ' + unitId)
        setLease({...lease});
    }

    async function saveLease() {
        await fetch('/leases' + (lease.id ? '/' + lease.id : ''), {
            method: (lease.id) ? 'PUT' : 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(lease),
        });
    }


    return (
        <>
        <div>
            <Container breakpoint="md">
                {title}
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="tenants">Tenants</Label>
                        <Select
                            options={tenantOptions}
                            components={animatedComponents}
                            onChange={choice => setSelectedTenants(choice)}
                            isMulti/ >
                    </FormGroup>
                    <FormGroup>
                        <Label for="current">Lease is Current</Label>
                        <Input type="checkbox" name="current" id="current" checked={lease.current} onChange={toggleIsCurrent} />
                    </FormGroup>
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="selectedProperty">Property</Label>
                                <select id="selectedProperty" onChange={handlePropertyChange}>
                                    {properties.map((property) => (
                                      <option key={property.id} value={property.id}>
                                        {property.name}
                                      </option>
                                    ))}
                                </select>
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="selectedUnit">Unit</Label>
                                <select id="selectedUnit" value={lease.unitId || ''} onChange={handleUnitChange}>
                                    {units.map((unit) => (
                                      <option key={unit.id} value={unit.id}>
                                        {unit.name}
                                      </option>
                                    ))}
                                </select>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="rent">Rent</Label>
                                <Input type="number" name="rent" id="rent" value={lease.rent || ''} onChange={handleChange} />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="balance">Balance</Label>
                                <Input type="number" name="balance" id="balance" value={lease.balance || ''} onChange={handleChange} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="startDate">Start Date</Label>
                                <Input type="date" name="startDate" id="startDate" value = {lease.startDate || ''} onChange={handleChange} />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="endDate">End Date</Label>
                                <Input type="date" name="endDate" id="endDate" value = {lease.endDate || ''} onChange={handleChange} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="deposit">Deposit Amount</Label>
                                <Input type="number" name="deposit" id="deposit" value={lease.deposit || ''} onChange={handleChange} />
                            </FormGroup>
                        </Col>
                         <Col md={6}>
                            <FormGroup>
                                <Label for="depositReturnDate">Deposit Paid On</Label>
                                <Input type="date" name="depositPaidDate" id="depositPaidDate" value={lease.depositPaidDate || ''} onChange={handleChange} />
                            </FormGroup>
                        </Col>
                    </Row>
                    { !lease.current &&
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="depositReturned">Deposit Amount Returned</Label>
                                    <Input type="number" name="depositReturned" id="depositReturned" value={lease.depositReturned || ''} onChange={handleChange} />
                                </FormGroup>
                            </Col>
                             <Col md={6}>
                                <FormGroup>
                                    <Label for="depositReturnDate">Deposit Returned On</Label>
                                    <Input type="date" name="depositReturnDate" id="depositReturnDate" value={lease.depositReturnDate || ''} onChange={handleChange} />
                                </FormGroup>
                            </Col>
                        </Row>
                    }
                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>{' '}
                        <Button color="secondary" tag={Link} to="/leases">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
        </>
    );
}

export default LeaseEdit;