import React, { useEffect, useState } from 'react';
import {
    Button,
    ButtonGroup,
    Table,
    Card,
    CardBody,
    CardTitle
} from 'reactstrap';
import { Link } from 'react-router-dom';

const PropertyList = () => {
    const [properties, setProperties] = useState('');

    useEffect(() => {
        loadProperties();
    }, []);

    const loadProperties = async () => {
        const properties = await (await fetch(`/properties`)).json();
        setProperties(properties);
    }

    async function remove(id) {
        await fetch(`/properties/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            const updatedProperties = [...properties].filter(i => i.id !== id);
            setProperties(props => ({...props, properties: updatedProperties}));
        });
    }


    const propertyList = properties && properties.map && properties.map(property => (
        <Card key={property.id}>
            <CardTitle tag="h4">
                {property.name}
                <ButtonGroup className="float-right">
                    <Button size="sm" color="primary" tag={Link} to={"/properties/" + property.id}>Edit</Button>
                    <Button size="sm" color="danger" onClick={() => remove(property.id)}>Delete</Button>
                </ButtonGroup>
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
        <div className="float-right">
            <Button color="success" tag={Link} to="/properties/new">Add</Button>
        </div>
        <h2>Properties</h2>
        {propertyList}
        </>
    );
}

export default PropertyList;