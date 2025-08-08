import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Table, Input, Label, Row, Col, FormGroup } from 'reactstrap';
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import { Link } from 'react-router-dom';
import LeaseCard from '../lease/LeaseCard';
import RentPaymentTable from './RentPaymentTable';
import moment from 'moment';

const RentPaymentHome = () => {
    const animatedComponents = makeAnimated();
    const currentMonthStart = moment().format('yyyy-MM') + '-01';

    const defaultFilters = {
        startDate : currentMonthStart,
        endDate : moment(currentMonthStart).add(1, 'month').subtract(1, 'day').format('yyyy-MM-DD'),
        leaseId : ''
    }

    const [rentPayments, setRentPayments] = useState('');
    const [currentLeaseSummary, setCurrentLeaseSummary] = useState([]);
    const [filters, setFilters] = useState(defaultFilters);

    useEffect(() => {
        loadRentPayments(filters);
        loadCurrentLeaseSummary();
    }, []);

    const currentLeaseOptions = currentLeaseSummary && currentLeaseSummary.map(leaseSummary => {
        return { value: leaseSummary.leaseId, label: leaseSummary.details };
    });


    function handleFilterChange(event) {
        const { name, value } = event.target;
        filters[name] = value;
        setFilters(filters);
        loadRentPayments(filters);
    }
    function setSelectedLease(choice) {
        filters.leaseId = choice ? choice.value : '';
        setFilters(filters);
        loadRentPayments(filters);
    }

    const loadRentPayments = async (filters) => {
        const url = filters.leaseId == '' ?
            `/rent-payments?start=${filters.startDate}&end=${filters.endDate}`
            : `/rent-payments?start=${filters.startDate}&end=${filters.endDate}&leaseId=${filters.leaseId}`;
        const rentPayments = await (await fetch(url)).json();
        setRentPayments(rentPayments);
    }

    const loadCurrentLeaseSummary = async () => {
        const leaseSummary = await (await fetch('/leases/current-lease-summary')).json();
        setCurrentLeaseSummary(leaseSummary);
    }

    const detailedFilterDiv = (
        <>
            <div>
                <Row className="row-cols-sm-auto g-3 align-items-center">
                    <Col>
                        Date Range
                    </Col>
                    <Col>
                        <Input type="date" name="startDate" id="startDate" value={filters.startDate || ''} onChange={handleFilterChange} />
                    </Col>
                    <Col>
                        to
                    </Col>
                    <Col>
                        <Input type="date" name="endDate" id="endDate" value={filters.endDate || ''} onChange={handleFilterChange} className="py0" />
                    </Col>
                    <Col style={{minWidth: '300px', maxWidth: '450px'}}>
                        <Select
                            id = "filterLeaseSelect"
                            options={currentLeaseOptions}
                            components={animatedComponents}
                            onChange={choice => setSelectedLease(choice)}
                            placeholder="Lease"
                            backspaceRemovesValue
                            isClearable />
                    </Col>

                </Row>
            </div>
        </>
    );

    return (
        <>
        <div className="float-right">
            <Button color="success" tag={Link} to="/rent-payments/new">Add</Button>
        </div>
        <h3>Rent Payments</h3>
        {detailedFilterDiv}
        <RentPaymentTable rentPayments={rentPayments} />
        </>
    );
}

export default RentPaymentHome;