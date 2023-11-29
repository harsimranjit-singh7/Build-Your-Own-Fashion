const express = require('express');
const conn = require('../../db');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: '../../uploads' }); // 'uploads/' is the folder where multer will temporarily store the uploaded files.
const cloudinary = require('cloudinary').v2;


const getId = async() => {
    try {
        const db = await conn();
        const Products = db.collection("Products");
        let newId = await Products.find().sort({ product_id: -1 }).limit(1).toArray();
        newId = parseInt(newId[0].product_id) + 1;
        return newId;
    } catch (error) {
        throw Error("Error finding key");
    }
}

    
    
    
    /*get single product */
router.get('/getProduct/:productId', async (req, res) => {
    try {
        
        const { productId } = req.params;
        console.log(productId)
        const db = await conn();
        const Product = await db.collection("Products");
        const product = await Product.findOne({ product_id: Number(productId) });

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


router.post('/addProduct', upload.array('product_images'), async (req, res) => {
    try {
        const productId = await getId();
        const db = await conn();
        const Products = db.collection("Products");
        req.body.product_id = productId;
        const response = await  Products.insertOne(req.body);
        if(response.acknowledged){
            return res.status(200).json({success:true,message:"Successfull"})
        }
        return res.status(500).json({ success: false, message: "Internal Server error"});
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server error", error: error.message });
    }
})


router.delete('/deleteProduct/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const db = await conn();
        const Product = db.collection("Products");
        const Order_details = db.collection("Order_details");
        const result = await Product.deleteOne({ product_id: parseInt(productId) });
        const result2 = await Order_details.deleteMany({ product_id: parseInt(productId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.status(200).json({ success: true, message: 'Product removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


router.put('/updateProduct', async (req, res) => {
    try {
        const database = await conn();
        const products = database.collection('Products');

        const product_id = parseInt(req.body.product_id);

        const updatedProduct = {
            product_name: req.body.product_name,
            base_price: req.body.base_price,
            product_desc: req.body.product_desc,
            available_sizes: req.body.available_sizes,
            available_colors: req.body.available_colors
        };

        const result = await products.updateOne({ product_id }, { $set: updatedProduct });

        if (result) {
            return res.json({ success: true, message: 'Product updated successfully' });
        }
        throw Error("Internal Server error")
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;

router.post('/productAdd/uploadImages', upload.single('image'), async (req, res) => {
    if (!req.file ) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    try {
        const file = req.file;  // File data is now in req.file thanks to multer
        const product_name = req.body.product_name;

        const product_id = await getId();
        console.log(product_id)
        let returnUrl = '';
        // Determine the folder and public_id based on your requirements
        let folder, public_id;
        if (req.body.type === 'color') {
            const color = req.body.color;
            folder = `ecomm/${product_name}${product_id}/`;
            public_id = `${product_name}${product_id}${color}`;
            returnUrl = `${product_name}${product_id}/${product_name}${product_id}${color}`;
        } else if (req.body.type === 'style') {
            const style_color = req.body.style_color;
            const style_name = req.body.style_name;
            folder = `ecomm/${product_name}${product_id}/styles/`;
            public_id = `${style_color}${style_name}`;
            returnUrl = `${product_name}${product_id}/styles/${style_color}${style_name}`;
        }
        // Upload to Cloudinary
        const uploadedImages = [];
        try {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder,
                public_id
            });
            uploadedImages.push(result.secure_url);
        } catch (err) {
            console.log(err.message)
        }
        res.status(200).json({url:returnUrl})
    } catch (err) {
        console.error(err);
        res.status(500).json({ error:err.message});
    }
});






/* older add product */
// router.post('/addProduct', upload.array('product_images'), async (req, res) => {
//     try {
//         const uploadedImages = [];
//         const db = await conn()
//         const Products = await db.collection("Products");

//         let newId = await Products.find().sort({ product_id: -1 }).limit(1).toArray();
//         newId = parseInt(newId[0].product_id) + 1;

//         const images = []
//         for (let i = 0; i < req.files.length; i++) {
//             const imagePath = req.files[i].path;
//             const productName = req.body.product_name.trim();
//             const productFolder = `ecomm/${productName}${newId}`;
//             const imageId = `${productName}${newId}${i}`;
//             const publicId = `${productFolder}/${imageId}`;

//             try {
//                 const result = await cloudinary.uploader.upload(imagePath, {
//                     public_id: `${publicId}`
//                 });
//                 const imagetostore = '' + productName + newId + '/' + imageId;
//                 images.push(imagetostore);
//                 uploadedImages.push(result.secure_url);
//             } catch (err) {
//                 console.log(err.message)
//             }
//         }

//         const available_sizes = req.body.available_sizes.split(',');
//         const available_colors = req.body.available_colors.split(',');
//         console.log(available_colors[0] + " " + available_sizes[0] + " " + images)
//         const response = Products.insertOne({
//             product_id: newId,
//             product_name: req.body.product_name,
//             base_price: req.body.base_price,
//             product_desc: req.body.product_desc,
//             available_sizes,
//             available_colors,
//             product_images: images
//         })
//         if (response) {
//             return res.status(200).json({ success: true, msg: "Added Successfully" })
//         }
//     } catch (error) {
//         return res.status(500).json({ success: false, msg: "Internal Server error", error: error.message });
//     }
// })