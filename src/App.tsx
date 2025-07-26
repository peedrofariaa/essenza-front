import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header'
import TopBar from './components/TopBar'
import Home from './pages/Home'
import CreateUser from './pages/CreateUser';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';


function App() {
  return (
    <BrowserRouter>
      <TopBar />
      <Header />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/create-user' element={<CreateUser />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/forgot-password' element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
