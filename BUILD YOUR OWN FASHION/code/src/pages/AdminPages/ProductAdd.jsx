import React, { useRef, useState } from 'react';
import styles from '../../assets/styles/AdminStyles/productadd.module.css';
import SideBar from '../../components/Admin/Dashboard/SideBar';
import TopBar from '../../components/Admin/Dashboard/TopBar';
import { useNavigate } from 'react-router-dom';

const ProductAdd = () => {
    const isAdmin = localStorage.getItem("role");
    const alert = useRef(null);
    const [err, setErr] = useState(false)
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        product_name: '',
        base_price: '',
        product_desc: '',
        available_colors: '',
        available_sizes: '',
        product_images: ''
    });
    const [imagePreviews, setImagePreviews] = useState([]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        let imageFiles = e.target.files;
        let imageFileArray = Array.from(imageFiles);
        let imageUrls = imageFileArray.map(image => URL.createObjectURL(image));

        setFormData({
            ...formData,
            product_images: imageFileArray
        });
        setImagePreviews(prevPreviews => [...prevPreviews, ...imageUrls]);
    };

    const removeImage = (index) => {
        setImagePreviews(prevPreviews => prevPreviews.filter((_, idx) => idx !== index));
        setFormData(prevData => {
            const updatedImages = prevData.product_images.filter((_, idx) => idx !== index);
            return {
                ...prevData,
                product_images: updatedImages
            };
        });
    };

    const handleSubmit = async (e) => {
        setErr(true);
        alert.current.innerHTML = "Adding..."
        e.preventDefault();
        console.log(formData.product_color.split(','));
        formData.available_colors = formData.product_color.split(',');
        formData.available_sizes = formData.product_size.split(',');
        const newForm = new FormData();
        
        for (const key in formData) {
            if (key === 'product_images') {
                formData[key].forEach((image, index) => {
                    newForm.append('product_images', image, `${index}.png`);
                });
            } else {
                newForm.append(key, formData[key]);
            }
        }
        
        console.log(newForm)
        const response = await fetch("http://localhost:5400/api/admin/product/addProduct", {
            method: "POST",
            body: newForm
        });
        
        const data = await response.json();
        if(data.success){
            setErr(true);
            alert.current.innerHTML = "Added!"
            navigate('/admin/Products')
        }else{
            alert(data.msg)
        }
    };

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
                                    <form onSubmit={handleSubmit}>
                                        <input type="text" name="product_name" placeholder="Product Name" onChange={handleChange} />
                                        <input type="text" name="product_size" placeholder="Product size,(seperate each by ' , ')" onChange={handleChange} />
                                        <input type="text" name="product_color" placeholder="Product color,(seperate each by ' , ')" onChange={handleChange} />
                                        <input type="number" name="base_price" placeholder="Base Price" onChange={handleChange} step={0.01} />
                                        <textarea name="product_desc" placeholder="Product Description" onChange={handleChange}></textarea>
                                        {/* TODO: Add fields for available_colors and available_sizes */}

                                        <input type="file" accept={".png,.jpeg"} multiple onChange={handleImageChange} />
                                        <div className={styles.imagePreviews}>
                                            {imagePreviews.map((imageUrl, index) => (
                                                <div key={index} className={styles.imageContainer}>
                                                    <img src={imageUrl} alt="Product Preview" />
                                                    <button onClick={() => removeImage(index)}>Remove</button>
                                                </div>
                                            ))}
                                        </div>

                                        <button type="submit">Add Product</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div ref={alert} style={err ? { display: "block", top: "10px", transition: "top .5s ease-in", transform: "50% 50%" } : {}} className={styles.alert}></div>
                    </div>
                    :
                    <></>
            }
        </>
    );
};

export default ProductAdd;
