import React, { useEffect, useMemo, useRef, useState } from 'react';
import { apiFetch } from '../utils/api';
import { UncontrolledTooltip } from 'reactstrap';

const ExpenseReport = () => {
    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState(currentYear);
    const [data, setData] = useState([]);
    const [checkedByKey, setCheckedByKey] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getRowKey = (row, idx) => {
        return row?.propertyName
            ? `${row.propertyName}-${row.year}-${row.expenseTypeName}`
            : String(idx);
    };

    useEffect(() => {
        loadData();
        // Reload whenever the selected year changes
    }, [year]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await apiFetch(`/reports/expense?year=${encodeURIComponent(year)}`);
            if (!res.ok) {
                const text = await res.text();
                throw new Error(`API error ${res.status}: ${text}`);
            }
            const json = await res.json();
            const nextData = Array.isArray(json) ? json : [];
            setData(nextData);

            // Initialize (or reset) checkbox state for the newly loaded rows
            const nextChecked = {};
            nextData.forEach((row, idx) => {
                nextChecked[getRowKey(row, idx)] = true;
            });
            setCheckedByKey(nextChecked);
        } catch (e) {
            setError(e.message || String(e));
            setData([]);
            setCheckedByKey({});
        } finally {
            setLoading(false);
        }
    };

    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const formatAmount = (value) => {
        const n = Number(value ?? 0);
        if (Number.isNaN(n)) return value;
        return currencyFormatter.format(n);
    };

    const rowKeys = useMemo(() => data.map((row, idx) => getRowKey(row, idx)), [data]);

    const allChecked = useMemo(() => {
        if (rowKeys.length === 0) return false;
        return rowKeys.every((k) => !!checkedByKey[k]);
    }, [rowKeys, checkedByKey]);

    const someChecked = useMemo(() => {
        return rowKeys.some((k) => !!checkedByKey[k]);
    }, [rowKeys, checkedByKey]);

    const headerCheckboxRef = useRef(null);

    useEffect(() => {
        if (!headerCheckboxRef.current) return;
        headerCheckboxRef.current.indeterminate = someChecked && !allChecked;
    }, [someChecked, allChecked]);

    const toggleAll = (isChecked) => {
        setCheckedByKey((prev) => {
            const next = { ...prev };
            rowKeys.forEach((k) => {
                next[k] = isChecked;
            });
            return next;
        });
    };

    // compute grand total of checked row.total values
    const grandTotal = useMemo(() => {
        return data.reduce((sum, row, idx) => {
            const key = getRowKey(row, idx);
            if (!checkedByKey[key]) return sum;

            const n = Number(row?.total ?? 0);
            return sum + (Number.isNaN(n) ? 0 : n);
        }, 0);
    }, [data, checkedByKey]);

    return (
        <div>
            <div className="d-flex align-items-center mb-3">
                <label htmlFor="reportYear" className="me-2 mb-0">Year</label>
                <input
                    id="reportYear"
                    type="number"
                    className="form-control"
                    style={{ width: '120px' }}
                    value={year}
                    onChange={(e) => {
                        const v = parseInt(e.target.value, 10);
                        setYear(Number.isNaN(v) ? currentYear : v);
                    }}
                    min={2016}
                    max={currentYear}
                />
            </div>

            {loading && <div>Loading...</div>}
            {!loading && error && <div className="text-danger">Error loading report: {error}</div>}
            {!loading && !error && data.length === 0 && <div>No results</div>}

            {!loading && !error && data.length > 0 && (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Property</th>
                            <th>Year</th>
                            <th className="text-right">Total</th>
                            <th>Expense Type</th>
                            <th>
                                <UncontrolledTooltip target="selectAllCheckbox">
                                    Select/deselect all rows
                                </UncontrolledTooltip>
                                <input
                                    ref={headerCheckboxRef}
                                    id="selectAllCheckbox"
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={allChecked}
                                    onChange={(e) => toggleAll(e.target.checked)}
                                    aria-label="Select all rows"
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, idx) => {
                            const rowKey = getRowKey(row, idx);
                            const total = Number(row.total || 0);
                            const checked = !!checkedByKey[rowKey];

                            return (
                                <tr key={rowKey}>
                                    <td>{row.propertyName}</td>
                                    <td>{row.year}</td>
                                    <td className="text-right">{formatAmount(total)}</td>
                                    <td>{row.expenseTypeName}</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={checked}
                                            onChange={(e) => {
                                                const isChecked = e.target.checked;
                                                setCheckedByKey((prev) => ({
                                                    ...prev,
                                                    [rowKey]: isChecked,
                                                }));
                                            }}
                                            aria-label={`Include ${row.propertyName ?? 'row'} ${row.year ?? ''} ${row.expenseTypeName ?? ''}`}
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={2}><strong>Grand Total</strong></td>
                            <td><strong>{formatAmount(grandTotal)}</strong></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            )}
        </div>
    );
};

export default ExpenseReport;