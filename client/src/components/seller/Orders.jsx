import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext"
import { assets } from "../../assets/assets";
import toast from "react-hot-toast";

const Orders = () => {
  const { currency, axios } = useAppContext();
  const [orders, setOrders] = useState([])
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/api/order/seller')
      if (data.success) {
        setOrders(data.orders)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const updateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const { data } = await axios.post('/api/order/status', { orderId, status: newStatus });
      if (data.success) {
        toast.success("Order status updated");
        setOrders(prev => prev.map(order => order._id === orderId ? { ...order, status: newStatus } : order));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchOrders()
  }, [])

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-auto bg-gray-50/50">
      <div className="md:p-10 p-4 space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">Orders Management</h2>
        
        {orders && orders.length > 0 ? (
          orders.map((order) => (
            <div 
              key={order._id || order.createdAt} 
              className="flex flex-col lg:flex-row gap-6 justify-between p-6 max-w-5xl rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="flex gap-4 flex-1 min-w-[240px]">
                <img className="w-12 h-12 object-contain bg-gray-100 p-2 rounded" src={assets.box_icon} alt="Order Box" />
                <div className="space-y-1">
                  {order.items?.map((item, idx) => (
                    <p key={item.product?._id || idx} className="font-medium text-gray-800 text-sm md:text-base">
                      {item.product?.name || "Product Name Unavailable"}{' '} 
                      <span className='text-primary font-semibold ml-1'>x{item.quantity}</span>
                    </p>
                  ))}
                  <p className="text-xs text-gray-400 mt-2 font-mono">ID: {order._id}</p>
                </div>
              </div>

              <div className="text-sm text-gray-600 flex-1 min-w-[200px] border-t lg:border-t-0 lg:border-x border-gray-100 pt-4 lg:pt-0 lg:px-6">
                <p className='font-semibold text-gray-900 mb-1'>
                  {order.address?.firstName || ''} {order.address?.lastName || ''}
                </p>
                <div className="leading-relaxed">
                  <p>{order.address?.street || (typeof order.address === 'string' ? order.address : '')}</p>
                  <p>{order.address?.city || ''}{order.address?.state ? `, ${order.address.state}` : ''} {order.address?.zipcode || ''}</p>
                  <p>{order.address?.country || ''}</p>
                  <p className="mt-2 text-gray-800 font-medium">📞 {order.address?.phone || 'N/A'}</p>
                </div>
              </div>

              <div className="flex flex-col justify-center text-sm text-gray-600 space-y-1 min-w-[150px]">
                <p className="text-lg font-bold text-gray-900">{currency}{order.amount}</p>
                <p><span className="text-gray-400">Method:</span> {order.paymentType || order.paymentMethod}</p>
                <p><span className="text-gray-400">Date:</span> {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</p>
                <p>
                  <span className="text-gray-400">Payment:</span>{' '}
                  <span className={`font-medium ${order.isPaid ? 'text-green-600' : 'text-amber-600'}`}>
                    {order.isPaid ? "Paid" : "Pending"}
                  </span>
                </p>
              </div>

              <div className="flex items-center min-w-[160px] border-t lg:border-t-0 pt-4 lg:pt-0">
                <select 
                  disabled={updatingId === order._id}
                  value={order.status || "Order Placed"}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded bg-white text-sm font-medium text-gray-700 outline-none cursor-pointer focus:border-primary disabled:opacity-50"
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Packing">Packing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg bg-white max-w-5xl">
            <p className="text-gray-400 text-sm">No seller orders found in this system layout.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders
