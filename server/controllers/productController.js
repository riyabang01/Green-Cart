import { v2 as cloudinary } from 'cloudinary';
import Product from '../models/Product.js';

export const addProduct = async (req, res) => {
    try {
        let productData = JSON.parse(req.body.productData);
        
        let images = [];
        if (Array.isArray(req.files)) {
            images = req.files;
        } else if (req.files && typeof req.files === 'object') {
            images = Object.values(req.files).flat();
        }

        const uploadToCloudinary = (fileBuffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'products', resource_type: 'auto' },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result.secure_url);
                    }
                );
                stream.end(fileBuffer);
            });
        };

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                return await uploadToCloudinary(item.buffer);
            })
        );

        const structuredProduct = {
            ...productData,
            price: Number(productData.price),
            offerPrice: Number(productData.offerPrice),
            image: imagesUrl,
            images: imagesUrl
        };

        await Product.create(structuredProduct);
        return res.status(201).json({ success: true, message: 'Product Added' });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const productList = async (req, res) => {
   try {
        const products = await Product.find({});
        return res.status(200).json({ success: true, products });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const ProductById = async (req, res) => {
     try {
        const { id } = req.params;
        const product = await Product.findById(id);
        
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        
        return res.status(200).json({ success: true, product });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const changeStock = async (req, res) => {
     try {
        const { id, inStock } = req.body;
        
        const updatedProduct = await Product.findByIdAndUpdate(
            id, 
            { inStock }, 
            { new: true }
        );
        
        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        
        return res.status(200).json({ success: true, message: 'Stock Updated', product: updatedProduct });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};
