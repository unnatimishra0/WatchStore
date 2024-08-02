import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const AddProductForm = ({ onProductAdded }) => {
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem('token');
  const nav = useNavigate();

  const initialValues = {
    productName: '',
    image: '',
    description: '',
    brand: '',
    price: 0.0,
    quantity: 0,
    modelNumber: '',
    type: '',
  };

  const onSubmit = async (values, { resetForm }) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/addProd', values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Product added:', response.data);
      resetForm();
      setIsLoading(false);
      onProductAdded(); // Trigger callback to notify AdminDashboard
    } catch (error) {
      console.error('Error adding product:', error);
      setIsLoading(false);
      alert('Failed to add product. Please check the console for details.');
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow p-4 rounded border-light">
            <Card.Body>
              <h2 className="text-center mb-4 text-primary">Add New Product</h2>
              <Formik initialValues={initialValues} onSubmit={onSubmit}>
                {({ isSubmitting }) => (
                  <Form>
                    <div className="mb-3">
                      <label htmlFor="productName" className="form-label">Product Name</label>
                      <Field type="text" className="form-control" id="productName" name="productName" placeholder="Enter product name" />
                      <ErrorMessage name="productName" component="div" className="text-danger mt-1" />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="image" className="form-label">Image URL</label>
                      <Field type="text" className="form-control" id="image" name="image" placeholder="Enter image URL" />
                      <ErrorMessage name="image" component="div" className="text-danger mt-1" />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">Description</label>
                      <Field as="textarea" className="form-control" id="description" name="description" rows="4" placeholder="Enter product description" />
                      <ErrorMessage name="description" component="div" className="text-danger mt-1" />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="brand" className="form-label">Brand</label>
                      <Field type="text" className="form-control" id="brand" name="brand" placeholder="Enter brand name" />
                      <ErrorMessage name="brand" component="div" className="text-danger mt-1" />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="price" className="form-label">Price</label>
                      <Field type="number" step="0.01" className="form-control" id="price" name="price" placeholder="Enter price" />
                      <ErrorMessage name="price" component="div" className="text-danger mt-1" />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="quantity" className="form-label">Quantity</label>
                      <Field type="number" className="form-control" id="quantity" name="quantity" placeholder="Enter quantity" />
                      <ErrorMessage name="quantity" component="div" className="text-danger mt-1" />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="modelNumber" className="form-label">Model Number</label>
                      <Field type="text" className="form-control" id="modelNumber" name="modelNumber" placeholder="Enter model number" />
                      <ErrorMessage name="modelNumber" component="div" className="text-danger mt-1" />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="type" className="form-label">Type</label>
                      <Field type="text" className="form-control" id="type" name="type" placeholder="Enter product type" />
                      <ErrorMessage name="type" component="div" className="text-danger mt-1" />
                    </div>
                    <Button type="submit" variant="primary" className="w-100" disabled={isSubmitting || isLoading}>
                      {isLoading ? 'Adding...' : 'Add Product'}
                    </Button>
                  </Form>
                )}
              </Formik>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddProductForm;
