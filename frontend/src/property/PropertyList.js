import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Table } from 'reactstrap';
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
            let updatedProperties = [...properties].filter(i => i.id !== id);
            setProperties(props => ({...props, properties: updatedProperties}));
        });
    }


    const propertyList = properties && properties.map && properties.map(property => (
        <div id={property.id} key={property.id} class="propertyDiv">
            <ButtonGroup className="float-right">
                <Button size="sm" color="primary" tag={Link} to={"/properties/" + property.id}>Edit</Button>
                <Button size="sm" color="danger" onClick={() => remove(property.id)}>Delete</Button>
            </ButtonGroup>
            <h4>{property.name}</h4>


            <div className="unitDiv w-25">
                Units
                {property.units && property.units.map(unit => (
                    <p>{unit.name}</p>
                ))}
            </div>
            {/* TODO investment info will go here */}
        </div>
    ));

    return (
        <>
        <div>
            <div className="float-right">
                <Button color="success" tag={Link} to="/properties/new">Add</Button>
            </div>
            <h2>Properties</h2>
            {propertyList}
        </div>
        </>
    );
}

export default PropertyList;