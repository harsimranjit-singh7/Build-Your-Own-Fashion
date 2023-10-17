import React, { Children, useState } from 'react'
import modalcss from "../../assets/styles/Modal.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleLeft, faCircleRight, faClose } from '@fortawesome/free-solid-svg-icons'
import RightSection from './RightSection'
import { Image } from 'cloudinary-react'
import { useNavigate } from 'react-router-dom'

const ModalDetails = ({ toggleModal, product }) => {
    const [imageno, setImageno] = useState(0);
    const [selectedRadio, setSelectedRadio] = useState(0);
    const [orderDetails, setOrderDetails] = useState({ 
        product_id: product.product_id, 
        unit_price: product.base_price,
        selectedColor:product.available_colors[0],
        selectedSize:product.available_sizes[0],
        quantity:1
    });
    const navigate = useNavigate();

    const updateOrderDetails = (key, value) => {
        setOrderDetails(prevState => ({
            ...prevState,
            [key]: value
        }));
        console.log(orderDetails)
    };

    const handleToCart = async(e) => {
        const auth_token = localStorage.getItem("auth_token");
        console.log(orderDetails)
        e.target.innerHTML = "Adding..."
        try {
            const data = await fetch('http://localhost:5400/api/order/addtocart', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth_token": auth_token
                },
                body: JSON.stringify({
                    orderDetails
                })
            })
                .then(res => { return res.json() })
                .catch(err => console.log("Internal Server error" + err));
            if (data.success) {
                setTimeout(() => {
                    navigate('/cart');
                }, 500);
                e.target.innerHTML = "Added to Cart Successfully!";
            } else {
                if (data && data.redirect) {
                    navigate(data.redirect);
                }
                alert(data.msg);
                e.target.innerHTML = "Add to Cart"
                throw Error("Internal Server error");
            }
        } catch (err) {
            console.log("Internal Server error" + err);
        }
    }

    return (
        <div className={modalcss.modal}>
            <div className={modalcss.left_section}>
                <div className={modalcss.item_image}>
                    {
                        product.product_images.length > 1 ?
                            <div className={modalcss.image_cover}>
                                <button onClick={() => setImageno(no => (no - 1) % product.product_images.length)}><FontAwesomeIcon size='xl' icon={faCircleLeft} /></button>
                                <button onClick={() => setImageno(no => (no + 1) % product.product_images.length)}><FontAwesomeIcon size='xl' icon={faCircleRight} /></button>
                            </div>
                            :
                            <></>
                    }
                    <Image
                        cloudName="dxahez5ol"
                        publicId={`ecomm/${product.product_images[imageno]}`}
                        crop="fill"
                        alt="product_img"
                    />
                </div>
                <div className={modalcss.customize}>

                    <form name="customization">
                        <div className={modalcss.color_customize}>
                            {
                                product.available_colors.map((color, index) => (
                                    <RadioBox
                                        key={index}
                                        color={color}
                                        index={index}
                                        orderDetails={orderDetails}
                                        isSelected={selectedRadio === index}
                                        onSelect={() => { setSelectedRadio(index) }}
                                        updateOrderDetails={updateOrderDetails}
                                    />
                                ))
                            }
                        </div>
                        {/* <div className={modalcss.text_input}>
                            <input type='text' placeholder='Enter text you want to add!' />
                        </div> */}
                    </form>
                </div>
            </div>
            <div className={modalcss.right_section}>
                <RightSection product={product} orderDetails={orderDetails} updateOrderDetails={updateOrderDetails} handleToCart={handleToCart} />
            </div>
            <FontAwesomeIcon
                onClick={toggleModal}
                size='lg'
                style={{ position: "absolute", top: 20, right: 20, cursor: "pointer" }}
                icon={faClose}
                color={"#004945"}
            />
        </div>
    )
}

export default ModalDetails

const RadioBox = ({ color, index, isSelected, onSelect, updateOrderDetails ,orderDetails}) => {
    return (
        <div className={modalcss.radio_container}>
            <input
                type="radio"
                id={index}
                className={modalcss.radio_button}
                name="radios"
                onClick={() => { onSelect() }}
                defaultChecked={isSelected}
            />
            <label className={modalcss.radio_label} htmlFor={index} onClick={() => { onSelect(); updateOrderDetails('selectedColor', color) }}>
                <div className={modalcss.radio_custom} style={orderDetails.selectedColor === parseInt(index) ? { backgroundColor: color } : { backgroundColor: color }}>
                    {/* <div style={isSelected===index?{border:"5px solid orange" }:{}} className={modalcss.radio_layer}></div> */}
                </div>
            </label>
        </div>
    );
};




