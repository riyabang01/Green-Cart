import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'

const MyOrders = () => {
    const [myOrders, setMyOrders] = useState([])
    const { currency, axios, user } = useAppContext()

    const fetchMyOrders = async () => {
        try {
            const { data } = await axios.get('/api/order/user')
            if (data.success) {
                setMyOrders(data.orders)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (user) {
            fetchMyOrders()
        }
    }, [user])

    return (
        <div className='mt-16 pb-16'>
            <div className='flex flex-col items-end w-max mb-8'>
                <p className='text-2xl font-medium uppercase'>My Orders</p>
                <div className='w-16 h-0.5 bg-primary rounded-full'></div>
            </div>
            {myOrders.map((order, index) => (
                <div key={index} className='border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl bg-white shadow-sm'>
                    <p className='flex justify-between md:items-center text-gray-500 font-medium pb-3 border-b border-gray-100 max-md:flex-col gap-2'>
                        <span>OrderId: <span className='text-gray-800 font-normal'>{order._id}</span></span>
                        <span>Payment: <span className='font-semibold text-green-600'>{order.paymentType === 'Online' ? 'Online' : 'COD'}</span></span>
                        <span>Total Amount: <span className='text-indigo-600 font-semibold'>{currency}{order.amount}</span></span>
                    </p>
                    {order.items.map((item, idx) => (
                        <div key={idx} className={`text-gray-600 ${order.items.length !== idx + 1 && "border-b"} border-gray-200 flex flex-col md:flex-row md:items-center justify-between py-5 gap-4`}>
                            <div className='flex items-center gap-4 flex-1'>
                                <div className='bg-gray-100 p-2 rounded-lg flex-shrink-0 w-20 h-20 flex items-center justify-center border border-gray-200 overflow-hidden'>
                                    <img src={item.product?.image?.[0]} alt={item.product?.name} className='max-w-full h-full object-cover' />
                                </div>
                                <div>
                                    <h2 className='text-lg font-semibold text-gray-800 line-clamp-1'>{item.product?.name}</h2>
                                    <p className='text-sm text-gray-400'>Category: {item.product?.category}</p>
                                    <p className='text-sm text-gray-700 mt-1 md:hidden'>Qty: {item.quantity || 1}</p>
                                </div>
                            </div>

                            <div className='flex flex-wrap md:flex-nowrap items-center justify-between md:gap-12 max-md:bg-gray-50 max-md:p-3 max-md:rounded-lg text-sm md:text-base'>
                                <p className='hidden md:block font-medium text-gray-700'>Qty: {item.quantity || 1}</p>
                                <div>
                                    <p className='text-gray-400 text-xs md:text-sm'>Status</p>
                                    <p className='font-medium text-green-600'>{order.status || 'Order Placed'}</p>
                                </div>
                                <div>
                                    <p className='text-gray-400 text-xs md:text-sm'>Date</p>
                                    <p className='font-medium text-gray-700'>{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className='text-right min-w-[80px]'>
                                    <p className='text-gray-400 text-xs md:text-sm'>Amount</p>
                                    <p className='font-semibold text-gray-900'>{currency}{item.product?.offerPrice * (item.quantity || 1)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default MyOrders
