import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import axios from 'axios'

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.MODE === 'production' ? '' : 'http://localhost:4000';

const AppContext = createContext();

export const AppContextProvider = ({children})=> {

    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();

    const[user, setUser] = useState(null)
    const [token, setToken] = useState(
        localStorage.getItem('token') || 
        localStorage.getItem('auth-token') || 
        localStorage.getItem('jwt') || 
        localStorage.getItem('userToken') || 
        ''
    )
    const[isSeller, setIsSeller] = useState(false)
    const[showUserLogin, setShowUserLogin] = useState(false)
    const[products, setProducts] = useState([])
    const[loading, setLoading] = useState(true)

    const[cartItems, setCartItems] = useState({})
    const[searchQuery, setSearchQuery] = useState({})
    const[isInitialMount, setIsInitialMount] = useState(true) 

    const fetchSeller = async ()=> {
        try {
            const {data} = await axios.post('/api/seller/is-auth', {}, { headers: { token } })
            if(data.success) {
                setIsSeller(true)
                localStorage.setItem('isSellerLoggedIn', 'true')
            } else {
                setIsSeller(false)
                localStorage.removeItem('isSellerLoggedIn')
            }
        } catch (error) {
            setIsSeller(false)
            localStorage.removeItem('isSellerLoggedIn')
        } finally {
            setLoading(false)
        }
    }

    const fetchUser = async ()=> {
        try {
            const {data} = await axios.get('/api/user/is-auth', { headers: { token } })
             if(data.success) {
                setUser(data.user)
                if (data.user.cartItems) {
                    setCartItems(data.user.cartItems)
                }
            }
        } catch (error) {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    const fetchProducts = async ()=> {
        try {
            const {data} = await axios.get('/api/product/list')
            if (data.success) {
                setProducts(data.products)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
             toast.error(error.message)
        }
    }

    const addToCart = (itemID)=> {
        let cartData = structuredClone(cartItems);
        if(cartData[itemID]){
            cartData[itemID] += 1
        } else {
            cartData[itemID] = 1
        }
        setCartItems(cartData);
        toast.success('Added to Cart')
    }

    const updateCartItem = (itemID, quantity)=> {
        let cartData = structuredClone(cartItems)
        cartData[itemID] = quantity;
        setCartItems(cartData);
        toast.success('Cart Updated')
    }

    const removeFromCart = (itemID)=> {
        let cartData = structuredClone(cartItems)
        if(cartData[itemID]) {
            cartData[itemID] -= 1;
            if(cartData[itemID] <= 0) {
                delete cartData[itemID];
            }
        } 
        toast.success('Removed from Cart')
        setCartItems(cartData)
    }

    const getCartCount = ()=> {
        let totalCount = 0;
        for(const item in cartItems){
            totalCount += cartItems[item];
        }
        return totalCount
    }

    const getCartAmount = ()=> {
        let totalAmount = 0;
        if (!products || products.length === 0) return 0; 

        for(const items in cartItems){
            let itemInfo = products.find((product)=> product?._id === items);
            if(cartItems[items] > 0 && itemInfo) {
                totalAmount += (itemInfo.offerPrice || 0) * cartItems[items]
            }
        }
        return Math.floor(totalAmount * 100 / 100);
    }

    useEffect(()=> {
        if(token) {
            fetchUser()
            fetchSeller();
        } else {
            setLoading(false)
        }
        fetchProducts();
    },[token])

    useEffect(()=> {
        const updateCart = async ()=> {
            try {
                const {data} = await axios.post('/api/cart/update', {cartItems}, { headers: { token } })
                if(!data.success) {
                    toast.error(data.message)
                }
            } catch (error) {
                toast.error(error.message)
            }
        }

        if (isInitialMount) {
            setIsInitialMount(false);
            return;
        }

        if(user) {
            updateCart()
        }
    }, [cartItems])

    const value = {navigate, user, setUser, isSeller, setIsSeller, showUserLogin, setShowUserLogin, products, currency, addToCart, updateCartItem, removeFromCart, cartItems, searchQuery, setSearchQuery, getCartAmount, getCartCount, axios, loading, fetchProducts, setCartItems, token, setToken}

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = ()=> {
    return useContext(AppContext)
}
