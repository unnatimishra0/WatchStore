import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import CommonHeader from './CommonHeader';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data.content); // `response.data.content` for page data
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to fetch orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId, token]); // Dependency array: refetch if userId or token changes

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
      </div>
    );
  }

  return (
    <>
      <CommonHeader userId={userId} />
      <div className="container mt-5">
        <h2 className="text-center mb-4">Your Orders</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {orders.length === 0 ? (
          <div className="alert alert-info text-center">No orders found</div>
        ) : (
          <div className="row">
            {orders.map(order => (
              <div key={order.orderId} className="col-md-6 col-lg-4 mb-4">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">Order ID: {order.orderId}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">Product ID: {order.Productid}</h6>
                    <p className="card-text">
                      <strong>User ID:</strong> {order.user_id}
                    </p>
                    <p className="card-text">
                      <strong>Date:</strong> {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                    <p className="card-text">
                      <strong>Status:</strong> {order.status}
                    </p>
                    <p className="card-text">
                      <strong>Quantity:</strong> {order.quantity}
                    </p>
                    <p className="card-text">
                      <strong>Tracking ID:</strong> {order.trackingId}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default OrderList;
