import './App.css';
import ForgetPassword from './Screens/ForgetPasswordScreen';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ResetPasswordScreen from './Screens/ResetPasswordScreen';
import NavbarLogin from './Components/NavbarLogin';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import SignUpForm from './Screens/SignUpScreen';
import RegistrationForm from './Screens/RegistrationScreen';
import React from 'react';
import { ToastContainer } from 'react-bootstrap';
import AdminProjectListScreen from './Screens/AdminProjectListScreen';
import AdminAgentListScreen from './Screens/AdminAgentListScreen';
import AdminCategoriesListScreen from './Screens/AdminCategoriesListScreen';
import AdminListScreen from './Screens/AdminListScreen';
import AdminContractorListScreen from './Screens/AdminContractorListScreen';
import ProtectedRoute from './Components/ProtectedRoute';
import AdminDashboard from './Screens/AdminDashboard';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ToastContainer position="bottom-center" limit={1} />
        <NavbarLogin />
        <Routes>
          <Route path='/' element={<SignUpForm />} />
          <Route path='/registration' element={<RegistrationForm />} />
          <Route path='/ForgetPassword' element={<ForgetPassword />} />
          <Route path="/reset-password/:token" element={<ResetPasswordScreen />} />
          <Route path='/adminProjectList' element={<ProtectedRoute><AdminProjectListScreen /></ProtectedRoute>} />
          <Route path='/adminAgentList' element={<AdminAgentListScreen />} />
          <Route path='/adminCategoriesList' element={<AdminCategoriesListScreen />} />
          <Route path='/adminList' element={<AdminListScreen />} />
          <Route path='/adminContractorList' element={<AdminContractorListScreen />} />
          <Route path='/adminDashboard' element={<AdminDashboard />} />
          <Route />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
