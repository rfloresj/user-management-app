import { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save user information in MySQL
      await axios.post(`${API_BASE_URL}/users/register`, {
        uid: user.uid,
        email: user.email,
        name: name,
      });

      localStorage.setItem('userName', name);

      navigate('/admin');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert('This email is already in use. Please use a different email.');
      } else {
        alert(error.message);
      }
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/login');
  };

  return (
    <div className='container cartoon-ui'>
      <h2
        className='d-flex justify-content-center pt-3'
        style={{ fontFamily: 'Gill Sans, sans-serif' }}
      >
        Register
      </h2>
      <div className='d-flex justify-content-center'>
        <form onSubmit={handleRegister} className='fixed-width-form'>
          <div className='form-group pb-2'>
            <label className='pb-2'>Name:</label>
            <input
              type='text'
              className='form-control'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className='form-group pb-2'>
            <label className='pb-2'>Email:</label>
            <input
              type='email'
              className='form-control'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className='form-group pb-2'>
            <label className='pb-2'>Password:</label>
            <input
              type='password'
              className='form-control'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type='submit' className='btn btn-primary mt-2 mb-5'>
            Register
          </button>
          <div className='border-bottom mb-2'></div>
          <p>
            <a
              className='d-flex justify-content-end link-opacity-50-hover'
              onClick={handleRegisterRedirect}
            >
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
