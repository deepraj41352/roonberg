import './App.css';
import ForgetPassword from './Screens/ForgetPasswordScreen';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ResetPasswordScreen from './Screens/ResetPasswordScreen';
import { ToastContainer } from 'react-toastify';
import NavbarLogin from './Components/NavbarLogin';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import SignUpForm from './Screens/SignUpScreen';
import RegistrationForm from './Screens/RegistrationScreen';
import React from 'react';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavbarLogin />
        <ToastContainer position="bottom-center" limit={1} />
        <Routes>
          <Route path="/" element={<SignUpForm />} />
          <Route path="/registration" element={<RegistrationForm />} />
          <Route path="/ForgetPassword" element={<ForgetPassword />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordScreen />}
          />
          <Route />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
