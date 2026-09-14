import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Stripe from 'stripe';

export const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, address } = req.body;

        if (!address || !items || items.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid data" });
        }

        let amount = 0;
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (product) {
                if (!product.inStock) {
                    return res.status(400).json({ success: false, message: `${product.name} is Out of Stock` });
                }
                amount += product.offerPrice * item.quantity;
            }
        }

        amount += Math.floor(amount * 0.02);

        await Order.create({
            userId,
            items,
            address,
            amount,
            paymentType: "COD",
            isPaid: false
        });

        return res.status(201).json({ success: true, message: "Order Placed Successfully" });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const stripeWebhooks = async (req, res) => {
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.log(`Webhook Signature Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const orderId = session.metadata.orderId;
        const userId = session.metadata.userId;

        try {
            await Order.findByIdAndUpdate(orderId, { isPaid: true }, { returnDocument: 'after' });
            if (userId) {
                await User.findByIdAndUpdate(userId, { cartItems: {} }, { returnDocument: 'after' });
            }
            console.log(`Order ${orderId} verified and cart cleared via Webhook.`);
        } catch (error) {
            console.log(`Webhook Database Update Error: ${error.message}`);
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    return res.status(200).json({ received: true });
};

export const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, address } = req.body;
        const origin = req.headers.origin || "https://vercel.app";

        if (!address || !items || items.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid data" });
        }

        let productData = [];
        let subtotal = 0;

        for (const item of items) {
            const product = await Product.findById(item.product);
            if (product) {
                if (!product.inStock) {
                    return res.status(400).json({ success: false, message: `${product.name} is Out of Stock` });
                }
                productData.push({
                    name: product.name,
                    price: product.offerPrice,
                    quantity: item.quantity,
                });
                subtotal += product.offerPrice * item.quantity;
            }
        }

        const totalTax = Math.floor(subtotal * 0.02);
        const finalAmount = subtotal + totalTax;

        const order = await Order.create({
            userId,
            items,
            address,
            amount: finalAmount,
            paymentType: "Online",
            isPaid: false
        });

        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

        const lineItems = productData.map((item) => {
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: Math.floor(item.price * 100)
                },
                quantity: item.quantity,
            };
        });

        if (totalTax > 0) {
            lineItems.push({
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: "Tax & Processing Fee (2%)",
                    },
                    unit_amount: Math.floor(totalTax * 100)
                },
                quantity: 1,
            });
        }

        const session = await stripeInstance.checkout.sessions.create({
            line_items: lineItems, 
            mode: "payment",
            success_url: `${origin}/loader?next=my-orders&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId,
            }
        });

        await Order.findByIdAndUpdate(order._id, { stripePaymentIntentId: session.id }, { returnDocument: 'after' });

        return res.status(200).json({ success: true, url: session.url });

    } catch (error) {
        console.log("Stripe Session Error:", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const verifyStripe = async (req, res) => {
    try {
        const { sessionId } = req.body;
        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

        const session = await stripeInstance.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            const orderId = session.metadata.orderId;
            const userId = session.metadata.userId;
            
            await Order.findByIdAndUpdate(orderId, { isPaid: true }, { returnDocument: 'after' });
            if (userId) {
                await User.findByIdAndUpdate(userId, { cartItems: {} }, { returnDocument: 'after' });
            }
            return res.status(200).json({ success: true, message: "Payment Verified Successfully" });
        } else {
            return res.status(400).json({ success: false, message: "Payment Failed" });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getUserOrders = async (req, res) => {
    try {
        const userId = req.body.userId || req.userId;

        const orders = await Order.find({
            userId,
            $or: [{ paymentType: 'COD' }, { isPaid: true }]
        }).populate('items.product').sort({ createdAt: -1 });

        return res.status(200).json({ success: true, orders });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [{ paymentType: 'COD' }, { isPaid: true }]
        }).populate('items.product').sort({ createdAt: -1 });

        return res.status(200).json({ success: true, orders });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};
