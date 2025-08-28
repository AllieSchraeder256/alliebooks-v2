import React, { useState } from 'react';
import { Button, Form, FormGroup, Input, Label, Alert, Spinner } from 'reactstrap';
import { useLocation, useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !password.trim()) {
      setError('Name and password are required.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, password })
      });

      if (!res.ok) {
        setError(res.status === 401 ? 'Invalid credentials.' : 'Login failed.');
        return;
      }

      const data = await res.json();
      // Persist token (adjacent improvement)
      if (data?.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('authUser', data.name || name);
      }

      // Redirect to intended page or home
      navigate(from, { replace: true });
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
      {error && <Alert color="danger">{error}</Alert>}

      <FormGroup>
        <Label htmlFor="name">Name</Label>
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
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          autoComplete="current-password"
        />
      </FormGroup>

      <Button color="primary" type="submit" disabled={loading}>
        {loading ? (<><Spinner size="sm" /> Logging in...</>) : 'Log In'}
      </Button>
    </Form>
  );
};

export default LoginForm;

