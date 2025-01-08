import React, { useState } from 'react';
import { useSignUpEmailPassword } from '@nhost/react';
import '../App.css';

const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signUpEmailPassword, isLoading, error } = useSignUpEmailPassword();

  const handleSignUp = async (e) => {
    e.preventDefault();
    await signUpEmailPassword(email, password);
  };

  return (
    <form onSubmit={handleSignUp}>
      <h2>Sign Up</h2>
      {error && <p style={{ color: 'red' }}>{error.message}</p>}
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
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Signing up...' : 'Sign Up'}
      </button>
    </form>
  );
};

export default SignUpForm;
