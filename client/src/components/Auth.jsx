import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Auth.css'; // Import custom styles

function Auth({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(true); // State to toggle between Sign Up and Sign In

  // Reset fields when switching between Sign Up and Sign In
  useEffect(() => {
    setEmail('');
    setPassword('');
  }, [isSignUp]);

  const handleSignUp = async () => {
    const res = await fetch(`http://localhost:8000/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      alert('Signup successful');
    } else {
      const errorData = await res.json();
      alert(errorData.message);
    }
  };

  const handleSignIn = async () => {
    const res = await fetch(`http://localhost:8000/signIn`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data = await res.json();
      setToken(data.token);
    } else {
      const errorData = await res.json();
      alert(errorData.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4 welcome-text">Welcome to Stack Overflow 2.0</h1>
      <div className="mb-4">
        <button
          onClick={() => setIsSignUp(true)}
          className={`py-2 px-4 rounded ${isSignUp ? 'bg-blue-600' : 'bg-gray-300'}`}
        >
          Sign Up
        </button>
        <button
          onClick={() => setIsSignUp(false)}
          className={`py-2 px-4 rounded ${!isSignUp ? 'bg-blue-600' : 'bg-gray-300'}`}
        >
          Sign In
        </button>
      </div>
      <div className={`form-container ${isSignUp ? 'sign-up' : 'sign-in'}`}>
        <input
          type="email"
          placeholder="Email"
          className="block w-full p-2 mb-2 border rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="block w-full p-2 mb-4 border rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {isSignUp ? (
          <button
            onClick={handleSignUp}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded mb-2"
          >
            Sign Up
          </button>
        ) : (
          <button
            onClick={handleSignIn}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  );
}

Auth.propTypes = {
  setToken: PropTypes.func.isRequired,
};

export default Auth;
