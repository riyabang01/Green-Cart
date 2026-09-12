import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({product}) => {
    const {currency, addToCart, removeFromCart, cartItems, navigate} = useAppContext()

    const handleCardClick = () => {
        if (product.inStock) {
            navigate(`/products/${product.category.toLowerCase()}/${product._id}`); 
            scrollTo(0,0);
        }
    };

    return product && (
        <div onClick={handleCardClick} className={`border border-gray-500/20 rounded-md md:px-4 px-3 py-3 bg-white w-full flex flex-col justify-between h-full relative ${product.inStock ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
            
            {!product.inStock && (
                <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] md:text-xs font-bold px-2 py-0.5 rounded z-10 uppercase tracking-wider">
                    Out of Stock
                </div>
            )}

            <div>
                <div className="group flex items-center justify-center px-2 aspect-square mb-2">
                    <img className={`transition max-h-32 object-contain ${product.inStock ? 'group-hover:scale-105' : 'opacity-40'}`} src={product.images ? product.images[0] : product.image[0]} alt={product.name} />
                </div>
                <div className="text-gray-500/60 text-sm">
                    <p className="text-xs">{product.category}</p>
                    <p className="text-gray-700 font-medium text-base md:text-lg truncate w-full mb-1">{product.name}</p>
                    <div className="flex items-center gap-0.5 mb-2">
                        {Array(5).fill('').map((_, i) => (
                            <img key={i} className="md:w-3.5 w-3" src={i < 4 ? assets.star_icon : assets.star_dull_icon} alt="star" />
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between mt-auto pt-2 gap-1">
                <p className="md:text-lg text-sm font-semibold text-primary truncate">
                   {currency}{product.offerPrice}{""} <span className="text-gray-500/60 md:text-sm text-xs line-through">{currency}{product.price}</span>
                </p>
                <div onClick={(e)=> e.stopPropagation()} className="text-primary flex-shrink-0">
                    {!product.inStock ? (
                        <button disabled className="flex items-center justify-center bg-red-50 border border-red-200 px-2 h-[34px] text-xs font-semibold rounded text-red-600 cursor-not-allowed min-w-[75px] md:min-w-[85px]">
                            Out of Stock
                        </button>
                    ) : !cartItems[product._id] ? (
                        <button className="flex items-center justify-center gap-1 bg-primary/10 border border-primary/40 px-3 h-[34px] text-sm font-medium rounded cursor-pointer min-w-[70px] md:min-w-[80px]" onClick={() => addToCart(product._id)} >
                               <img src={assets.cart_icon} alt="cart_icon" className="w-3.5" />
                                Add
                        </button>
                    ) : (
                        <div className="flex items-center justify-center gap-2 px-2 h-[34px] text-sm bg-primary/25 rounded select-none min-w-[70px] md:min-w-[80px]">
                            <button onClick={() => {removeFromCart(product._id)}} className="cursor-pointer text-base font-bold px-1" >
                                -
                            </button>
                            <span className="w-4 text-center font-medium">{cartItems[product._id]}</span>
                            <button onClick={() => addToCart(product._id)} className="cursor-pointer text-base font-bold px-1" >
                                +
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
