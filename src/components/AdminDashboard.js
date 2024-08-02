import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminNav from './AdminNav';
import AddProductForm from './AddProductForm';
import { Modal, Button } from 'react-bootstrap';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/getAllProducts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        alert('Failed to fetch products. Please check the console for more details.');
      }
    };

    fetchProducts();
  }, [token]);

  const handleAddProductClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsAddingProduct(false);
  };

  const handleProductAdded = () => {
    setIsAddingProduct(false);
    setShowModal(false);
    setProducts([]); // This will cause the useEffect to run again
  };

  const handleUpdateProduct = (productId) => {
    console.log(`Update product with ID: ${productId}`);
  };

  return (
    <>
      <AdminNav />
      <div className="container mt-5">
        <h1 className="text-center mb-4">Admin Dashboard</h1>
        <div className="row">
          <div className="col-lg-12 d-flex justify-content-end mb-4">
            <Button className="btn btn-success" onClick={handleAddProductClick}>
              Add Product
            </Button>
          </div>

          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Add New Product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <AddProductForm onProductAdded={handleProductAdded} />
            </Modal.Body>
          </Modal>

          {products.map((watch) => (
            <div key={watch.id} className="col-lg-4 col-md-6 mb-4">
              <div className="card h-100 shadow-sm hover-effect">
                <div className="card-img-top-wrapper" style={{ height: '250px', overflow: 'hidden' }}>
                  <img
                    src={watch.image}
                    className="card-img-top img-fluid h-100 w-100"
                    alt={watch.modelNumber}
                    style={{ objectFit: 'cover', transition: 'transform 0.3s ease-in-out' }}
                    onError={(e) => {
                      console.error(`Failed to load image for watch: ${watch.modelNumber}`);
                      e.target.onerror = null;
                    }}
                  />
                </div>
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="card-title text-center mb-3">{watch.brandName}</h5>
                    <h6 className="card-subtitle mb-3 text-muted text-center">{watch.modelNumber}</h6>
                  </div>
                  <div className="text-center">
                    <p className="card-text mb-2"><strong>Price:</strong> <span className="text-success">${watch.price.toFixed(2)}</span></p>
                    <p className="card-text mb-3"><strong>In Stock:</strong> <span className="text-info">{watch.quantity}</span></p>
                    <div className="d-grid">
                      <Button 
                        className="btn btn-primary"
                        onClick={() => handleUpdateProduct(watch.id)}
                      >
                        Update Product
                      </Button>
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

export default AdminDashboard;
