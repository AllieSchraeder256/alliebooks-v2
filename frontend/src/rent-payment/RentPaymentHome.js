import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Table, Input, Label, Row, Col, FormGroup } from 'reactstrap';
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import { Link } from 'react-router-dom';
import LeaseCard from '../lease/LeaseCard';
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

    const rentPaymentList = rentPayments && rentPayments.map && rentPayments.map(payment => {
        return <tr key={payment.id}>
            <td style={{whiteSpace: 'nowrap'}}>tenantname</td>
            <td style={{whiteSpace: 'nowrap'}}>{payment.lease.unit.property.name} - {payment.lease.unit.name}</td>
            <td style={{whiteSpace: 'nowrap'}}>{payment.amount}</td>
            <td style={{whiteSpace: 'nowrap'}}>{payment.paidOn}</td>
            <td style={{whiteSpace: 'nowrap'}}>{payment.dueOn}</td>
            <td style={{whiteSpace: 'nowrap'}}>{payment.note}</td>
        </tr>
    });

    return (
        <>
        <div className="float-right">
            <Button color="success" tag={Link} to="/rent-payments//new">Add</Button>
        </div>
        <h3>Rent Payments</h3>
        {detailedFilterDiv}
        <Table className="mt-4">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Property</th>
                    <th>Amount</th>
                    <th>Paid On</th>
                    <th>Due On</th>
                    <th>Notes</th>
                </tr>
            </thead>
            <tbody>
                {rentPaymentList}
            </tbody>
        </Table>
        </>
    );
}

export default RentPaymentHome;