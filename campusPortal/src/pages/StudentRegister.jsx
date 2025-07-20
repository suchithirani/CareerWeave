import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const StudentRegister = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage(null);
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
        roles: ['STUDENT'],
      });

      setMessage(res.data.message || "Registration successful! Redirecting...");
      setForm({ name: '', email: '', password: '', confirmPassword: '' });

      // Store the authentication token and user data in localStorage
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', 'STUDENT');
        localStorage.setItem('name', form.name);
        // You can store additional user data if available in the response
      }

      // Redirect after short delay to show success message
      setTimeout(() => {
        navigate('/student/dashboard');
      }, 1500);
    } catch (err) {
      if (err.response?.data) {
        setError(err.response.data.message || err.response.data);
      } else {
        setError('Failed to register. Try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Auto clear messages after 5 seconds
  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  return (
    <div className="flex justify-center bg-gradient-to-br">
      <div className="bg-white rounded-2xl w-full max-w-md p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-indigo-700">Student Registration</h2>

        {message && (
          <p className="text-green-600 text-sm text-center" role="alert">
            {message}
          </p>
        )}
        {error && (
          <p className="text-red-600 text-sm text-center" role="alert">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" aria-label="Student Registration Form">
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={form.name}
            onChange={handleChange}
            required
            aria-required="true"
            aria-describedby="nameHelp"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={form.email}
            onChange={handleChange}
            required
            aria-required="true"
            aria-describedby="emailHelp"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={form.password}
            onChange={handleChange}
            required
            aria-required="true"
            aria-describedby="passwordHelp"
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            aria-required="true"
            aria-describedby="confirmPasswordHelp"
          />

          <p id="passwordHelp" className="text-xs text-gray-500">
            Password must be at least 8 characters, including uppercase, lowercase, and a number.
          </p>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-xl text-white font-semibold transition ${
              loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
            aria-busy={loading}
          >
            {loading ? 'Registering...' : 'Register as Student'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-medium hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default StudentRegister;