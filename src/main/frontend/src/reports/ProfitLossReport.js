import React, { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';

const ProfitLossReport = () => {
    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState(currentYear);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadData();
        // Reload whenever the selected year changes
    }, [year]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await apiFetch(`/reports/profit-loss?year=${encodeURIComponent(year)}`);
            if (!res.ok) {
                const text = await res.text();
                throw new Error(`API error ${res.status}: ${text}`);
            }
            const json = await res.json();
            setData(Array.isArray(json) ? json : []);
        } catch (e) {
            setError(e.message || String(e));
            setData([]);
        } finally {
            setLoading(false);
        }
    }

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
    }

    return (
        <div>
            <div className="d-flex align-items-center mb-3">
                <label htmlFor="reportYear" className="me-2 mb-0">Year</label>
                <input
                    id="reportYear"
                    type="number"
                    className="form-control"
                    style={{width: '120px'}}
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
                             <th>Year</th>
                             <th>Property</th>
                             <th className="text-right">Income</th>
                             <th className="text-right">Expenses</th>
                             <th className="text-right">Net</th>
                         </tr>
                     </thead>
                     <tbody>
                         {data.map((row, idx) => {
                             const income = Number(row.incomeTotal || 0);
                             const expense = Number(row.expenseTotal || 0);
                             const net = (Number.isNaN(income) || Number.isNaN(expense)) ? null : (income - expense);
                             return (
                                 <tr key={row.propertyName ? `${row.propertyName}-${row.year}` : idx}>
                                     <td>{row.year}</td>
                                     <td>{row.propertyName}</td>
                                     <td className="text-right">{formatAmount(income)}</td>
                                     <td className="text-right">{formatAmount(expense)}</td>
                                     <td className="text-right">{net === null ? '' : formatAmount(net)}</td>
                                 </tr>
                             )
                         })}
                     </tbody>
                 </table>
             )}
         </div>
     );
}

export default ProfitLossReport;
