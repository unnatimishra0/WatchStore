import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import { Formik, Form, Field } from 'formik';
import { Navbar, Container, Nav, FormControl, Button, Modal, Dropdown, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Header = ({ setDisplayedProducts, setError }) => {
  const [cartProducts, setCartProducts] = useState([]); // State to store cart products
  const [showCartModal, setShowCartModal] = useState(false); // State to manage cart modal visibility
  const token = localStorage.getItem('token');
  const nav = useNavigate();

  const handleSearchSubmit = async (values, { setSubmitting }) => {
    const token = localStorage.getItem('token'); // Assuming token-based authentication

    if (!values.search.trim()) {
      // If search input is empty, fetch all products
      try {
        const response = await axios.get('/getAllProducts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDisplayedProducts(response.data); // Update displayed products state with all products
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error('Error fetching all products:', error);
        setError('Failed to fetch all products. Please check the console for more details.');
      } finally {
        setSubmitting(false); // Enable submit button after request
      }
    } else {
      // Perform search with the provided keyword
      try {
        console.log('Submitting search with values:', values);
        const response = await axios.get(`/searchBy/${values.search}`, {
          headers: { Authorization: `Bearer ${token}` }, // Set Authorization header with token
        });
        console.log('Search response:', response.data);
        setDisplayedProducts(response.data); // Update displayed products state with search results
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error('Error searching for products:', error);
        setError('Failed to search for products. Please check the console for more details.'); // Set error message
      } finally {
        setSubmitting(false); // Enable submit button after request
      }
    }
  };

  const handleCartClick = () => {
    nav("/cart");
  };

  const handleProfileClick = () => {
    nav("/profile");
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    localStorage.removeItem("categories")
    localStorage.removeItem("content")
    localStorage.removeItem("title")
    localStorage.removeItem("list")
    nav("/");
  };

  const handleTrackOrderClick = () => {
    nav("/trackOrder");
  };

  const handleMyOrdersClick = () => {
    nav("/orders");
  };

  return (
    <div>
      <Navbar bg="light" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand href="#">My Store</Navbar.Brand>
          <Nav className="me-auto">
            {/* Other navigation links (if any) */}
          </Nav>
          <Formik initialValues={{ search: '' }} onSubmit={handleSearchSubmit}>
            {({ isSubmitting }) => (
              <Form inline="true" className="d-flex me-2">
                <FormControl type="text" placeholder="Search" className="mr-sm-2" name="search" as={Field} />
                <Button type="submit" disabled={isSubmitting} className="ms-2">Search</Button>
              </Form>
            )}
          </Formik>
          <Button variant="link" onClick={handleCartClick} className="position-relative me-3">
            <FontAwesomeIcon icon={faShoppingCart} size="lg" />
            {cartProducts.length > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cartProducts.length}
                <span className="visually-hidden">cart items</span>
              </span>
            )}
          </Button>
          <Dropdown>
            <Dropdown.Toggle variant="link" id="dropdown-basic">
              <FontAwesomeIcon icon={faUser} size="lg" />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleProfileClick}>Profile</Dropdown.Item>
              <Dropdown.Item onClick={handleTrackOrderClick}>Track Order</Dropdown.Item>
              <Dropdown.Item onClick={handleMyOrdersClick}>My Orders</Dropdown.Item>
              <Dropdown.Item onClick={handleLogoutClick}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Container>
      </Navbar>

      <Container className="mt-3">
        <Row>
          {/* Render products here if needed */}
        </Row>
      </Container>

      <Modal show={showCartModal} onHide={() => setShowCartModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Card.Body>
              <Card.Title>Your Cart Items</Card.Title>
              <Row>
                {cartProducts.length > 0 ? (
                  cartProducts.map((product) => (
                    <Col key={product.productId} className="mb-3">
                      <Card>
                        <Card.Img variant="top" src={product.image} alt={product.productName} />
                        <Card.Body>
                          <Card.Title>{product.productName}</Card.Title>
                          <Card.Text>${product.price}</Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <p>Your cart is empty.</p>
                )}
              </Row>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCartModal(false)}>Close</Button>
          <Button variant="primary" onClick={() => console.log('Proceed to checkout')}>Checkout</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Header;
