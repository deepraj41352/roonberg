import './App.css';
import ForgetPassword from './Screens/ForgetPasswordScreen';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ResetPasswordScreen from './Screens/ResetPasswordScreen';
import { Nav, NavDropdown, Navbar } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import NavbarLogin from './Components/NavbarLogin';
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";
import SignUpForm from "./Screens/SignUpScreen";
import RegistrationForm from "./Screens/RegistrationScreen";
function App() {

  return (
    <div className="App">
      <NavbarLogin />
      <ToastContainer position='bottom-center' limit={1} />
      <BrowserRouter>
        <Routes>
          <Route path='/ForgetPassword' element={<ForgetPassword />} />
          <Route path='/resetPassword' element={<ResetPasswordScreen />} />
          <Route />
        </Routes>
      </BrowserRouter>
      <SignUpForm />
      <RegistrationForm />

    </div>
  );
}

export default App;

