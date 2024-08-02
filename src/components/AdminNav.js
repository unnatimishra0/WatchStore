import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { Formik, Form, Field } from 'formik';
import { Navbar, Container, Nav, Button, Modal } from 'react-bootstrap';

const AdminNav = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [cartProducts, setCartProducts] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // State to store admin status
  const [userId, setUserId] = useState(null); // State to store userId

  useEffect(() => {
    const role = localStorage.getItem('role');
    const storedUserId = localStorage.getItem('userId');
    setIsAdmin(role === 'ROLE_ADMIN'); // Set isAdmin based on role
    setUserId(storedUserId ? parseInt(storedUserId, 10) : null); // Convert userId to integer
  }, []);

  const handleSearchSubmit = async (values, { setSubmitting }) => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(`/searchBy/${values.search}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setSearchResults(response.data);
      setError(null);
    } catch (error) {
      console.error('Error searching for products:', error);
      setError('Failed to search for products. Please check the console for more details.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCartClick = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(`/api/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartProducts(response.data);
      setShowCartModal(true);
      setError(null);
    } catch (error) {
      console.error('Error fetching cart products:', error);
      setError('Failed to fetch cart products. Please check the console for more details.');
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand href="#home">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_DOJh8USMfqTovEXeLIUi9VHFinjAdTuXzg&s"
            alt="My Store Logo"
            style={{ width: '100px', height: 'auto' }} // Adjusted size
          />
        </Navbar.Brand>
        <Nav className="ml-auto align-items-center">
          {isAdmin && (
            <Nav.Link as={Link} to="/analytics" className="text-light">
              Analytics
            </Nav.Link>
          )}
          <Formik initialValues={{ search: '' }} onSubmit={handleSearchSubmit}>
            {({ isSubmitting }) => (
              <Form className="d-flex align-items-center ml-3">
                <Field
                  name="search"
                  className="form-control mr-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                />
                <Button variant="outline-light" type="submit" disabled={isSubmitting} className="ml-2">
                  Search
                </Button>
              </Form>
            )}
          </Formik>
          <Button variant="link" onClick={handleCartClick} className="ml-3">
            <FontAwesomeIcon icon={faShoppingCart} size="lg" color="#fff" />
          </Button>
        </Nav>
      </Container>
      <Modal show={showCartModal} onHide={() => setShowCartModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Your Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cartProducts.length > 0 ? (
            <ul className="list-unstyled">
              {cartProducts.map((product) => (
                <li key={product.id} className="d-flex justify-content-between align-items-center mb-3">
                  <span>{product.name}</span>
                  <span className="badge bg-primary text-light">{product.quantity}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center">Your cart is empty.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCartModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Navbar>
  );
};

export default AdminNav;
