import { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const SellerLogin = () => {
  const { isSeller, setIsSeller, navigate, axios } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailType, setEmailType] = useState('text');

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post('/api/seller/login', { email, password });
      if (data.success) {
        localStorage.setItem('isSellerLoggedIn', 'true'); 
        setIsSeller(true);
        navigate('/seller');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Server connection failed.";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    if (isSeller) {
      navigate('/seller');
    }
  }, [isSeller, navigate]);

  return (
    !isSeller && (
      <div className="min-h-screen flex items-center text-sm text-gray-600 w-full">
        <form style={{ display: 'none' }}><input type="password" /></form>
        
        <form onSubmit={onSubmitHandler} className="m-auto flex w-full justify-center">
          <div className="flex flex-col gap-5 items-start p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-gray-200 bg-white">
            <p className="text-2xl font-medium m-auto">
              <span className="text-primary">Seller </span>Login
            </p>
            <div className="w-full">
              <p>Email</p>
              <input 
                type={emailType}
                name="email"
                id="seller_email_input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setEmailType('email')}
                placeholder="Enter your email" 
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" 
                autoComplete="email"
                required 
              />
            </div>
            <div className="w-full">
              <p>Password</p>
              <input 
                type="password" 
                name="password"
                id="seller_password_input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password" 
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" 
                autoComplete="new-password"
                required 
              />
            </div>
            <button className="bg-primary text-white w-full py-2 rounded-md cursor-pointer">Login</button>
          </div>
        </form>
      </div>
    )
  );
};

export default SellerLogin;
