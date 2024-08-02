import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert, Spinner, Card, Container, Row, Col } from 'react-bootstrap';
import CommonHeader from './CommonHeader'; // Adjust the import path as needed

const TrackOrder = () => {
    const [trackingId, setTrackingId] = useState('');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    const handleInputChange = (event) => {
        setTrackingId(event.target.value);
    };

    const handleTrackOrder = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`/track/${trackingId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
            });
            setOrder(response.data);
        } catch (err) {
            setError(err.response ? err.response.data : "Error tracking order");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <CommonHeader userId={userId} />
            <Container
                className="mt-5 py-4"
                style={{ 
                    background: 'linear-gradient(to right, #f5f7fa, #c3cfe2)',
                    borderRadius: '15px',
                    padding: '30px'
                }}
            >
                <Row className="justify-content-md-center">
                    <Col md={8} lg={6} xl={4}>
                        <Card className="p-4 shadow-lg border-0 rounded-lg">
                            <Card.Body>
                                <h2 className="text-center mb-4 text-primary">Track Your Order</h2>
                                <Form>
                                    <Form.Group controlId="trackingId">
                                        <Form.Label>Tracking ID</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter tracking ID"
                                            value={trackingId}
                                            onChange={handleInputChange}
                                            className="mb-3"
                                        />
                                    </Form.Group>
                                    <div className="d-grid gap-2">
                                        <Button variant="primary" onClick={handleTrackOrder} disabled={loading}>
                                            {loading ? <Spinner as="span" animation="border" size="sm" /> : "Track Order"}
                                        </Button>
                                    </div>
                                </Form>
                                {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                            </Card.Body>
                        </Card>
                        {order && (
                            <Card className="mt-4 shadow-lg border-0 rounded-lg">
                                <Card.Header as="h5" className="bg-primary text-white">Order Details</Card.Header>
                                <Card.Body>
                                    <Card.Text><strong>Order ID:</strong> {order.orderId}</Card.Text>
                                    <Card.Text><strong>User ID:</strong> {order.user_id}</Card.Text>
                                    <Card.Text><strong>Product ID:</strong> {order.Productid}</Card.Text>
                                    <Card.Text><strong>Order Date:</strong> {order.orderDate}</Card.Text>
                                    <Card.Text><strong>Status:</strong> {order.status}</Card.Text>
                                    <Card.Text><strong>Quantity:</strong> {order.quantity}</Card.Text>
                                    <Card.Text><strong>Tracking ID:</strong> {order.trackingId}</Card.Text>
                                </Card.Body>
                            </Card>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default TrackOrder;
