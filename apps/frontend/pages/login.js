import React, { useState } from 'react';
import { useRouter } from 'next/router';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      if (!res.ok) {
        setError('Invalid credentials');
        return;
      }
      
      const data = await res.json();
      localStorage.setItem('authToken', data.token);
      router.push('/');  // Redirect to dashboard
    } catch (err) {
      setError('Login failed');
    }
  };
  
  return (
    <div className="login-container">
      <h2>Dostel Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        {error && <p style="color: red;">{error}</p>}
      </form>
    </div>
  );
};

export default Login;