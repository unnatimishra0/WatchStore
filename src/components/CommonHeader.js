import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faSignOutAlt, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { Dropdown, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const CommonHeader = ({ userId, cartCount }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    localStorage.removeItem("categories")
    localStorage.removeItem("content")
    localStorage.removeItem("title")
    localStorage.removeItem("list")




    navigate('/');
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleProfileClick = () => {
    navigate(`/profile/${userId}`);
  };

  const handleTrackOrderClick = () => {
    navigate("/trackOrder");
  };

  const handleMyOrdersClick = () => {
    navigate("/orders");
  };

  return (
    <header className="bg-primary text-white p-3 shadow-sm mb-4">
      <div className="container d-flex justify-content-between align-items-center">
        <h1 className="h4 mb-0">
          <FontAwesomeIcon icon={faHome} className="me-2" />
          My E-Commerce
        </h1>
        <div className="d-flex align-items-center">
          <Button
            variant="link"
            onClick={handleCartClick}
            className="position-relative me-3 text-white"
          >
            <FontAwesomeIcon icon={faShoppingCart} size="lg" />
            {cartCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cartCount}
                <span className="visually-hidden">cart items</span>
              </span>
            )}
          </Button>
          <Dropdown>
            <Dropdown.Toggle variant="link" id="dropdown-basic" className="text-white">
              <FontAwesomeIcon icon={faUser} size="lg" />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleProfileClick}>Profile</Dropdown.Item>
              <Dropdown.Item onClick={handleTrackOrderClick}>Track Order</Dropdown.Item>
              <Dropdown.Item onClick={handleMyOrdersClick}>My Orders</Dropdown.Item>
              <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};

export default CommonHeader;
