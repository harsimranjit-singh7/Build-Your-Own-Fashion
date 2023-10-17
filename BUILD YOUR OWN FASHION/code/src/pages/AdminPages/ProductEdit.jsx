import React, { useEffect, useRef, useState } from 'react';
import styles from '../../assets/styles/AdminStyles/productadd.module.css';
import SideBar from '../../components/Admin/Dashboard/SideBar';
import TopBar from '../../components/Admin/Dashboard/TopBar';
import { useNavigate, useParams } from 'react-router-dom';

const ProductAdd = () => {
    const [product, setProduct] = useState({});
    const { product_id } = useParams();
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
    });

    useEffect(() => {
        const fetchProductById = async () => {
            try {
                const response = await fetch(`http://localhost:5400/api/admin/product/getProduct/${product_id}`);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const productData = await response.json();

                if (productData.success) { // This will log the product details
                    setFormData({
                        product_name: productData.product.product_name,
                        base_price: productData.product.base_price,
                        product_desc: productData.product.product_desc,
                        available_colors: productData.product.available_colors,
                        available_sizes: productData.product.available_sizes,
                    });
                } else {
                    console.error(productData.message); // Error message from the server
                }
            } catch (error) {
                console.error("There was a problem with the fetch operation:", error.message);
            }
        }

        fetchProductById();
    }, [])




    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };


    const handleSubmit = async (e) => {
        setErr(true);
        alert.current.innerHTML = "Editing..."
        e.preventDefault();
        if(!typeof available_colors === Object){
            formData.available_colors = formData.available_colors.split(',');
        }
        if(!typeof available_sizes === Object){
            formData.available_sizes = formData.available_sizes.split(',');
        }
        try {
            const response = await fetch(`http://localhost:5400/api/admin/product/updateProduct`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    product_id:product_id,
                    available_colors: typeof available_colors === 'object'? formData.available_colors:formData.available_colors.split(','),
                    available_sizes:typeof available_sizes === 'object'? formData.available_sizes:formData.available_sizes.split(','),
                    product_name:formData.product_name,
                    product_desc:formData.product_desc,
                    base_price:formData.base_price
                })
            });

            const result = await response.json();

            if (response.ok) {
                navigate('/admin/Products')
                console.log(result.message);  // Success message from the server
                return result;
            } else {
                console.error(result.message);  // Error message from the server
                throw new Error(result.message);
            }
        } catch (error) {
            console.error("There was a problem with the fetch operation:", error.message);
        }
    };

    // ... Other parts of the component remain unchanged

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
                                <h3>Product Edit:{formData.product_name}</h3>
                                <form onSubmit={handleSubmit}>
                                    <input 
                                        type="text" 
                                        name="product_name" 
                                        value={formData.product_name} 
                                        onChange={handleChange} 
                                    />
                                    <input 
                                        type="text" 
                                        name="available_sizes" 
                                        value={formData.available_sizes}
                                        onChange={handleChange} 
                                    />
                                    <input 
                                        type="text" 
                                        name="available_colors" 
                                        value={formData.available_colors}
                                        onChange={handleChange} 
                                    />
                                    <input 
                                        type="number" 
                                        name="base_price" 
                                        value={formData.base_price}
                                        onChange={handleChange} 
                                        step={0.01} 
                                    />
                                    <textarea 
                                        name="product_desc" 
                                        value={formData.product_desc}
                                        onChange={handleChange}
                                    ></textarea>

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

export default ProductAdd
