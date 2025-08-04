import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button, Form, FormGroup, Input, Label, ButtonGroup } from 'reactstrap';

const emptyProperty = {
    name: '',
    units: [{ name: ''}]
};

const PropertyEdit = () => {
    const id = useParams().id || 'new';
    const [property, setProperty] = useState(emptyProperty);
    const [unitCount, setUnitCount] = useState(1);
    const navigate = useNavigate();

    const title = <h2>{ property.id ? 'Edit Property' : 'Add Property'}</h2>;

    useEffect(() => {
        loadProperty(id);
    }, []);

    const loadProperty = async (id) => {
        if (id !== 'new') {
            const property = await (await fetch(`/properties/${id}`)).json();
            setProperty(property);
            setUnitCount(property.units.length || 1);
        } else {
            setProperty(emptyProperty);
            setUnitCount(1);
        }
    }

    function handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        property[name] = value;

        const unitNameMatch = name.match(/^unitName(\d+)$/);

        if (unitNameMatch) {
            const idx = parseInt(unitNameMatch[1]);
            property.units[idx] = property.units[idx] || { name: ''};
            property.units[idx].name = value;
        } else {
            property[name] = value;
        }
        setProperty({...property});
    }

    function handleAddUnit() {
        setUnitCount(c => c + 1);
    }

    function handleRemoveUnit() {
        if (unitCount > 1) {
            setProperty(p => {
                const newUnits = [...p.units];
                newUnits.pop();
                return {
                    ...p,
                    units: newUnits
                };

            });
            setUnitCount(c => c - 1);
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        saveProperty();
    }

    async function saveProperty() {
        await fetch('/properties' + (property.id ? '/' + property.id : ''), {
            method: (property.id) ? 'PUT' : 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(property),
        }).then(() => {
            navigate('/properties', { replace: true });
        });
    }

    return (
        <>
        <div>
            {title}
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label for="name">Name</Label>
                    <Input type="text" name="name" id="name" value={property.name || ''} onChange={handleChange} />
                </FormGroup>
                {Array.from({ length: unitCount }).map((_, i) => (
                    <div key={i} className="unitDiv">
                        <FormGroup>
                            <Label for={`unitName${i}`}>Unit {i + 1} Name</Label>
                            <Input
                                type="text"
                                name={`unitName${i}`}
                                id={`unitName${i}`}
                                placeholder="Unit Name"
                                onChange={handleChange}
                                value={property.units[i]?.name || ''}
                            />
                        </FormGroup>
                    </div>
                ))}
                { property.id ? (
                    <p>Cannot add or remove units from an existing property</p>
                ) : (
                    <FormGroup className="mt-4">
                        <ButtonGroup size="sm">
                            <Button color="primary" onClick={handleAddUnit}>Add Unit</Button>
                            <Button color="secondary" onClick={handleRemoveUnit}>Remove Unit</Button>
                        </ButtonGroup>
                    </FormGroup>
                )}
                <FormGroup className="mt-4">
                    <Button color="primary" type="submit">Save</Button>{' '}
                    <Button color="secondary" tag={Link} to="/properties">Cancel</Button>
                </FormGroup>
            </Form>
        </div>
        </>
    );
}

export default PropertyEdit;