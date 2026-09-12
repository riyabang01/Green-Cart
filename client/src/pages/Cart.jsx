
import { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import toast from 'react-hot-toast'

const Cart = () => {
    const {
        products, currency, cartItems, removeFromCart, getCartCount, updateCartItem, navigate, getCartAmount, axios, user, setCartItems } = useAppContext()

    const [cartArray, setCartArray] = useState([])
    const [addresses, setAddresses] = useState([])
    const [showAddress, setShowAddress] = useState(false)
    const [selectedAddress, setSelectedAddress] = useState(null)
    const [paymentOption, setPaymentOption] = useState('COD')

    const getCart = () => {
        let tempArray = []
        for (const key in cartItems) {
            if (cartItems[key] > 0) {
                const product = products.find((item) => item?._id === key)
                if (product) {
                    const updatedProduct = { ...product, quantity: cartItems[key] }
                    tempArray.push(updatedProduct)
                }
            }
        }
        setCartArray(tempArray)
    }

    const getUserAddress = async () => {
        try {
            const { data } = await axios.get('/api/address/get')
            if (data.success) {
                setAddresses(data.addresses)
                if (data.addresses.length > 0) {
                    setSelectedAddress(data.addresses[0])
                }
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const placeOrder = async () => {
        try {
            if (!selectedAddress) {
                toast.error('Please select an address')
                return
            }

            const orderData = {
                userId: user?._id,
                items: cartArray.map((item) => ({ product: item?._id, quantity: item.quantity })),
                address: selectedAddress?._id
            }

            if (paymentOption === 'COD') {
                const { data } = await axios.post('/api/order/cod', orderData)
                if (data.success) {
                    toast.success(data.message)
                    setCartItems({})
                    navigate('/my-orders')
                } else {
                    toast.error(data.message)
                }
            } else {
                const { data } = await axios.post('/api/order/stripe', orderData)
                if (data.success && data.url) {
                    setCartItems({})
                    window.location.replace(data.url)
                } else {
                    toast.error(data.message || 'Stripe redirect generation failed')
                }
            }
        } catch (error) {
            if (error.response?.status === 401) {
                toast.error('Session expired. Please login again.')
                navigate('/login')
            } else {
                toast.error(error.response?.data?.message || error.message)
            }
        }
    }

    useEffect(() => {
        if (products.length > 0 && cartItems) {
            getCart()
        }
    }, [products, cartItems])

    useEffect(() => {
        if (user) {
            getUserAddress()
        }
    }, [user])

    return products.length > 0 && cartItems ? (
        <div className="flex flex-col md:flex-row mt-16 gap-10 max-w-7xl mx-auto px-4">
            <div className="flex-1 max-w-4xl">
                <h1 className="text-3xl font-medium mb-6">
                    Shopping Cart <span className="text-sm text-gray-500">{getCartCount()} Items</span>
                </h1>
                <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3 border-b border-gray-200">
                    <p className="text-left">Product Details</p>
                    <p className="text-center">Subtotal</p>
                    <p className="text-center">Action</p>
                </div>
                {cartArray.length === 0 ? (
                    <p className="text-gray-500 text-center py-10">Your cart is empty.</p>
                ) : (
                    cartArray.map((product, index) => (
                        <div key={index} className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3 pb-3 border-b border-gray-100">
                            <div
                                onClick={() => {
                                    navigate(`/products/${product.category?.toLowerCase() || 'all'}/${product?._id}`)
                                    window.scrollTo(0, 0)
                                }}
                                className="flex items-center md:gap-6 gap-3 cursor-pointer"
                            >
                                <div className="w-24 h-24 flex items-center justify-center border border-gray-300 rounded overflow-hidden flex-shrink-0">
                                    <img className="max-w-full h-full object-cover" src={product.image?.[0]} alt={product.name} />
                                </div>
                                <div>
                                    <p className="hidden md:block font-semibold text-gray-800">{product.name}</p>
                                    <div className="font-normal text-gray-500/70">
                                        <p>Weight: <span>{product.weight || 'N/A'}</span></p>
                                        <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                                            <p>Qty:</p>
                                            <select
                                                onChange={(e) => {
                                                    e.stopPropagation()
                                                    updateCartItem(product?._id, Number(e.target.value))
                                                }}
                                                value={cartItems[product?._id] || 1}
                                                className="outline-none bg-transparent cursor-pointer font-medium ml-1"
                                            >
                                                {Array.from({ length: Math.max(9, cartItems[product?._id] || 0) })
                                                    .map((_, index) => (
                                                        <option key={index} value={index + 1}>{index + 1}</option>
                                                    ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-center text-gray-800">{currency}{product.offerPrice * product.quantity}</p>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    removeFromCart(product?._id)
                                }}
                                className="cursor-pointer mx-auto"
                            >
                                <img src={assets.remove_icon} alt="remove" className="inline-block w-6 h-6" />
                            </button>
                        </div>
                    ))
                )}
                <button
                    onClick={() => {
                        navigate('/products')
                        window.scrollTo(0, 0)
                    }}
                    className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium"
                >
                    <img className="group-hover:-translate-x-1 transition" src={assets.arrow_right_icon_colored} alt="arrow" />
                    Continue Shopping
                </button>
            </div>

            <div className="max-w-[360px] w-full bg-gray-100/40 p-5 border border-gray-300/70 h-fit rounded shadow-sm">
                <h2 className="text-xl font-medium">Order Summary</h2>
                <hr className="border-gray-300 my-5" />

                <div className="mb-6">
                    <p className="text-sm font-medium uppercase text-gray-700">Delivery Address</p>
                    <div className="relative flex justify-between items-start mt-2">
                        <p className="text-gray-500 text-sm leading-relaxed pr-2">
                            {selectedAddress
                                ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`
                                : 'No address found'}
                        </p>
                        <button onClick={() => setShowAddress(!showAddress)} className="text-primary hover:underline cursor-pointer text-sm font-medium flex-shrink-0">
                            Change
                        </button>
                        {showAddress && (
                            <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full z-10 shadow-lg rounded">
                                {addresses.map((address, index) => (
                                    <p
                                        key={index}
                                        onClick={() => {
                                            setSelectedAddress(address)
                                            setShowAddress(false)
                                        }}
                                        className="text-gray-500 p-2 hover:bg-gray-100 cursor-pointer"
                                    >
                                        {address.street}, {address.city}, {address.state}, {address.country}
                                    </p>
                                ))}
                                <p onClick={() => navigate('/add-address')} className="text-primary text-center cursor-pointer p-2 hover:bg-primary/10 border-t border-gray-100 font-medium">
                                    Add address
                                </p>
                            </div>
                        )}
                    </div>
                </div>


                <div className="mb-6">
                    <p className="text-sm font-medium uppercase text-gray-700 mb-3">Payment Method</p>
                    <div className="relative">
                        <select
                            value={paymentOption}
                            onChange={(e) => setPaymentOption(e.target.value)}
                            className="w-full p-3 bg-white border border-gray-300 rounded outline-none cursor-pointer text-sm font-medium text-gray-700 transition focus:border-primary focus:ring-1 focus:ring-primary"
                        >
                            <option value="COD">Cash on Delivery (COD)</option>
                            <option value="Stripe">Online</option>
                        </select>
                    </div>
                </div>

         
                <div className="space-y-2 text-sm text-gray-600 mt-5 border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                        <p>Price</p>
                        <p>{currency}{getCartAmount()}</p>
                    </div>
                    <div className="flex justify-between">
                        <p>Shipping Fee</p>
                        <p className="text-green-600 font-medium">Free</p>
                    </div>
                    <div className="flex justify-between">
                        <p>Tax (2%)</p>
                        <p>{currency}{(getCartAmount() * 0.02).toFixed(2)}</p>
                    </div>
                    <hr className="border-gray-300" />
                    <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Total Amount</p>
                        <p>{currency}{(getCartAmount() + getCartAmount() * 0.02).toFixed(2)}</p>
                    </div>
                </div>

              
                <button
                    onClick={placeOrder}
                    className="w-full mt-6 bg-primary text-white py-3 hover:bg-primary-dull transition cursor-pointer uppercase font-medium text-sm tracking-wider rounded"
                >
                    {paymentOption === 'COD' ? 'Place Order' : 'Proceed to Checkout'}
                </button>
            </div>
        </div>
    ) : null
}

export default Cart
