import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {jwtDecode} from "jwt-decode"; // Corrected import

const Login = ({ setToken }) => {
  const nav = useNavigate();
  const [loginError, setLoginError] = useState(null);

  const handleLogin = async (values, { setSubmitting }) => {
    setSubmitting(true);

    try {
      const response = await axios.post('/products/authenticate', {
        username: values.username,
        password: values.password,
      });
      const { token } = response.data;
      const { userId, roleType } = jwtDecode(token);
      localStorage.setItem('token', token);
      localStorage.setItem('role', roleType);
      localStorage.setItem('userId', JSON.stringify(parseInt(userId, 10)));
      console.log(localStorage);

      nav(roleType === 'ROLE_ADMIN' ? "/admin" : "/watches");
    } catch (error) {
      console.error('Error during login:', error);
      setLoginError('Login failed. Please check your credentials and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="/">WatchStore</a>
        </div>
      </nav>
      
      <div
        className="d-flex vh-100 justify-content-center align-items-center"
        style={{ backgroundImage: "url('/images/watch-wallpaper.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="p-4 bg-light rounded shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
          <h2 className="text-center mb-4">Login</h2>
          <Formik
            initialValues={{ username: '', password: '' }}
            validationSchema={Yup.object({
              username: Yup.string().required('Required'),
              password: Yup.string().required('Required'),
            })}
            onSubmit={handleLogin}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <Field name="username" type="text" className="form-control border-primary" placeholder="Enter your username" />
                  <ErrorMessage name="username" component="div" className="text-danger mt-1" />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <Field name="password" type="password" className="form-control border-primary" placeholder="Enter your password" />
                  <ErrorMessage name="password" component="div" className="text-danger mt-1" />
                </div>
                {loginError && <div className="text-danger mb-3">{loginError}</div>}
                <div className="d-grid mb-3">
                  <button type="submit" className="btn btn-primary btn-lg shadow-sm" disabled={isSubmitting}>
                    {isSubmitting ? 'Logging in...' : 'Login'}
                  </button>
                </div>
                <div className="text-center">
                  <Link to="/register" className="text-decoration-none text-primary">
                    New to Store? <u>Sign up now</u>
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Login;
