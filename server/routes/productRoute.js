import express from 'express'
import { upload } from '../configs/multer.js';
import authSeller from '../middlewares/authSeller.js';
import { addProduct, changeStock, ProductById, productList } from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.post('/add', authSeller, upload.array('images'), addProduct)
productRouter.get('/list', productList)
productRouter.get('/single/:id', ProductById)
productRouter.post('/stock', authSeller, changeStock)

export default productRouter;
