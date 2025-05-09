import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App';
import Logout from './components/Logout.js';
import RegistrationForm from './forms/RegistrationForm.js';
import LoginForm from './forms/LoginForm.js';
import { AuthProvider } from './context/AuthContext';
import WalletPage from './components/WalletPage.js';
import StoresPage from './components/StoresPage.js';
import StorePage from './components/StorePage.js';
import MyStoresPage from './components/MyStoresPage.js';
import TransactionsPage from './components/TransactionsPage.js';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "wallet",
        element: <WalletPage />
      },
      {
        path: "stores",
        element: <StoresPage />
      },
      {
        path: "store/:id",
        element: <StorePage />
      },
      {
        path: "my-stores",
        element: <MyStoresPage />
      },
      {
        path: "transactions",
        element: <TransactionsPage />
      },
    ]
  },
  {
    path: "register",
    element: <RegistrationForm />
  },
  {
    path: "login",
    element: <LoginForm />
  },
  {
    path: "logout",
    element: <Logout />
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
