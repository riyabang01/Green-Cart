import 'dotenv/config';
import mongoose from 'mongoose';
import Product from './models/Product.js';

const mockProductsData = [
    // ==================== VEGETABLES ====================
    {

        name: "Potato 500g",
        category: "Vegetables",
        price: 25,
        offerPrice: 20,
        weight: "500g",
        image: ["/products/potato_image_1.png",
            "/products/potato_image_2.png",
            "/products/potato_image_3.png",
            "/products/potato_image_4.png"
        ],
        description: ["Fresh and organic", "Rich in carbohydrates", "Ideal for curries and fries"],
        inStock: true
    },
    {

        name: "Tomato 1 kg",
        category: "Vegetables",
        price: 40,
        offerPrice: 35,
        weight: "1kg",
        image: ["/products/tomato_image.png",
            "/products/tomato_image_2.png"
        ],
        description: ["Juicy and ripe", "Rich in Vitamin C", "Perfect for salads and sauces", "Farm fresh quality"],
        inStock: true
    },
    {

        name: "Carrot 500g",
        category: "Vegetables",
        price: 30,
        offerPrice: 28,
        weight: "500g",
        image: ["/products/carrot_image.png"],
        description: ["Sweet and crunchy", "Good for eyesight", "Ideal for juices and salads"],
        inStock: true
    },
    {

        name: "Spinach 500g",
        category: "Vegetables",
        price: 18,
        offerPrice: 15,
        weight: "500g",
        image: ["/products/spinach_image_1.png"],
        description: ["Rich in iron", "High in vitamins", "Perfect for soups and salads"],
        inStock: true
    },
    {

        name: "Onion 500g",
        category: "Vegetables",
        price: 22,
        offerPrice: 19,
        weight: "500g",
        image: ["/products/onion_image_1.png"],
        description: ["Fresh and pungent", "Perfect for cooking", "A kitchen staple"],
        inStock: true
    },

    // ==================== FRUITS ====================
    {

        name: "Apple 1 kg",
        category: "Fruits",
        price: 120,
        offerPrice: 110,
        weight: "1kg",
        image: ["/products/apple_image.png"],
        description: ["Crisp and juicy", "Rich in fiber", "Boosts immunity", "Organic and farm fresh"],
        inStock: true
    },
    {

        name: "Orange 1 kg",
        category: "Fruits",
        price: 80,
        offerPrice: 75,
        weight: "1kg",
        image: ["/products/orange_image.png"],
        description: ["Juicy and sweet", "Rich in Vitamin C", "Perfect for juices and salads"],
        inStock: true
    },
    {

        name: "Banana 1 kg",
        category: "Fruits",
        price: 50,
        offerPrice: 45,
        weight: "1kg",
        image: ["/products/banana_image_1.png"],
        description: ["Sweet and ripe", "High in potassium", "Great for smoothies and snacking"],
        inStock: true
    },
    {

        name: "Mango 1 kg",
        category: "Fruits",
        price: 150,
        offerPrice: 140,
        weight: "1kg",
        image: ["/products/mango_image_1.png"],
        description: ["Sweet and flavorful", "Perfect for smoothies and desserts", "Rich in Vitamin A"],
        inStock: true
    },
    {

        name: "Grapes 500g",
        category: "Fruits",
        price: 70,
        offerPrice: 65,
        weight: "500g",
        image: ["/products/grapes_image_1.png"],

        description: ["Fresh and juicy", "Rich in antioxidants", "Perfect for snacking and fruit salads"],
        inStock: true
    },

    // ==================== DAIRY PRODUCTS ====================
    {

        name: "Amul Milk 1L",
        category: "Dairy",
        price: 60,
        offerPrice: 55,
        weight: "1L",
        image: ["/products/amul_milk_image.png"],
        description: ["Pure and fresh", "Rich in calcium", "Ideal for tea, coffee, and desserts"],
        inStock: true
    },
    {
        name: "Yogurt 200g",
        category: "Dairy",
        price: 90,
        offerPrice: 85,
        weight: "200g",
        image: [
            "/products/yogurt_image_1.png"],
        description: [
            "Creamy and delicious",
            "Rich in probiotics and calcium",
            "Perfect breakfast snack or side dish"
        ],
        inStock: true
    },
    {

        name: "Eggs 12 pcs",
        category: "Dairy",
        price: 90,
        offerPrice: 85,
        weight: "12 pcs",
        image: ["/products/eggs_image.png"],
        description: ["Farm fresh", "Rich in protein", "Ideal for breakfast and baking"],
        inStock: true
    },
    {

        name: "Paneer 200g (Alt)",
        category: "Dairy",
        price: 90,
        offerPrice: 85,
        weight: "200g",
        image: ["/products/paneer_image.png", "/products/paneer_image_2.png"],
        description: ["Soft and fresh", "Rich in protein", "Ideal for curries and snacks"],
        inStock: true
    },
    {

        name: "Cheese 200g",
        category: "Dairy",
        price: 140,
        offerPrice: 130,
        weight: "200g",
        image: ["/products/cheese_image.png"],
        description: ["Creamy and delicious", "Perfect for pizzas and sandwiches", "Rich in calcium"],
        inStock: true
    },

    // ==================== COLD DRINKS ====================
    {

        name: "Coca-Cola 1.5L",
        category: "Drinks",
        price: 80,
        offerPrice: 75,
        weight: "1.5L",
        image: ["/products/coca_cola_image.png"],
        description: ["Refreshing and fizzy", "Perfect for parties and gatherings", "Best served chilled"],
        inStock: true
    },
    {

        name: "Pepsi 1.5L",
        category: "Drinks",
        price: 78,
        offerPrice: 73,
        weight: "1.5L",
        image: ["/products/pepsi_image.png", "/products/pepsi_image_2.png"],
        description: ["Chilled and refreshing", "Perfect for celebrations", "Best served cold"],
        inStock: true
    },
    {

        name: "Sprite 1.5L",
        category: "Drinks",
        price: 79,
        offerPrice: 74,
        weight: "1.5L",
        image: ["/products/sprite_image_1.png"],
        description: ["Refreshing citrus taste", "Perfect for hot days", "Best served chilled"],
        inStock: true
    },
    {

        name: "Fanta 1.5L",
        category: "Drinks",
        price: 77,
        offerPrice: 72,
        weight: "1.5L",
        image: ["/products/fanta_image_1.png"],
        description: ["Sweet and fizzy", "Great for parties and gatherings", "Best served cold"],
        inStock: true
    },
    {

        name: "7 Up 1.5L",
        category: "Drinks",
        price: 76,
        offerPrice: 71,
        weight: "1.5L",
        image: ["/products/seven_up_image_1.png"],
        description: ["Refreshing lemon-lime flavor", "Perfect for refreshing", "Best served chilled"],
        inStock: true
    },

    // ==================== GRAINS & CEREALS ====================
    {

        name: "Basmati Rice 5kg",
        category: "Grains",
        price: 550,
        offerPrice: 520,
        weight: "5kg",
        image: ["/products/basmati_rice_image.png"],
        description: ["Long grain and aromatic", "Perfect for biryani and pulao", "Premium quality"],
        inStock: true
    },
    {

        name: "Wheat Flour 5kg",
        category: "Grains",
        price: 250,
        offerPrice: 230,
        weight: "5kg",
        image: ["/products/wheat_flour_image.png"],
        description: ["High-quality whole wheat", "Soft and fluffy rotis", "Rich in nutrients"],
        inStock: true
    },
    {

        name: "Organic Quinoa 500g",
        category: "Grains",
        price: 450,
        offerPrice: 420,
        weight: "500g",
        image: ["/products/quinoa_image.png"],
        description: ["High in protein and fiber", "Gluten-free", "Rich in vitamins and minerals"],
        inStock: true
    },
    {

        name: "Brown Rice 1kg",
        category: "Grains",
        price: 120,
        offerPrice: 110,
        weight: "1kg",
        image: ["/products/brown_rice_image.png"],
        description: ["Whole grain and nutritious", "Helps in weight management", "Good source of magnesium"],
        inStock: true
    },
    {

        name: "Barley 1kg",
        category: "Grains",
        price: 150,
        offerPrice: 140,
        weight: "1kg",
        image: ["/products/barley_image.png"],
        description: ["Rich in fiber", "Helps improve digestion", "Low in fat and cholesterol"],
        inStock: true
    },

    // ==================== BAKERY & BREADS ====================
    {

        name: "Brown Bread 400g",
        category: "Bakery",
        price: 40,
        offerPrice: 35,
        weight: "400g",
        image: ["/products/brown_bread_image.png"],
        description: ["Soft and healthy", "Made from whole wheat", "Ideal for breakfast and sandwiches"],
        inStock: true
    },
    {

        name: "Butter Croissant 100g",
        category: "Bakery",
        price: 50,
        offerPrice: 45,
        weight: "100g",
        image: ["/products/butter_croissant_image.png"],
        description: ["Flaky and buttery", "Freshly baked", "Perfect for breakfast or snacks"],
        inStock: true
    },
    {

        name: "Chocolate Cake 500g",
        category: "Bakery",
        price: 350,
        offerPrice: 325,
        weight: "500g",
        image: ["/products/chocolate_cake_image.png"],
        description: ["Rich and moist", "Made with premium cocoa", "Ideal for celebrations and parties"],
        inStock: true
    },
    {

        name: "Whole Bread 400g",
        category: "Bakery",
        price: 45,
        offerPrice: 40,
        weight: "400g",
        image: ["/products/whole_wheat_bread_image.png"],
        description: ["Healthy and nutritious", "Made with whole wheat flour", "Ideal for sandwiches and toast"],
        inStock: true
    },
    {

        name: "Vanilla Muffins 6 pcs",
        category: "Bakery",
        price: 100,
        offerPrice: 90,
        weight: "6 pcs",
        image: ["/products/vanilla_muffins_image.png"],
        description: ["Soft and fluffy", "Perfect for a quick snack", "Made with real vanilla"],
        inStock: true
    },

    // ==================== INSTANT FOOD ====================
    {

        name: "Maggi Noodles 280g",
        category: "Instant",
        price: 55,
        offerPrice: 50,
        weight: "280g",
        image: ["/products/maggi_image.png"],
        description: ["Instant and easy to cook", "Delicious taste", "Popular among kids and adults"],
        inStock: true
    },
    {

        name: "Top Ramen 270g",
        category: "Instant",
        price: 45,
        offerPrice: 40,
        weight: "270g",
        image: ["/products/top_ramen_image.png"],
        description: ["Quick and easy to prepare", "Spicy and flavorful", "Loved by college students and families"],
        inStock: true
    },
    {

        name: "Knorr Cup Soup 70g",
        category: "Instant",
        price: 35,
        offerPrice: 30,
        weight: "70g",
        image: ["/products/knorr_soup_image.png"],
        description: ["Convenient for on-the-go", "Healthy and nutritious", "Variety of flavors"],
        inStock: true
    },
    {

        name: "Yippee Noodles 260g",
        category: "Instant",
        price: 50,
        offerPrice: 45,
        weight: "260g",
        image: ["/products/yippee_image.png"],
        description: ["Non-fried noodles for healthier choice", "Tasty and filling", "Convenient for busy schedules"],
        inStock: true
    },
    {

        name: "Oats Noodles 72g",
        category: "Instant",
        price: 40,
        offerPrice: 35,
        weight: "72g",
        image: ["/products/maggi_oats_image.png"],
        description: ["Healthy alternative with oats", "Good for digestion", "Perfect for breakfast or snacks"],
        inStock: true
    }
];

const seedMainDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        await Product.deleteMany({});
        await Product.insertMany(mockProductsData);
        console.log("MongoDB Success: Full store list categories synchronized successfully with verified images!");
        process.exit();
    } catch (error) {
        console.error("Database seed error:", error.message);
        process.exit(1);
    }
};

seedMainDatabase();

