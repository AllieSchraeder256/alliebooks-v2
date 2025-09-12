import React, { useState } from 'react';
import { Button, Form, FormGroup, Input, Label, Alert, Spinner } from 'reactstrap';
import { apiFetch } from '../utils/api';

const SignupForm = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!name.trim() || !password.trim()) {
      setError('Name and password are required.');
      return;
    }

    try {
      setLoading(true);
      const res = await apiFetch('/auth/signup', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, password })
      });

      if (res.status === 201) {
        setMessage('Signup successful. You can now log in.');
        setName('');
        setPassword('');
      } else {
        setError('Signup failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
      {error && <Alert color="danger">{error}</Alert>}
      {message && <Alert color="success">{message}</Alert>}

      <FormGroup>
        <Label for="name">Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          autoComplete="username"
        />
      </FormGroup>

      <FormGroup>
        <Label for="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          autoComplete="new-password"
        />
      </FormGroup>

      <Button color="primary" type="submit" disabled={loading}>
        {loading ? (<><Spinner size="sm" /> Creating...</>) : 'Sign Up'}
      </Button>
    </Form>
  );
};

export default SignupForm;
