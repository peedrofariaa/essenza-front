import { Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import TopBar from './components/TopBar'
import Home from './pages/Home'
import CreateUser from './pages/CreateUser'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import MyAccount from './pages/MyAccount'
import ResetPassword from './pages/ResetPassword'
import Footer from './components/Footer'
import Category from './pages/Category'
import Product from './pages/Product'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import OrderPending from './pages/OrderPending'
import OrderFailure from './pages/OrderFailure'
import Aromas from './pages/Aromas'
import About from './pages/About'
import ScrollToTop from './components/ScrollToTop'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfUse from './pages/TermsOfUse'

function App() {
  return (
    <>
      <TopBar />
      <Header />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-user" element={<CreateUser />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/me" element={<MyAccount />} />
        <Route path="/categoria/:slug" element={<Category />} />
        <Route path="/produto/:slug" element={<Product />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/pedido/sucesso" element={<OrderSuccess />} />
        <Route path="/pedido/pendente" element={<OrderPending />} />
        <Route path="/pedido/falha" element={<OrderFailure />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/aromas" element={<Aromas />} />
        <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
        <Route path="/termos-de-uso" element={<TermsOfUse />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
