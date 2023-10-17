import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from './pages/Login';
import ErrorElement from './components/ErrorElement';
import Register from './pages/Register';

import styled from 'styled-components';
import Cart from './pages/Cart';
import { Dashboard } from './pages/AdminPages/Dashboard';
import Product from './pages/AdminPages/Product';
import { User } from './pages/AdminPages/User';
import ProductAdd from './pages/AdminPages/ProductAdd';
import ProductEdit from './pages/AdminPages/ProductEdit';
const StyledText = styled.div`
    font-family: 'Poppins',sans-serif;
    font-weight: 500
`;

const router  = createBrowserRouter([
  {
    path:"/",
    element:<App />,
    errorElement:<ErrorElement />
  },
  {
    path:"/Login",
    element:<Login />,
    errorElement:<ErrorElement />
  },
  {
    path:"/Register",
    element:<Register />,
    errorElement:<ErrorElement />
  },
  {
    path:"/Cart",
    element:<Cart />,
    errorElement:<ErrorElement />
  },{
    path:"/admin/Dashboard",
    element:<Dashboard />,
    errorElement:<ErrorElement />
  }
  ,{
    path:"/admin/Products",
    element:<Product />,
    errorElement:<ErrorElement />
  }
  ,{
    path:"/admin/Users",
    element:<User />,
    errorElement:<ErrorElement />
  }
  ,{
    path:"/admin/ProductAdd",
    element:<ProductAdd />,
    errorElement:<ErrorElement />
  }
  ,{
    path:"/admin/ProductEdit/:product_id",
    element:<ProductEdit />,
    errorElement:<ErrorElement />
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <StyledText>
      <RouterProvider router={router} />
    </StyledText>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
