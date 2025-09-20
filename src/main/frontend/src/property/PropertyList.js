import React, { useEffect, useState } from 'react';
import {
    Button,
    ButtonGroup,
    Card,
    CardBody,
    CardTitle
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';

const PropertyList = () => {
    const [properties, setProperties] = useState('');

    useEffect(() => {
        loadProperties();
    }, []);

    const loadProperties = async () => {
        const properties = await (await apiFetch(`/properties`)).json();
        setProperties(properties);
    }

    async function remove(id) {
        await apiFetch(`/properties/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            const updatedProperties = [...properties].filter(i => i.id !== id);
            setProperties(updatedProperties);
        });
    }


    const propertyList = properties && properties.map && properties.map(property => (
        <Card key={property.id}>
            <CardTitle tag="h4">
                <div className="d-flex justify-content-between align-items-center">
                    <span>{property.name}</span>
                    <ButtonGroup>
                        <Button size="sm" color="primary" tag={Link} to={"/properties/" + property.id}>Edit</Button>
                        <Button size="sm" color="danger" onClick={() => remove(property.id)}>Delete</Button>
                    </ButtonGroup>
                </div>
            </CardTitle>


            <CardBody >
                <h5>Units</h5>
                {property.units && property.units.map(unit => (
                    <><span key={unit.id}>{unit.name}</span><br /></>
                ))}
                {/* TODO investment info will go here */}
            </CardBody>
        </Card>
    ));

    return (
        <>
        <div className="d-flex justify-content-between align-items-center mb-2">
            <h2 className="mb-0">Properties</h2>
            <Button color="success" tag={Link} to="/properties/new">Add</Button>
        </div>
        {propertyList}
        </>
    );
}

export default PropertyList;