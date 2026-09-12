import { useLocation } from "react-router";
import { useAppContext } from "../context/AppContext";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

const Loading = () => {
    const { navigate, axios } = useAppContext();
    let { search } = useLocation();
    const query = new URLSearchParams(search);
    const nextURL = query.get('next');
    const sessionId = query.get('session_id');
    const effectRan = useRef(false);

    useEffect(() => {
        if (effectRan.current) return;
        effectRan.current = true;

        const verifyPayment = async () => {
            if (sessionId) {
                try {
                    const { data } = await axios.post('/api/order/verify-stripe', { sessionId });
                    if (data.success) {
                        toast.success("Payment Successful!");
                    } else {
                        toast.error("Payment verification failed.");
                    }
                } catch (error) {
                    console.error(error);
                    toast.error("Error verifying payment.");
                }
            }
            
            if (nextURL) {
                navigate(`/${nextURL}`);
            } else {
                navigate('/my-orders');
            }
        };

        verifyPayment();
    }, [nextURL, sessionId, navigate, axios]);

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-24 w-24 border-4 border-gray-300 border-t-primary"></div>
        </div>
    );
};

export default Loading;
