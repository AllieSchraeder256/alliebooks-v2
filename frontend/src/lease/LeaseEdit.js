import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, Row, Col } from 'reactstrap';
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import moment from 'moment';

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
    propertyAndUnitName:'',
    tenantNames: '',
    tenantIds: []
};

const LeaseEdit = () => {
    const id = useParams().id || 'new';
    const [lease, setLease] = useState(emptyLease); //lease with partial data for API save
    const [loadedLease, setLoadedLease] = useState(''); //lease from database with all data
    const [properties, setProperties] = useState([]);
    const [units, setUnits] = useState([]);
    const [tenants, setTenants] = useState([]);

    const animatedComponents = makeAnimated();
    const navigate = useNavigate();
    const title = <h2>{lease.id ? 'Edit Lease' : 'Add Lease'}</h2>;

    useEffect(() => {
        if (id === 'new') {
            loadProperties();
            loadTenants();
            setLease(emptyLease);
        } else {
            loadLease(id);
        }
    }, []);

    const loadTenants = async () => {
        const tenants = await (await fetch(`/tenants`)).json();
        setTenants(tenants);
    }

    const loadLease = async (id) => {
        const getLease = await (await fetch(`/leases/${id}`)).json();
        setLoadedLease(getLease);
        console.log('loading lease '+ loadedLease);

        lease.rent = getLease.rent;
        lease.startDate = getLease.startDate ? getLease.startDate.substring(0, 10) : null;
        lease.endDate = getLease.endDate ? getLease.endDate.substring(0, 10) : null;
        lease.balance = getLease.balance;
        lease.current = getLease.current;
        lease.deposit = getLease.deposit;
        lease.depositPaidDate = getLease.depositPaidDate ? getLease.depositPaidDate.substring(0, 10) : null;
        lease.depositReturned = getLease.depositReturned;
        lease.depositReturnDate = getLease.depositReturnDate ? getLease.depositReturnDate.substring(0, 10) : null;
        lease.unitId = getLease.unit.id;
        lease.id = getLease.id;

        setProperties(getLease.unit.property ? [getLease.unit.property] : []);
        setUnits(getLease.unit.property && getLease.unit ? [getLease.unit] : []);

        lease.tenantIds = getLease.tenantLeases.map(tenantLease => tenantLease.tenant.id);
        setLease(lease);
    }
    const loadProperties = async (id) => {
        const properties = await (await fetch(`/properties`)).json();
        setProperties(properties);
        if (properties.length > 0 && properties[0].units) {
            setUnits(properties[0].units);

            updateUnit(properties[0].units[0].id);
        }
    }
    const tenantOptions = tenants.map(tenant => {
        return { value: tenant.id, label: `${tenant.firstName} ${tenant.lastName}` };
    });

    function setSelectedTenants(selectedOptions) {
        lease.tenantIds = selectedOptions.map(option => option.value);
        setLease({...lease});
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
    }

    function toggleIsCurrent(event) {
        const value = event.target.checked;
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
        }).then(() => {
            navigate('/leases', { replace: true });
        });
    }

    async function remove(id) {
        await fetch(`/leases/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            navigate('/', { replace: true });//back home
        });
    }

    return (
        <>
        <div>
            <Container breakpoint="md">
                {title}
                <Form onSubmit={handleSubmit}>

                    { id === 'new' ? (
                        <>
                        <Row>
                            <FormGroup>
                                <Label for="tenants">Tenants</Label>
                                <Select
                                    id = "tenantSelect"
                                    options={tenantOptions}
                                    components={animatedComponents}
                                    onChange={choice => setSelectedTenants(choice)}
                                    isMulti />
                            </FormGroup>
                        </Row>
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
                        </>
                    ):(
                        <>
                        <Row>
                            <Col md={4}>
                                <h5>{loadedLease.unit && loadedLease.unit.property.name} - {loadedLease.unit && loadedLease.unit.name}</h5>
                            </Col>
                            <Col md={4}>
                                {loadedLease && loadedLease.tenantLeases && loadedLease.tenantLeases.map(tenantLease => {
                                    return <span key={tenantLease.id}>
                                        {tenantLease.tenant.firstName} {tenantLease.tenant.lastName}
                                        {loadedLease.tenantLeases && loadedLease.tenantLeases.indexOf(tenantLease) < loadedLease.tenantLeases.length - 1 ? ', ' : ''}
                                    </span>})}
                            </Col>
                            <Col md={3}>
                                <FormGroup>
                                    <Label for="current">Lease is Current</Label>
                                    <Input type="checkbox" name="current" id="current" checked={lease.current} onChange={toggleIsCurrent} />
                                </FormGroup>
                            </Col>
                            <Col md={1}>
                                <Button size="sm" color="danger" onClick={() => remove(lease.id)}>Delete</Button>
                            </Col>
                        </Row>
                        </>
                    )}

                    <Row>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="rent">Rent</Label>
                                <Input type="number" name="rent" id="rent" value={lease.rent || ''} onChange={handleChange} />
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="balance">Balance</Label>
                                <Input type="number" name="balance" id="balance" value={lease.balance || ''} onChange={handleChange} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="startDate">Start Date</Label>
                                <Input type="date" name="startDate" id="startDate" value = {lease.startDate || ''} onChange={handleChange} />
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="endDate">End Date</Label>
                                <Input type="date" name="endDate" id="endDate" value = {lease.endDate || ''} onChange={handleChange} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="deposit">Deposit Amount</Label>
                                <Input type="number" name="deposit" id="deposit" value={lease.deposit || ''} onChange={handleChange} />
                            </FormGroup>
                        </Col>
                         <Col md={4}>
                            <FormGroup>
                                <Label for="depositReturnDate">Deposit Paid On</Label>
                                <Input type="date" name="depositPaidDate" id="depositPaidDate" value={lease.depositPaidDate || ''} onChange={handleChange} />
                            </FormGroup>
                        </Col>
                    </Row>
                    { !lease.current &&
                        <Row>
                            <Col md={4}>
                                <FormGroup>
                                    <Label for="depositReturned">Deposit Amount Returned</Label>
                                    <Input type="number" name="depositReturned" id="depositReturned" value={lease.depositReturned || ''} onChange={handleChange} />
                                </FormGroup>
                            </Col>
                             <Col md={4}>
                                <FormGroup>
                                    <Label for="depositReturnDate">Deposit Returned On</Label>
                                    <Input type="date" name="depositReturnDate" id="depositReturnDate" value={lease.depositReturnDate || ''} onChange={handleChange} />
                                </FormGroup>
                            </Col>
                        </Row>
                    }
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

export default LeaseEdit;