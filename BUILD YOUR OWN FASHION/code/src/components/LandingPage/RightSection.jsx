import React, { useState } from 'react'
import modalcss from "../../assets/styles/Modal.module.css"
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const RightSection = ({product,updateOrderDetails,handleToCart,orderDetails}) => {
    console.log(orderDetails)
    const [noOfItems, setNoOfItems] = useState(1);

    const incrementNo = () => {
        if (noOfItems < 9) {
            setNoOfItems(no => no + 1);
            updateOrderDetails("quantity",noOfItems+1)
        }
    }
    const decrementNo = () => {
        if (noOfItems > 1) {
            setNoOfItems(no => no - 1);
            updateOrderDetails("quantity",noOfItems-1)
        }
    }

    return (
        <div className={modalcss.product_details}>
            <h3>{product.product_name}</h3>
            <p style={{margin:"-15px 0 10px",fontSize:"14px",width:"100%",height:"30px",overflow:'hidden'}}>
                {product.product_desc}
            </p>
            <p style={{fontWeight:600}}>$ {product.base_price} / unit</p>
            <div className={modalcss.selectNo}>
                <button onClick={incrementNo}><FontAwesomeIcon icon={faPlus} /></button>
                <input type='number' value={noOfItems} max={1} min={0} disabled />
                <button onClick={decrementNo}><FontAwesomeIcon icon={faMinus} /></button>
            </div>

            <div className={modalcss.wrap_sizes}>
                {
                    product.available_sizes.map((size, index) => (
                        <RadioBox key={index} index={index} orderDetails={orderDetails} updateOrderDetails={updateOrderDetails}>{size}</RadioBox>
                    ))
                }
            </div>
            <h4 style={{margin:"10px 0"}}>Address Details: </h4>
            <AddressDetails updateOrderDetails={updateOrderDetails}/>
            <button className={modalcss.place_order_btn} onClick={handleToCart}>
                Place Order
            </button>
        </div>
    )
}

export default RightSection;

const RadioBox = ({ children, index ,updateOrderDetails,orderDetails}) => {
    const [isSelected, setIsSelected] = useState(0);

    return (
        <>
            <input type="radio" onChange={updateOrderDetails} name="size" id={index} checked={isSelected=== index}/>
            <label htmlFor={index} className={orderDetails.selectedSize===children?modalcss.size_selected:modalcss.size_disselected}
            onClick={
                ()=>{
                    setIsSelected(index)
                    updateOrderDetails("selectedSize",children)
                }
            }
            >{children}</label>
        </>
    );
};

const AddressDetails = (props) =>{
    return(
        <form className={modalcss.address_details_form} name="address_details">
            <textarea rows={3} cols={44} placeholder='Enter Your Bunglow No.,Street details etc.' onChange={(e) => props.updateOrderDetails('address', e.target.value)}/>
            <div className={modalcss.cityPincode}>
            <input name='city' type='text' placeholder='Enter City name' onChange={(e) => props.updateOrderDetails('city', e.target.value)} ></input>
            <input type='text' min={6} maxLength={6} name='pincode' placeholder='Enter Your Pincode' onChange={(e) => props.updateOrderDetails('pincode', e.target.value)}></input>
            </div>
        </form>
    )
}
