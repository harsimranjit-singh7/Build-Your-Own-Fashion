import React, {  useEffect, useState } from 'react'
import appcss from "../../assets/styles/App.module.css"
import ItemModal from './ItemModal'
import { Image } from 'cloudinary-react'
import { useNavigate } from 'react-router-dom'

const ItemsComponent = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    
    const initialFetch = async() =>{
        const auth_token = localStorage.getItem("auth_token");
        try{
            const data = await fetch('http://localhost:5400/api/products/',{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    "auth_token":auth_token
                },
                body:JSON.stringify({
                    limit:4
                })
            })
            .then(res=>{return res.json()})
            .catch(err => console.log("Internal Server error" + err));
            if(data.success){
                setProducts(data.products);
            }else{
                if(data && data.redirect) {
                    navigate(data.redirect);
                }
                throw Error("Internal Server error");
            }
        }catch(err){
            console.log("Internal Server error" + err);
        }
    }

    const showAllFetch = async(e) =>{
        const auth_token = localStorage.getItem("auth_token");
        e.target.innerHTML = "Fetching..."
        try{
            const data = await fetch('http://localhost:5400/api/products/',{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    "auth_token":auth_token
                },
                body:JSON.stringify({
                    limit:false
                })
            })
            .then(res=>{return res.json()})
            .catch(err => console.log("Internal Server error" + err));
            if(data.success){
                e.target.style.display = "none";
                setProducts(data.products);
            }else{
                if(data && data.redirect) {
                    navigate(data.redirect);
                }
                throw Error("Internal Server error");
            }
        }catch(err){
            console.log("Internal Server error" + err);
        }
    }
    
    useEffect(() => {
      initialFetch();
    }, [])

    
    return (
        <div className={appcss.items_main_component}>
            <h1>Featured Products</h1>
            <div className={appcss.items_list}>
                <div className={appcss.items}>
                    {
                        products.map(product =>(
                            <CardComponent key={product._id} product = {product} /> 
                        ))
                    }
                </div>
            </div>
            <button type="button" onClick={showAllFetch}>Show All Products</button>
        </div>
    )
}

export default ItemsComponent


const CardComponent = ({product}) => {
    return (
        <div className={appcss.card}>
            <div className={appcss.card_img}>
                {/* fetch image from cloudinary */}
                <Image 
                    cloudName="dxahez5ol"
                    publicId={`ecomm/${product.product_images[0]}`}
                    crop="fill"
                    alt="product_img"
                />
                {/* <img src={product} alt='product_img'></img> */}
            </div>
            <div className={appcss.card_details}>
                <h3>{product.product_name}</h3>
                <p>$ {product.base_price}</p>
            </div>
            <div className={appcss.card_button}>
                <ItemModal product={product}/>
            </div>
        </div>
    )
}
