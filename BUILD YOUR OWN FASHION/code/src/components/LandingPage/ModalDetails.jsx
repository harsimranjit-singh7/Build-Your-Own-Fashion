import React, { Children, useState } from 'react'
import modalcss from "../../assets/styles/Modal.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleLeft, faCircleRight, faClose } from '@fortawesome/free-solid-svg-icons'
import RightSection from './RightSection'
import { Image } from 'cloudinary-react'
import { useNavigate } from 'react-router-dom'
import { Alert } from '../Alert'

const ModalDetails = ({ toggleModal, product }) => {
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState("");
    const [imageno, setImageno] = useState(product.product_images[0]);
    const [selectedRadio, setSelectedRadio] = useState(0);
    const [orderDetails, setOrderDetails] = useState({ 
        product_id: product.product_id, 
        unit_price: product.base_price,
        selectedColor:product.available_colors[0],
        selectedSize:product.available_sizes[0],
        selectedStyle:"",
        quantity:1
    });
    const navigate = useNavigate();

    const updateOrderDetails = (key, value) => {
        setOrderDetails(prevState => ({
            ...prevState,
            [key]: value
        }));
        if(key==="selectedStyle"){
            setImageno(product.product_name + product.product_id+'/styles/'+product.available_colors[selectedRadio]+value)
            setOrderDetails(prevState => ({
                ...prevState,
                unit_price:product.available_styles.filter((e)=>{return e.name === value})[0].price
            }))
        }
    };

    const handleToCart = async(e) => {
        const auth_token = localStorage.getItem("auth_token");
        console.log(orderDetails)
        e.target.disabled = true;
        try {
            e.target.innerHTML = "Adding..."
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
                    e.target.disabled = false;
                    navigate('/cart');
                    return;
                }, 500);
                e.target.innerHTML = "Added to Cart Successfully!";
            } else {
                if (data && data.redirect) {
                    setTimeout(() => {
                        setVisible(false);
                        setData("");
                        navigate(data.redirect);
                        return;
                    }, 3000);
                    setVisible(true);
                    e.target.innerHTML = "Add to Cart"
                    setData("You are not authenticate, Redirected to Login page");
                }else{
                    alert(data.msg);
                    e.target.innerHTML = "Add to Cart"
                    throw Error("Internal Server error");
                }
            }
        } catch (err) {
            console.log("Internal Server error" + err);
        }
    }

    return (
        <div className={modalcss.modal}>
            <div className={modalcss.left_section}>
                <div className={modalcss.item_image}>
                    {/* {
                        product.product_images.length > 1 ?
                            <div className={modalcss.image_cover}>
                                <button onClick={() => {console.log(imageno);setImageno(no => (Math.abs(no - 1)) % product.product_images.length)}}><FontAwesomeIcon size='xl' icon={faCircleLeft} /></button>
                                <button onClick={() => setImageno(no => (no + 1) % product.product_images.length)}><FontAwesomeIcon size='xl' icon={faCircleRight} /></button>
                            </div>
                            :
                            <></>
                    } */}
                    <Image
                        cloudName="dxahez5ol"
                        publicId={`ecomm/${imageno}`}
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
                                        selectedRadio={selectedRadio}
                                        onSelect={() => { setSelectedRadio(index);setImageno(`${product.product_name}${product.product_id}/${product.product_name}${product.product_id}${color}`);delete orderDetails.selectedStyle;updateOrderDetails("unit_price",parseFloat(product.base_price))}}
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
                <RightSection product={product} orderDetails={orderDetails} updateOrderDetails={updateOrderDetails} handleToCart={handleToCart} selectedRadio={selectedRadio}/>
            </div>
            <FontAwesomeIcon
                onClick={toggleModal}
                size='lg'
                style={{ position: "absolute", top: 20, right: 20, cursor: "pointer" }}
                icon={faClose}
                color={"#004945"}
            />
            <div style={visible ? { display: "block",position:"absolute", top: "10px", transition: "top .5s ease-in", transform: "50% 50%" } : {}} className={modalcss.alert}>{data}</div>
        </div>
    )
}

export default ModalDetails

const RadioBox = ({ color, index, isSelected, onSelect, updateOrderDetails ,selectedRadio}) => {
    console.log(selectedRadio)
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
            <label className={modalcss.radio_label} htmlFor={index} onClick={() => { onSelect(); updateOrderDetails('selectedColor', color) }} style={selectedRadio === index ? {border:"3px solid black",borderRadius:"999px"}:{border:"3px solid white"}}>
                <div className={modalcss.radio_custom} style={selectedRadio === color ? { backgroundColor: color } : { backgroundColor: color }}>
                    {/* <div style={isSelected===index?{border:"5px solid orange" }:{}} className={modalcss.radio_layer}></div> */}
                </div>
            </label>
        </div>
    );
};




