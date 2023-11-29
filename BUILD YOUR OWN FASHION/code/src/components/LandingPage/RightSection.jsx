import React, { useRef, useState } from 'react'
import modalcss from "../../assets/styles/Modal.module.css"
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const RightSection = ({ product, updateOrderDetails, handleToCart, orderDetails, selectedRadio }) => {
    const [noOfItems, setNoOfItems] = useState(1);

    const incrementNo = () => {
        if (noOfItems < 9) {
            setNoOfItems(no => no + 1);
            updateOrderDetails("quantity", noOfItems + 1)
        }
    }
    const decrementNo = () => {
        if (noOfItems > 1) {
            setNoOfItems(no => no - 1);
            updateOrderDetails("quantity", noOfItems - 1)
        }
    }

    return (
        <div className={modalcss.product_details}>
            <h3>{product.product_name}</h3>
            <p style={{ margin: "-15px 0 10px", fontSize: "14px", width: "100%", height: "30px", overflow: 'hidden' }}>
                {product.product_desc}
            </p>
            <p style={{ fontWeight: 600 }}>$ {orderDetails.unit_price} / unit</p>
            <div className={modalcss.selectNo}>
                <button style={{ padding: "7px 9px" }} onClick={incrementNo}><FontAwesomeIcon icon={faPlus} /></button>
                <input style={{ display: "block", width: "35px" }} className={modalcss.selectNoInput} type='number' value={noOfItems} max={1} min={0} disabled />
                <button style={{ padding: "7px 9px" }} onClick={decrementNo}><FontAwesomeIcon icon={faMinus} /></button>
            </div>

            <div className={modalcss.wrap_sizes}>
                {
                    product.available_sizes.map((size, index) => (
                        <RadioBox key={index} index={index} orderDetails={orderDetails} updateOrderDetails={updateOrderDetails}>{size}</RadioBox>
                    ))
                }
            </div>


            <h4 style={{ margin: "10px 0" }}>Available Styles: </h4>
            {/* <AddressDetails updateOrderDetails={updateOrderDetails}/> */}
            {   
                product.available_styles && product.available_styles.filter((e) => {return e.color === product.available_colors[selectedRadio]}).length > 0?
                <div className={`${modalcss.wrap_styles} ${modalcss.wrap_sizes}`}>
                    {
                    product.available_styles.filter((e) => {return e.color === product.available_colors[selectedRadio]}).map((style, index) => (
                        <>
                        <StylesRadio key={index} index={index} orderDetails={orderDetails} updateOrderDetails={updateOrderDetails}>{style.name}</StylesRadio>
                        </>
                        ))
                        
                    }
                </div>
                :
                <p>No Style for this color</p>
            }
            
            <button className={modalcss.place_order_btn} onClick={handleToCart}>
                Add to Cart
            </button>
        </div>
    )
}

export default RightSection;

const RadioBox = ({ children, index, updateOrderDetails, orderDetails }) => {
    const [isSelected, setIsSelected] = useState(0);

    return (
        <>
            <input type="radio" onChange={updateOrderDetails} name="size" id={index} checked={isSelected === index} />
            <label htmlFor={index} className={orderDetails.selectedSize === children ? modalcss.size_selected : modalcss.size_disselected}
                onClick={
                    () => {
                        setIsSelected(index)
                        updateOrderDetails("selectedSize", children)
                    }
                }
            >{children}</label>
        </>
    );
};

const StylesRadio = ({ children, index, updateOrderDetails, orderDetails }) => {
    const [isSelected, setIsSelected] = useState(0);

    return (
        <>
            <input type="radio" onChange={updateOrderDetails} name="size" id={index} checked={isSelected === index} />
            <label style={{width:"fit-content"}} htmlFor={index} className={orderDetails.selectedStyle === children ? modalcss.size_selected : modalcss.size_disselected}
                onClick={
                    () => {
                        setIsSelected(index)
                        updateOrderDetails("selectedStyle", children)
                    }
                }
            >{children}</label>
        </>
    );
};