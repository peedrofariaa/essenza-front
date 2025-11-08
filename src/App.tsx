import {  Route, Routes } from 'react-router-dom';
import Header from './components/Header'
import TopBar from './components/TopBar'
import Home from './pages/Home'
import CreateUser from './pages/CreateUser';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import MyAccount from './pages/MyAccount';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <>
      <TopBar />
      <Header />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/create-user' element={<CreateUser />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/me' element={<MyAccount />}/>
      </Routes>
    </>
  );
}

export default App;
