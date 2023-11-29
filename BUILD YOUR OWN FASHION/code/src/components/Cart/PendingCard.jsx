import React from 'react';
import cartcss from '../../assets/styles/Cart.module.css';
import productImg from '../../assets/images/product.jpg'
import { Image } from 'cloudinary-react';

function ProductCard({pendingOrder,orderDetails,product_details,RemoveHandler}) {
    let image = ""; 
    if(orderDetails.selectedStyle !== ""){
        image = `${product_details.product_name +product_details.product_id+ "/styles/" + orderDetails.selectedColor + orderDetails.selectedStyle}`
    }
    return (
        <div className={cartcss.product_card}>
            <div className={cartcss.product_info}>
                {/* <img src={productImg} alt={product_details.product_name} /> */}
                <Image
                        cloudName="dxahez5ol"
                        publicId={`ecomm/${image ?image :  product_details.product_images[0]}`}
                        crop="fill"
                        alt="product_img"
                        className={cartcss.product_image}
                    />
                <h2>{product_details.product_name}</h2>
            </div>
            <div className={cartcss.rightsection_cart}>
            <div className={cartcss.remove_btn_div}>
                <button onClick={(e)=>{e.target.innerHTML = "Removing..";RemoveHandler(orderDetails.order_id)}} className={cartcss.remove_button}>Remove</button>
            </div>
            <div className={cartcss.product_details}>
                <h3>Order Details:</h3>
                <strong>
                    Product Description: <span style={{fontWeight:400}}>{product_details.product_desc}</span>
                </strong>
                <strong>
                    Ordered Color: <span style={{fontWeight:400}}>{orderDetails.selectedColor}</span>
                </strong>
                <strong>
                    Ordered Style: <span style={{fontWeight:400}}>{orderDetails.selectedStyle}</span>
                </strong>
                <strong>
                    Ordered Size: <span style={{fontWeight:400}}>{orderDetails.selectedSize}</span>
                </strong>
                <strong>
                    Ordered Quantity: <span style={{fontWeight:400}}>{orderDetails.quantity}</span>
                </strong>
                <strong>
                    Total Price: <span style={{fontWeight:400,fontSize:"30px"}}>$ {Math.abs(pendingOrder.total_price).toFixed(2)}</span>
                </strong>
            </div>
            </div>
        </div>
    );
}

export default ProductCard;
