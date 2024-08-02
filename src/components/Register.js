import React, { useState } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Modal, ModalBody, ModalFooter, Button } from 'react-bootstrap'; // Import Bootstrap Modal components
import 'bootstrap/dist/css/bootstrap.min.css';

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State for success popup

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string()
      .min(4, 'Password must be at least 4 characters')
      .required('Password is required'),
  });

  const handleSubmit = async (values, { resetForm }) => {
    setIsLoading(true);
    setError(null);

    const data = { ...values, name: values.username }; // Add name field with the same value as username

    try {
      const response = await axios.post('/products/new', data); // Assuming your actual endpoint is /registerUser
      console.log('Registration successful:', response.data);
      resetForm(); // Clear form after successful registration
      setShowSuccessModal(true); // Open success popup
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSuccessModal = () => setShowSuccessModal(false);

  return (
    <div
      className="d-flex vh-100 justify-content-center align-items-center"
      style={{ 
        backgroundImage: "url('/images/beautiful-background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="p-4 bg-white rounded shadow-lg" style={{ maxWidth: '500px', width: '100%' }}>
        <h1 className="text-center mb-4" style={{ color: '#333' }}>Register</h1>
        <Formik
          initialValues={{ username: '', email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <Field
                  type="text"
                  name="username"
                  className="form-control form-control-lg border-primary"
                  id="username"
                  placeholder="Enter username"
                  onChange={(e) => {
                    const value = e.target.value;
                    setFieldValue('username', value);
                    setFieldValue('name', value); // Set the name field to the same value as username
                  }}
                />
                <ErrorMessage name="username" component="div" className="text-danger mt-2" />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <Field
                  type="email"
                  name="email"
                  className="form-control form-control-lg border-primary"
                  id="email"
                  placeholder="Enter email"
                />
                <ErrorMessage name="email" component="div" className="text-danger mt-2" />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="form-label">Password</label>
                <Field
                  type="password"
                  name="password"
                  className="form-control form-control-lg border-primary"
                  id="password"
                  placeholder="Enter password"
                />
                <ErrorMessage name="password" component="div" className="text-danger mt-2" />
              </div>
              <Field type="hidden" name="name" value={values.username} />
              <button type="submit" className="btn btn-primary btn-lg w-100" disabled={isSubmitting || isLoading}>
                {isLoading ? 'Registering...' : 'Register'}
              </button>
              {error && <div className="alert alert-danger mt-3" role="alert">{error}</div>}

              {/* Success modal using Bootstrap */}
              <Modal show={showSuccessModal} onHide={handleCloseSuccessModal} centered>
                <ModalBody className="text-center">
                  <h5 className="mb-3">Registration Successful!</h5>
                  <p>You have been successfully registered. You can now log in to your account.</p>
                </ModalBody>
                <ModalFooter>
                  <Button variant="secondary" onClick={handleCloseSuccessModal}>
                    Close
                  </Button>
                  <Button variant="primary" href="/login">
                    Login
                  </Button>
                </ModalFooter>
              </Modal>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;
