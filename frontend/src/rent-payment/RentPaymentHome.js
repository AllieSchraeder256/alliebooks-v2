import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Table, Input, Label, Row, Col, FormGroup, Checkbox, UncontrolledTooltip, FormFeedback } from 'reactstrap';
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import { Link, useSearchParams } from 'react-router-dom';
import LeaseCard from '../lease/LeaseCard';
import RentPaymentTable from './RentPaymentTable';
import moment from 'moment';
import { apiFetch } from '../utils/api';

const RentPaymentHome = () => {
    const animatedComponents = makeAnimated();
    const [searchParams] = useSearchParams();
    const urlStartDate = searchParams.get('startDate');
    const currentMonthStart = urlStartDate || moment().format('yyyy-MM') + '-01';

    const defaultFilters = {
        startDate : currentMonthStart,
        endDate : moment(currentMonthStart).add(1, 'month').subtract(1, 'day').format('yyyy-MM-DD'),
        leaseId : ''
    }

    const [rentPayments, setRentPayments] = useState('');
    const [searchTypeAdvanced, setSearchTypeAdvanced] = useState(false);
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
        setFilters({ ...filters});
        loadRentPayments(filters);
    }
    function setSelectedLease(choice) {
        filters.leaseId = choice ? choice.value : '';
        setFilters({ ...filters});
        loadRentPayments(filters);
    }
    function handleSearchTypeSwitch(event) {
        const checked = event.target.checked;
        setSearchTypeAdvanced(checked);
    }

    function handleBasicSearchMonthChange(monthDelta) {
        filters.startDate = moment(filters.startDate).add(monthDelta, 'month').startOf('month').format('yyyy-MM-DD');
        filters.endDate = moment(filters.startDate).add(1, 'month').subtract(1, 'day').format('yyyy-MM-DD');
        setFilters({ ...filters });
        loadRentPayments(filters);
    }

    const loadRentPayments = async (filters) => {
        if (filters.startDate && filters.endDate) {
            const url = filters.leaseId == '' ?
                `/rent-payments?start=${filters.startDate}&end=${filters.endDate}`
                : `/rent-payments?start=${filters.startDate}&end=${filters.endDate}&leaseId=${filters.leaseId}`;
            const rentPayments = await (await apiFetch(url)).json();
            setRentPayments(rentPayments);
        }
    }

    const loadCurrentLeaseSummary = async () => {
        const leaseSummary = await (await apiFetch('/leases/current-lease-summary')).json();
        setCurrentLeaseSummary(leaseSummary);
    }

    const detailedFilterDiv = (
        <>
            <Row className="row-cols-sm-auto align-items-center">
                <Col>
                    <Input type="date" name="startDate" id="startDate" invalid={!filters.startDate} value={filters.startDate || ''} onChange={handleFilterChange} />
                </Col>
                <Col>
                    to
                </Col>
                <Col>
                    <Input type="date" name="endDate" id="endDate" invalid={!filters.endDate} value={filters.endDate || ''} onChange={handleFilterChange} className="py0" />
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
        </>
    );

    const basicFilterDiv = (
        <>
            <Row className="row-cols-sm-auto align-items-center">
                <Col>
                    <Button color="primary" outline onClick={() => handleBasicSearchMonthChange(-1)} >←</Button>
                </Col>
                <Col>
                    <span>{moment(filters.startDate).format('MMMM YYYY')}</span>
                </Col>
                <Col>
                    <Button color="primary" outline onClick={() => handleBasicSearchMonthChange(1)} >→</Button>
                </Col>
            </Row>
        </>
    );

    return (
        <>
        <div className="float-right">
            <Button color="success" tag={Link} to="/rent-payments/new">New Payment</Button>
        </div>
        <Row className = "row-cols-sm-auto align-items-center">
            <h3>Rent Payments</h3>
            <FormGroup switch>
                <Input type="switch" role="switch" id="searchTypeSelect" onChange={handleSearchTypeSwitch} />
                <UncontrolledTooltip target="searchTypeSelect">
                    Advanced Search
                </UncontrolledTooltip>
            </FormGroup>
        </Row>
        { searchTypeAdvanced ? detailedFilterDiv : basicFilterDiv }
        <Row className="mt-3">
            <RentPaymentTable rentPayments={rentPayments} />
        </Row>
        </>
    );
}

export default RentPaymentHome;