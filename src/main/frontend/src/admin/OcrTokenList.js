import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';

const OcrTokenList = () => {

const [ocrTokens, setOcrTokens] = useState('');

    useEffect(() => {
        loadOcrTokens();
    }, []);

    const loadOcrTokens = async () => {
        const ocrTokens = await (await apiFetch(`/ocr-tokens`)).json();
        setOcrTokens(ocrTokens);
    }

    async function remove(id) {
        await apiFetch(`/ocr-tokens/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            let updatedOcrTokens = [...ocrTokens].filter(i => i.id !== id);
            setOcrTokens(updatedOcrTokens);
        });
    }

    const ocrTokenList = ocrTokens && ocrTokens.map && ocrTokens.map(ocrToken => {
        return <tr key={ocrToken.id}>
            <td>{ocrToken.regex}</td>
            <td>{ocrToken.merchant}</td>
            <td>{ocrToken.expenseType && ocrToken.expenseType.name}</td>
            <td>
                <ButtonGroup>
                    <Button size="sm" color="primary" tag={Link} to={"/ocr-tokens/" + ocrToken.id}>Edit</Button>
                    <Button size="sm" color="danger" onClick={() => remove(ocrToken.id)}>Delete</Button>
                </ButtonGroup>
            </td>
        </tr>
    });

    return (
        <>
        <div className="d-flex justify-content-between align-items-center mb-2">
            <h3 className="mb-0">OCR Tokens</h3>
            <Button color="success" tag={Link} to="/ocr-tokens/new">New Token</Button>
        </div>
        <Table hover>
            <thead>
                <tr>
                    <th>Regex</th>
                    <th>Merchant</th>
                    <th>Default Expense Type</th>
                    <th>Actions</th>
                </tr>
            </thead>
            {ocrTokens && ocrTokens.map &&
                <tbody>
                    {ocrTokenList}
                </tbody>
            }
        </Table>
        </>
    );
}

export default OcrTokenList;