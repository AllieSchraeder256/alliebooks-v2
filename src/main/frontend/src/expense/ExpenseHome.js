import React, { useEffect, useState, useRef } from 'react';
import { Button, Input, Row, Col, FormGroup, UncontrolledTooltip } from 'reactstrap';
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import { useSearchParams } from 'react-router-dom';
import ExpenseTable from './ExpenseTable';
import ImageUploadModal from '../components/ImageUploadModal';
import moment from 'moment';
import { apiFetch } from '../utils/api';

const ExpenseHome = () => {
    const animatedComponents = makeAnimated();
    const [searchParams] = useSearchParams();
    const urlStartDate = searchParams.get('startDate');
    const currentMonthStart = urlStartDate || moment().format('yyyy-MM') + '-01';

    const defaultFilters = {
        startDate : currentMonthStart,
        endDate : moment(currentMonthStart).add(1, 'month').subtract(1, 'day').format('yyyy-MM-DD'),
        propertyId : '',
        expenseTypeId : '',
        searchText : ''
    }

    const [expenses, setExpenses] = useState('');
    const [searchTypeAdvanced, setSearchTypeAdvanced] = useState(false);
    const [properties, setProperties] = useState([]);
    const [expenseTypes, setExpenseTypes] = useState([]);
    const [filters, setFilters] = useState(defaultFilters);
    const searchDebounceRef = useRef();

    useEffect(() => {
        loadExpenses(filters);
        loadExpenseTypes();
        loadProperties();
    }, [filters]);

    const propertyOptions = properties && properties.map && properties.map(property => {
        return { value: property.id, label: property.name };
    });
    const expenseTypeOptions = expenseTypes && expenseTypes.map && expenseTypes.map(expenseType => {
        return { value: expenseType.id, label: expenseType.name };
    });

    function handleFilterChange(event) {
        const { name, value } = event.target;
        filters[name] = value;
        setFilters({ ...filters});

        if (name === "searchText") {
            if (searchDebounceRef.current) {
                clearTimeout(searchDebounceRef.current);
            }
            searchDebounceRef.current = setTimeout(() => {
                loadExpenses({ ...filters, searchText: value });
            }, 500); // 500ms debounce
        } else {
            loadExpenses(filters);
        }
    }
    function setSelectedProperty(choice) {
        filters.propertyId = choice ? choice.value : '';
        setFilters({ ...filters});
        loadExpenses(filters);
    }
    function setSelectedExpenseType(choice) {
        filters.expenseTypeId = choice ? choice.value : '';
        setFilters({ ...filters});
        loadExpenses(filters);
    }
    function handleSearchTypeSwitch(event) {
        const checked = event.target.checked;
        setSearchTypeAdvanced(checked);
    }

    function handleBasicSearchMonthChange(monthDelta) {
        filters.startDate = moment(filters.startDate).add(monthDelta, 'month').startOf('month').format('yyyy-MM-DD');
        filters.endDate = moment(filters.startDate).add(1, 'month').subtract(1, 'day').format('yyyy-MM-DD');
        setFilters({ ...filters });
        loadExpenses(filters);
    }

    const loadExpenses = async (filters) => {
        if (filters.startDate && filters.endDate) {
            let url = `/expenses?start=${filters.startDate}&end=${filters.endDate}`;
            if (filters.propertyId) {
                url += `&propertyId=${filters.propertyId}`;
            }
            if (filters.expenseTypeId) {
                url += `&expenseTypeId=${filters.expenseTypeId}`;
            }
            if (filters.searchText) {
                url += `&searchText=${encodeURIComponent(filters.searchText)}`;
            }
            const expenses = await (await apiFetch(url)).json();
            setExpenses(expenses);
        }
    }

    const loadProperties = async () => {
        const properties = await (await apiFetch('/properties')).json();
        setProperties(properties);
    }
    const loadExpenseTypes = async () => {
        const expenseTypes = await (await apiFetch('/expense-types')).json();
        setExpenseTypes(expenseTypes);
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
                    <Input type="date" name="endDate" id="endDate" invalid={!filters.endDate} value={filters.endDate || ''} onChange={handleFilterChange} />
                </Col>
                <Col>
                    <Input type="text" placeholder="Search Text" name="searchText" id="searchText" value={filters.searchText || ''} onChange={handleFilterChange}  />
                </Col>
                <Col>
                    <Select
                        id = "filterPropertySelect"
                        options={propertyOptions}
                        components={animatedComponents}
                        onChange={choice => setSelectedProperty(choice)}
                        placeholder="Property"
                        backspaceRemovesValue
                        isClearable />
                </Col>
                <Col>
                    <Select
                        id = "filterExpenseTypeSelect"
                        options={expenseTypeOptions}
                        components={animatedComponents}
                        onChange={choice => setSelectedExpenseType(choice)}
                        placeholder="Expense Type"
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
        <div className="d-flex align-items-center mb-2">
            <h3 className="mb-0 me-2">Expenses</h3>
            <FormGroup switch className="mb-0 me-3">
                <Input type="switch" role="switch" id="searchTypeSelect" onChange={handleSearchTypeSwitch} />
                <UncontrolledTooltip target="searchTypeSelect">
                    Advanced Search
                </UncontrolledTooltip>
            </FormGroup>
            <div className="ms-auto">
                <ImageUploadModal from="expenseNew" buttonText="New Expense" buttonColor="success" showNoImageOption />
            </div>
        </div>
        { searchTypeAdvanced ? detailedFilterDiv : basicFilterDiv }
        <ExpenseTable expenses={expenses} />
        </>
    );
}

export default ExpenseHome;