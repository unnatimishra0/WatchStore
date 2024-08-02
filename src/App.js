import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Watches from './components/Watches';
import {Routes,Route} from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/NavBar';
import Register from './components/Register';
import Header from './components/Header';
import AdminDashboard from './components/AdminDashboard';
import Cart from './components/Cart';
import Analytics from './components/Analytics';
import OrderList from './components/OrderList';
import TrackOrder from './components/TrackOrder';


const App = () => {
  // const[login,setLogin]=useState([]);
  // const [token, setToken] = useState(localStorage.getItem('token'));

  // useEffect(() => {
  //   if (token) {
  //     console.log('Setting token in local storage:', token); 
  //     localStorage.setItem('token', token);
  //   } else {
  //     localStorage.removeItem('token');
  //   }
  // }, [token]);

  return (

    <div className="App">
      <Routes>
      <Route path='/' element={<Login></Login>}></Route>
      {/* <Route path='/' element={<Login setToken={setToken} />} /> */}
      <Route path="/header" element={<Header></Header>}></Route>
<Route path="/products/all" element={<NavBar></NavBar>}></Route>
      <Route path='/watches' element={<Watches></Watches>}></Route>
      <Route path="/admin" element={<AdminDashboard></AdminDashboard>}></Route>
      <Route path="/cart" element={<Cart></Cart>}></Route>
      <Route path="/analytics" element={<Analytics></Analytics>}></Route>
      <Route path="/orders" element={<OrderList></OrderList>}></Route>
      <Route path="/trackOrder" element={<TrackOrder></TrackOrder>}></Route>
      <Route path="/register" element={<Register></Register>}
      
      
      ></Route>
      
    </Routes>

      {/* <Login/> */}
      {/* {token ? <Watches token={token} /> : <Login setToken={setToken} />} */}
    </div>
  );
};

export default App;
