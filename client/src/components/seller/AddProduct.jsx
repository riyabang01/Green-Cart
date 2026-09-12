import { useState } from "react"; 
import { assets, categories } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddProduct = () => {
    const { axios } = useAppContext();
    const [files, setFiles] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [offerPrice, setOfferPrice] = useState('');

    const onSubmitHandler = async (event) => {
        try {
            event.preventDefault();

            const productData = {
                name,
                description: description.split('\n'),
                category,
                price,
                offerPrice
            };

            const formData = new FormData();
            formData.append('productData', JSON.stringify(productData));

            files.forEach((file) => {
                if (file) {
                    formData.append('images', file);
                }
            });

            const token = localStorage.getItem('sellerToken');

            const { data } = await axios.post('/api/product/add', formData, {
                headers: {
                    'token': token
                }
            });

            if (data.success) {
                toast.success(data.message);
                setName('');
                setDescription('');
                setCategory('');
                setPrice('');
                setOfferPrice('');
                setFiles([]);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-50/50 flex flex-col justify-start items-start md:p-10 p-4">
            <form onSubmit={onSubmitHandler} className="w-full max-w-lg bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
                <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Product Image</p>
                    <div className="flex flex-wrap items-center gap-3">
                        {Array(4).fill('').map((_, index) => (
                            <label key={index} htmlFor={`image${index}`} className="block">
                                <input 
                                    onChange={(e) => { 
                                        if (e.target.files && e.target.files[0]) {
                                            const updatedFiles = [...files];
                                            updatedFiles[index] = e.target.files[0];
                                            setFiles(updatedFiles);
                                        }
                                    }}
                                    type="file" 
                                    id={`image${index}`} 
                                    hidden 
                                />
                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden hover:border-primary transition-colors cursor-pointer">
                                    <img 
                                        className="w-full h-full object-cover" 
                                        src={(files[index] instanceof File) ? URL.createObjectURL(files[index]) : assets.upload_area}
                                        alt="uploadArea" 
                                    />
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-sm font-semibold text-gray-700" htmlFor="product-name">Product Name</label>
                    <input 
                        id="product-name" 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder="Type here" 
                        className="w-full outline-none py-2 px-3 text-sm rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                        required 
                    />
                </div>

                <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-sm font-semibold text-gray-700" htmlFor="product-description">Product Description</label>
                    <textarea 
                        id="product-description" 
                        rows={3} 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        className="w-full outline-none py-2 px-3 text-sm rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary resize-none transition-all" 
                        placeholder="Type here"
                    />
                </div>

                <div className="w-full flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-700" htmlFor="category">Category</label>
                    <select 
                        id="category" 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full outline-none py-2 px-3 text-sm bg-white rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    >
                        <option value="">Select Category</option>
                        {categories.map((item, index) => (
                            <option key={index} value={item.path || item.name || item}>{item.name || item.path || item}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-4 w-full">
                    <div className="flex-1 flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-gray-700" htmlFor="product-price">Price</label>
                        <input 
                            id="product-price" 
                            type="number" 
                            value={price} 
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="0" 
                            className="w-full outline-none py-2 px-3 text-sm rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                            required 
                        />
                    </div>
                    <div className="flex-1 flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-gray-700" htmlFor="offer-price">Offer Price</label>
                        <input 
                            id="offer-price" 
                            type="number" 
                            value={offerPrice} 
                            onChange={(e) => setOfferPrice(e.target.value)}
                            placeholder="0" 
                            className="w-full outline-none py-2 px-3 text-sm rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                            required 
                        />
                    </div>
                </div>

                <button className="w-full py-2.5 bg-primary hover:bg-primary-dull text-white font-medium text-sm rounded-lg shadow-sm transition-colors cursor-pointer mt-2">
                    ADD PRODUCT
                </button>
            </form>
        </div>
    );
};

export default AddProduct;
