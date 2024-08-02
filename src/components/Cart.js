import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faTrash, faSpinner, faCreditCard, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import CommonHeader from './CommonHeader'; // Import CommonHeader

const Cart = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartProducts();
  }, []);

  const fetchCartProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      setCartProducts(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching cart products:', err);
      setError('Failed to fetch cart products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, change) => {
    try {
      const product = cartProducts.find(p => p.productid === productId);
      const newQuantity = Math.max(product.quantity + change, 0);
  
      if (newQuantity === 0) {
        // Call the delete API if the quantity is 0
        await deleteCartItem(productId);
        return;
      }
  
      const apiUrl = change > 0
        ? `/api/increaseQuantity/${userId}/${productId}/${change}`
        : `/api/decreaseQuantity/${userId}/${productId}/${-change}`;
  
      const response = await axios.put(apiUrl, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        setCartProducts(prevProducts => prevProducts.map(p =>
          p.productid === productId ? { ...p, quantity: newQuantity } : p
        ));
      } else {
        alert('Failed to update quantity. Please try again.');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity. Please try again.');
    }
  };

  const deleteCartItem = async (productId) => {
    try {
      const response = await axios.delete(`/api/delete/${userId}/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      if (response.status === 200) {
        setCartProducts(prevProducts => prevProducts.filter(product => product.productid !== productId));
        alert('Item removed from cart successfully');
      } else {
        alert('Failed to remove item from cart');
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      alert('Failed to remove item from cart. Please try again.');
    }
  };

  const deleteAllCartProducts = async () => {
    try {
      const response = await axios.delete(`/api/clear/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setCartProducts([]);
        alert('All items removed from cart successfully');
      } else {
        alert('Failed to clear cart');
      }
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError('Failed to delete all items from cart. Please try again.');
    }
  };

  const totalAmount = cartProducts.reduce((total, product) => total + (product.price * product.quantity), 0);

  const handleBuyNowClick = async () => {
  setLoading(true);
  try {
    // Create an array of promises for each cart item
    const promises = cartProducts.map((product) =>
      axios.post(
        `/create/${userId}/${product.productid}/${product.quantity}`,
        {
          user_id: userId,
          productId: product.productid,
          quantity: product.quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
    );
    
    // Wait for all promises to resolve
    await Promise.all(promises);
    
    // Clear the cart
    await axios.delete(`/api/clear/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Clear the cart state
    setCartProducts([]); // Ensure this is done after successful order placement
    setLoading(false);
    
    // Redirect to orders page
    navigate('/orders'); 
  } catch (err) {
    console.error('Error placing order:', err);
    setError('Failed to place order. Please try again.');
    setLoading(false);
  }
};
  
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
      </div>
    );
  }

  return (
    <div>
      <CommonHeader userId={userId} />
      <div className="container mt-5">
        <h2 className="text-center mb-4">
          <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
          Your Shopping Cart
        </h2>
        {error && <div className="alert alert-danger">{error}</div>}
        
        <div className="row">
          <div className="col-md-12">
            <div className="card border-light shadow-lg rounded">
              <div className="card-body">
                <h5 className="card-title mb-4">Cart Items</h5>
                {cartProducts.length === 0 ? (
                  <p className="text-muted text-center">Your cart is empty</p>
                ) : (
                  <ul className="list-group">
                    {cartProducts.map((product) => (
                      <li key={product.productid} className="list-group-item d-flex flex-column flex-md-row align-items-center border-0 rounded shadow-sm mb-3 bg-light">
                        <div className="d-flex align-items-center me-3 mb-3 mb-md-0">
                          <img
                            src={product.image || 'https://via.placeholder.com/100'}
                            alt={product.productName}
                            className="img-fluid rounded"
                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                          />
                          <div className="ms-3">
                            <h6 className="my-0">{product.productName}</h6>
                            <small className="text-muted d-block">Brand: {product.brand}</small>
                            <small className="text-muted d-block">Price: ${product.price.toFixed(2)}</small>
                          </div>
                        </div>
                        <div className="d-flex align-items-center ms-auto">
                          <button 
                            className="btn btn-outline-secondary btn-sm me-2"
                            onClick={() => updateQuantity(product.productid, -1)}
                            disabled={product.quantity <= 1}
                          >
                            <FontAwesomeIcon icon={faMinus} />
                          </button>
                          <span className="h5 mx-2">{product.quantity}</span>
                          <button 
                            className="btn btn-outline-secondary btn-sm ms-2"
                            onClick={() => updateQuantity(product.productid, 1)}
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </button>
                          <button className="btn btn-danger btn-sm ms-3" onClick={() => deleteCartItem(product.productid)}>
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="card-footer bg-light border-top-0 text-end">
                <h4 className="mb-3">Total Amount: <span className="text-success">${totalAmount.toFixed(2)}</span></h4>
                <button className="btn btn-primary btn-lg w-100 mb-3" onClick={handleBuyNowClick}>
                  <FontAwesomeIcon icon={faCreditCard} className="me-2" />
                  Buy Now
                </button>
                <button className="btn btn-warning btn-lg w-100" onClick={deleteAllCartProducts} disabled={cartProducts.length === 0}>
                  <FontAwesomeIcon icon={faTrash} className="me-2" />
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
