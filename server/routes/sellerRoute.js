import express from 'express'
import { isSellerAuth, sellerLogin, sellerLogout } from '../controllers/sellerController.js';

const sellerRouter = express.Router();

sellerRouter.post('/login', sellerLogin);
sellerRouter.post('/is-auth', isSellerAuth);
sellerRouter.post('/logout', sellerLogout);

export default sellerRouter;
