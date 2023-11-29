// import React, { useRef, useState } from 'react';
// import styles from '../../assets/styles/AdminStyles/productadd.module.css';
// import SideBar from '../../components/Admin/Dashboard/SideBar';
// import TopBar from '../../components/Admin/Dashboard/TopBar';
// import { useNavigate } from 'react-router-dom';

// const ProductAdd = () => {
//     const isAdmin = localStorage.getItem("role");
//     const alert = useRef(null);
//     const [err, setErr] = useState(false)
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({
//         product_name: '',
//         base_price: '',
//         product_desc: '',
//         available_colors: '',
//         available_sizes: '',
//         product_images: ''
//     });
//     const [imagePreviews, setImagePreviews] = useState([]);

//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value
//         });
//     };

//     const handleImageChange = (e) => {
//         let imageFiles = e.target.files;
//         let imageFileArray = Array.from(imageFiles);
//         let imageUrls = imageFileArray.map(image => URL.createObjectURL(image));

//         setFormData({
//             ...formData,
//             product_images: imageFileArray
//         });
//         setImagePreviews(prevPreviews => [...prevPreviews, ...imageUrls]);
//     };

//     const removeImage = (index) => {
//         setImagePreviews(prevPreviews => prevPreviews.filter((_, idx) => idx !== index));
//         setFormData(prevData => {
//             const updatedImages = prevData.product_images.filter((_, idx) => idx !== index);
//             return {
//                 ...prevData,
//                 product_images: updatedImages
//             };
//         });
//     };

//     const handleSubmit = async (e) => {
//         setErr(true);
//         alert.current.innerHTML = "Adding..."
//         e.preventDefault();
//         console.log(formData.product_color.split(','));
//         formData.available_colors = formData.product_color.split(',');
//         formData.available_sizes = formData.product_size.split(',');
//         const newForm = new FormData();

//         for (const key in formData) {
//             if (key === 'product_images') {
//                 formData[key].forEach((image, index) => {
//                     newForm.append('product_images', image, `${index}.png`);
//                 });
//             } else {
//                 newForm.append(key, formData[key]);
//             }
//         }

//         console.log(newForm)
//         const response = await fetch("http://localhost:5400/api/admin/product/addProduct", {
//             method: "POST",
//             body: newForm
//         });

//         const data = await response.json();
//         if(data.success){
//             setErr(true);
//             alert.current.innerHTML = "Added!"
//             navigate('/admin/Products')
//         }else{
//             alert(data.msg)
//         }
//     };

//     return (
//         <>
//             {
//                 isAdmin === "admin" ?
//                     <div className={styles.app_container}>
//                         <SideBar />
//                         <div className={styles.main_content}>
//                             <TopBar />
//                             {/* Rest of your app content goes here */}
//                             <div style={{ margin: "100px", height: "100%", width: "100%" }}>

//                                 <div className={styles.productAddContainer}>
//                                     <form onSubmit={handleSubmit}>
//                                         <input type="text" name="product_name" placeholder="Product Name" onChange={handleChange} />
//                                         <input type="text" name="product_size" placeholder="Product size,(seperate each by ' , ')" onChange={handleChange} />
//                                         <input type="text" name="product_color" placeholder="Product color,(seperate each by ' , ')" onChange={handleChange} />
//                                         <input type="number" name="base_price" placeholder="Base Price" onChange={handleChange} step={0.01} />
//                                         <textarea name="product_desc" placeholder="Product Description" onChange={handleChange}></textarea>
//                                         {/* TODO: Add fields for available_colors and available_sizes */}

//                                         <input type="file" accept={".png,.jpeg"} multiple onChange={handleImageChange} />
//                                         <div className={styles.imagePreviews}>
//                                             {imagePreviews.map((imageUrl, index) => (
//                                                 <div key={index} className={styles.imageContainer}>
//                                                     <img src={imageUrl} alt="Product Preview" />
//                                                     <button onClick={() => removeImage(index)}>Remove</button>
//                                                 </div>
//                                             ))}
//                                         </div>

//                                         <button type="submit">Add Product</button>
//                                     </form>
//                                 </div>
//                             </div>
//                         </div>
//                         <div ref={alert} style={err ? { display: "block", top: "10px", transition: "top .5s ease-in", transform: "50% 50%" } : {}} className={styles.alert}></div>
//                     </div>
//                     :
//                     <></>
//             }
//         </>
//     );
// };

// export default ProductAdd;



import React, { useRef, useState } from 'react';
import styles from '../../assets/styles/AdminStyles/productadd.module.css';
import SideBar from '../../components/Admin/Dashboard/SideBar';
import TopBar from '../../components/Admin/Dashboard/TopBar';

const ProductAdd = () => {
    const isAdmin = localStorage.getItem("role");
    const alert = useRef(null);
    const [err, setErr] = useState(false);
    const [productData, setProductData] = useState({
        product_id: -1,
        product_name: "",
        base_price: "",
        product_desc: "",
        available_colors: [],
        color_images: [],
        available_sizes: "",
        available_styles: [],
        tags: []
    });

    const handleColorChange = (index, color) => {
        const newColors = [...productData.available_colors];
        newColors[index] = color;
        setProductData(prev => ({ ...prev, available_colors: newColors }));
    }

    const handleColorImageChange = (index, image) => {
        const newImages = [...productData.color_images];
        newImages[index] = image;
        setProductData(prev => ({ ...prev, color_images: newImages }));
    }

    const handleStyleChange = (index, field, value) => {
        console.log(`Index: ${index}, Field: ${field}, Value: ${value}`); // debugging line
        const newStyles = [...productData.available_styles];
        newStyles[index][field] = value;
        setProductData(prev => ({ ...prev, available_styles: newStyles }));
    };

    const uploadImageToBackend = async (file, index, type) => {
        const formData = new FormData();
        console.log(productData.product_id)
        formData.append('image', file);
        formData.append('type', type);
        formData.append('product_name', productData.product_name);
        if (type === "color") {
            formData.append('color', productData.available_colors[index]);
        }
        if (type === "style") {
            formData.append('style_name', productData.available_styles[index].name);
            formData.append('style_color', productData.available_styles[index].color);
        }

        const response = await fetch('http://localhost:5400/api/admin/product/productAdd/uploadImages', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        console.log(data.url)
        return data.url;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setErr(true);
        alert.current.innerHTML = "Adding..."
        // const result = await fetch("http://localhost:5400/api/admin/product/getNewProductId").then(res => (res.json()));
        // setProductData(prevData => ({ ...prevData, product_id: result.newId }))

        /* making array of available sizes */

        // if (result.success) {

            // Structuring the data according to the provided schema
            const structuredData = {
                // product_id: parseInt(result.newId),
                product_name: productData.product_name,
                base_price: parseFloat(productData.base_price),
                product_desc: productData.product_desc,
                available_colors: productData.available_colors,
                product_images: productData.color_images,
                available_sizes: productData.available_sizes.split(','),
                available_styles: productData.available_styles.map((style, index) => ({
                    name: style.name,
                    color: style.color,
                    price: style.price,
                    img: style.img
                })),
                tags: productData.tags.split(',')
            };

            const colorImageURLs = await Promise.all(productData.color_images.map((current, index) => uploadImageToBackend(current, index, "color")));

            const styleImageURLs = await Promise.all(productData.available_styles.map((style, index) => uploadImageToBackend(style.img, index, "style")));
            structuredData.product_images = colorImageURLs;
            structuredData.available_styles = structuredData.available_styles.map((style, index) => ({
                ...style,
                img: styleImageURLs[index]
            }));

            const insertProduct = await fetch("http://localhost:5400/api/admin/product/addProduct", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(structuredData)
            }).then(res => res.json());

            if (insertProduct.success) {
                setTimeout(() => {
                    setErr(false)
                }, 3000);
                alert.current.innerHTML = "Added!"
            } else {
                setTimeout(() => {
                    setErr(false)
                }, 3000);
                alert.current.innerHTML = insertProduct.message;
            }
            console.log(structuredData);
        // } else {
        //     alert("Internal Server Error!");
        // }
    }

    return (
        <>
            {
                isAdmin === "admin" ?
                    <div className={styles.app_container}>
                        <SideBar />
                        <div className={styles.main_content}>
                            <TopBar />
                            {/* Rest of your app content goes here */}
                            <div style={{ margin: "100px", height: "100%", width: "100%" }}>

                                <div className={styles.productAddContainer}>

                                    <div className={styles.container}>
                                        <h2 className={styles.title}>Add New Product</h2>
                                        <form onSubmit={handleSubmit} className={styles.form}>
                                            <input type="text" placeholder="Product Name" value={productData.product_name} onChange={e => setProductData(prev => ({ ...prev, product_name: e.target.value }))} className={styles.input} required />
                                            <input type="number" placeholder="Base Price" value={productData.base_price} onChange={e => setProductData(prev => ({ ...prev, base_price: e.target.value }))} className={styles.input} step={0.00} required />
                                            <textarea placeholder="Product Description" value={productData.product_desc} onChange={e => setProductData(prev => ({ ...prev, product_desc: e.target.value }))} className={styles.textarea} required></textarea>
                                            <input type="text" placeholder="Sizes (seperated by comma ' , ' )" value={productData.available_sizes} onChange={e => setProductData(prev => ({ ...prev, available_sizes: e.target.value }))} className={styles.input} required />
                                            <input type="text" placeholder="Tags (seperated by comma ' , ' )" value={productData.tags} onChange={e => setProductData(prev => ({ ...prev, tags: e.target.value }))} className={styles.input} required />
                                            <div className={styles.field}>
                                                <label className={styles.label}>Available Colors:</label>
                                                {productData.available_colors.map((color, index) => (
                                                    <div key={index} className={styles.inputGroup}>
                                                        <input type="text" value={color} onChange={e => handleColorChange(index, e.target.value)} className={styles.input} required />
                                                        <input type="file" onChange={e => handleColorImageChange(index, e.target.files[0])} className={styles.fileInput} required />
                                                        <button type='button' onClick={() => setProductData(prev => ({ ...prev, available_colors: prev.available_colors.filter((_, i) => i !== index) }))} className={styles.removeButton}>Remove</button>
                                                    </div>
                                                ))}
                                                <button type='button' onClick={() => setProductData(prev => ({ ...prev, available_colors: [...prev.available_colors, ""] }))} className={styles.addButton}>Add Color</button>
                                            </div>
                                            <div className={styles.field}>
                                                <label className={styles.label}>Available Styles:</label>
                                                {productData.available_styles.map((style, index) => (
                                                    <div key={index} className={styles.inputGroup}>
                                                        <input type="text" placeholder="Style Name" value={style.name} onChange={e => handleStyleChange(index, 'name', e.target.value)} className={styles.input} required />
                                                        <select
                                                            className={styles.input}
                                                            value={style.color}
                                                            onChange={e => handleStyleChange(index, 'color', e.target.value)}
                                                            required
                                                        >
                                                            {
                                                                productData.available_colors.map((color, idx) => (
                                                                    <option value={color} key={idx}>
                                                                        {color}
                                                                    </option>
                                                                ))
                                                            }
                                                        </select>

                                                        <input type="number" placeholder="Style Price" value={style.price} onChange={e => handleStyleChange(index, 'price', parseFloat(e.target.value))} step={0.00} className={styles.input} required />
                                                        <input type="file" onChange={e => handleStyleChange(index, 'img', e.target.files[0])} className={styles.fileInput} required />
                                                        <button type='button' onClick={() => setProductData(prev => ({ ...prev, available_styles: prev.available_styles.filter((_, i) => i !== index) }))} className={styles.removeButton}>Remove Style</button>
                                                    </div>
                                                ))}
                                                <button type='button' onClick={() => {productData.available_colors.length > 0 ? setProductData(prev => ({ ...prev, available_styles: [...prev.available_styles, { name: "", color: productData.available_colors[0], price: "", img: "" }] })) : setErr(true);alert.current.innerHTML="Please add color First";setTimeout(() => {
                                                    setErr(false)
                                                }, 3000);}} className={styles.addButton}>Add Style</button>
                                            </div>
                                            <button type="submit" className={styles.submitButton}>Add Product</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <></>
                }
                <div ref={alert} style={err ? { display: "block",position:"fixed", top: "10px" ,left:"40%", transition: "top .5s ease-in", transform: "50% 50%" } : {}} className={styles.alert}></div>
        </>
    );
}

export default ProductAdd;
