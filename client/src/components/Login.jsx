import { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Check user status and update last login time
      const response = await axios.post(`${API_BASE_URL}/users/login`, {
        uid: user.uid,
      });

      if (response.status === 403) {
        alert('Your account is blocked. Please contact support.');
        await auth.signOut(); // Sign out the user from Firebase
        return;
      }

      // Fetch user details
      const userDetails = await axios.get(`${API_BASE_URL}/users/${user.uid}`);
      const userName = userDetails.data.name;

      // Store user name in local storage
      localStorage.setItem('userName', userName);

      navigate('/admin');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <div className='container cartoon-ui'>
      <h2
        className='d-flex justify-content-center pt-3'
        style={{ fontFamily: 'Gill Sans, sans-serif' }}
      >
        Login
      </h2>
      <div className='d-flex justify-content-center'>
        <form onSubmit={handleLogin} className='fixed-width-form'>
          <div className='form-group pt-3'>
            <label className='pb-2'>Email:</label>
            <input
              type='email'
              className='form-control'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete='email'
            />
          </div>
          <div className='form-group'>
            <label className='pt-3 pb-2'>Password:</label>
            <input
              type='password'
              className='form-control'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type='submit' className='btn btn-primary mt-3 mb-5'>
            Login
          </button>
          <div className='border-bottom mb-2'></div>

          <p>
            <a
              className='d-flex justify-content-end link-opacity-50-hover'
              href='#'
              onClick={handleRegisterRedirect}
            >
              Register
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
