import React, { useEffect, useState } from 'react'
import styles from '../../assets/styles/AdminStyles/product.module.css';
import { Link, useNavigate } from 'react-router-dom';
import SideBar from '../../components/Admin/Dashboard/SideBar';
import TopBar from '../../components/Admin/Dashboard/TopBar';
import { Image } from 'cloudinary-react';


function Product() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        const showAllFetch = async () => {
            const auth_token = localStorage.getItem("auth_token");
            try {
                const data = await fetch('http://localhost:5400/api/products/', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "auth_token": auth_token
                    },
                    body: JSON.stringify({
                        limit: false
                    })
                })
                    .then(res => { return res.json() })
                    .catch(err => console.log("Internal Server error" + err));
                if (data.success) {
                    setProducts(data.products);
                    console.log(data.products)
                } else {
                    if (data && data.redirect) {
                        navigate(data.redirect);
                    }
                    throw Error("Internal Server error");
                }
            } catch (err) {
                console.log("Internal Server error" + err);
            }
        }

        showAllFetch();
    }, [])



    const isAdmin = localStorage.getItem("role");
    const handleAddProduct = () => {
        console.log('Add product clicked');
    };

    const handleEditProduct = (product) => {
        navigate(`/admin/ProductEdit/${product.product_id}`);
    };


    /*Removing the product */
    const handleRemoveProduct = (product_id) => {
        console.log('Remove product', product_id);
        fetch(`http://localhost:5400/api/admin/product/deleteProduct/${product_id}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setProducts(products.filter((e) => { return e.product_id !== product_id }))
                    console.log(data.message);
                    // Maybe redirect or update UI after successful deletion
                } else {
                    console.error(data.message);
                }
            })
            .catch(error => {
                console.error('There was an error removing the product:', error);
            });
    };

    return (
        <>
            {
                isAdmin === "admin" ?
                    products.length < 0 ?
                        <div style={{ width: "100%", height: "100vh", display: "flex", alignItems: "center" }}>
                            <div style={{ margin: "auto", textAlign: "center" }}>Loading....</div>
                        </div>
                        :
                        <div className={styles.app_container}>
                            <SideBar />
                            <div className={styles.main_content}>
                                <TopBar />
                                {/* Rest of your app content goes here */}
                                <div style={{ margin: "100px 20px" }}>
                                    <ProductCards
                                        products={products}
                                        onAdd={handleAddProduct}
                                        onEdit={handleEditProduct}
                                        onRemove={handleRemoveProduct}
                                    />
                                </div>
                            </div>
                        </div>
                    :
                    <></>
            }
        </>
    );
}


export default Product;


function ProductCards({ products, onAdd, onEdit, onRemove }) {
    const navigate = useNavigate()
    return (
        <div className={styles.admin_container}>
            <div style={{ width: "100%", display: "flex", justifyContent: "end" }}>
                <Link to="/admin/ProductAdd" className={styles.add_product_btn} >Add Product</Link>
            </div>
            <div className={styles.products_container}>
                {products.map(product => (
                    <ProductCard key={product.product_id} product={product} onEdit={onEdit} onRemove={onRemove} />
                ))}
            </div>
        </div>
    );
}



function ProductCard({ product, onEdit, onRemove }) {
    return (
        <div className={styles.product_card}>
            <Image
                cloudName="dxahez5ol"
                publicId={`ecomm/${product.product_images[0]}`}
                crop="fill"
                alt="product_img"
                className={styles.product_image}
            />
            <div className={styles.product_details}>
                <div className={styles.product_name}>{product.product_name}</div>
                <div className={styles.product_price}>${product.base_price}</div>
                <div className={styles.card_buttons}>
                    <button className={styles.edit_btn} onClick={() => onEdit(product)}>Edit</button>
                    <button className={styles.remove_btn} onClick={() => onRemove(product.product_id)}>Remove</button>
                </div>
            </div>
        </div>
    );
}