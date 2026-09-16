import { Route, Routes, useLocation, Navigate, Outlet, useNavigate } from 'react-router'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Login from './components/Login'
import Home from './pages/Home'
import AllProducts from './pages/AllProducts'
import ProductCategory from './pages/ProductCategory'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import AddAddress from './pages/AddAddress'
import MyOrders from './pages/MyOrders'
import SellerLogin from './components/seller/SellerLogin'
import SellerLayout from './pages/seller/SellerLayout'
import AddProduct from './components/seller/AddProduct'
import ProductList from './components/seller/ProductList'
import Orders from './components/seller/Orders'
import { useAppContext } from './context/AppContext'
import Loading from './components/Loading'

const App = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const isSellerPath = location.pathname.startsWith('/seller')
  const { showUserLogin, isSeller, loading, backendUrl, token } = useAppContext()
  
  const hasSellerSession = isSeller && localStorage.getItem('isSellerLoggedIn') === 'true'

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const isSuccess = queryParams.get('payment_success')
    const sessionId = queryParams.get('session_id')

    if (isSuccess === 'true' && sessionId) {
      const verifyPayment = async () => {
        try {
          const authToken = token || localStorage.getItem('token')
          if (!authToken) {
            return
          }

          const url = `${backendUrl || ''}/api/order/verify-stripe`
          const response = await axios.post(
            url, 
            { sessionId },
            { headers: { token: authToken } }
          )
          
          if (response.data.success) {
            toast.success("Payment Verified Successfully!")
            navigate('/my-orders', { replace: true })
          } else {
            toast.error("Payment verification failed.")
            navigate('/cart', { replace: true })
          }
        } catch (error) {
          console.error(error)
          toast.error("Something went wrong verifying payment.")
          navigate('/cart', { replace: true })
        }
      }
      verifyPayment()
    }
  }, [location, navigate, backendUrl, token])

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center text-gray-500'>
        Loading...
      </div>
    )
  }

  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'>
      {isSellerPath ? null : <Navbar />}
      {showUserLogin ? <Login /> : null}

      <Toaster />

      <div className={isSellerPath ? '' : 'px-6 md:px-16 lg:px-24 xl:px-32'}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/products' element={<AllProducts />} />
          <Route path='/products/:category' element={<ProductCategory />} />
          <Route path='/products/:category/:id' element={<ProductDetails />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/add-address' element={<AddAddress />} />
          <Route path='/my-orders' element={<MyOrders />} />
          <Route path='/loader' element={<Loading />} />
          
          <Route 
            path='/seller-login' 
            element={hasSellerSession ? <Navigate to="/seller" replace /> : <SellerLogin />} 
          />

          <Route element={hasSellerSession ? <Outlet /> : <Navigate to="/seller-login" replace />}>
            <Route path='/seller' element={<SellerLayout />}>
              <Route index element={<AddProduct />} />
              <Route path='product-list' element={<ProductList />} />
              <Route path='orders' element={<Orders />} />
            </Route>
          </Route>
        </Routes>
      </div>
      
      {!isSellerPath && <Footer />}
    </div>
  )
}

export default App
