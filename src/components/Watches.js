import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Header';

const Watches = () => {
  const [watches, setWatches] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchWatches = async () => {
      try {
        const response = await axios.get('/getAllProducts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWatches(response.data);
        setDisplayedProducts(response.data);
      } catch (error) {
        console.error('Error fetching watches:', error);
        setError('Failed to fetch watches. Please check the console for more details.');
      }
    };

    fetchWatches();
  }, [token]);

  const addToCart = async (productId) => {
    try {
      console.log(`Adding to cart: userId=${userId}, productId=${productId}`);
      const response = await axios.post(`/api/add/${userId}/${productId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(`Response status: ${response.status}`);

      if (response.status === 200) {
        alert('Item added to cart successfully');
      } else {
        alert('Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      alert('Failed to add item to cart. Please check the console for more details.');
    }
  };

  return (
    <>
      <Header setDisplayedProducts={setDisplayedProducts} setError={setError} />
      <div className="container mt-5">
        <h1 className="text-center mb-5 text-primary">Luxury Watches Collection</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="row">
          {displayedProducts.map((watch) => (
            <div key={watch.productId} className="col-lg-4 col-md-6 mb-4">
              <div className="card h-100 shadow-lg border-0 hover-effect">
                <div className="card-img-top-wrapper" style={{ height: '250px', overflow: 'hidden' }}>
                  <img
                    src={watch.image}
                    className="card-img-top img-fluid h-100 w-100"
                    alt={watch.modelNumber}
                    style={{ objectFit: 'cover', transition: 'transform 0.3s ease-in-out' }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onError={(e) => {
                      console.error(`Failed to load image for watch: ${watch.modelNumber}`);
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/250';
                    }}
                  />
                </div>
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="card-title text-center mb-3">{watch.brand}</h5>
                    <h6 className="card-subtitle mb-3 text-muted text-center">{watch.modelNumber}</h6>
                    <h6 className="card-subtitle mb-3 text-muted text-center">{watch.productName}</h6>
                  </div>
                  <div className="text-center">
                    <p className="card-text mb-2"><strong>Price:</strong> <span className="text-success">${watch.price.toFixed(2)}</span></p>
                    <p className="card-text mb-3"><strong>In Stock:</strong> <span className="text-info">{watch.quantity}</span></p>
                    <div className="d-grid gap-2">
                      <button className="btn btn-outline-primary btn-lg" onClick={() => addToCart(watch.productid)}>Add to Cart</button>
                      <button className="btn btn-primary btn-lg">Buy Now</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Watches;
