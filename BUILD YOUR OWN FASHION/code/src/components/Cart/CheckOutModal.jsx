import React, { useState } from 'react';
import modalcss from "../../assets/styles/CheckOutModal.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import completeImg from '../../assets/images/completeOrder.jpg';
import { useNavigate } from 'react-router-dom';

const CheckOutModal = ({ toggleModal, pendingOrders ,totalAmount}) => {
    const [complete, setComplete] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        shippingAddress: '',
        city: '',
        stateProvince: '',
        postalCode: '',
        country: '',
        creditCardNumber: '',
        nameOnCard: '',
        cvv: '',
        expiryMonth: '',
        expiryYear: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.target.innerHTML = "Ordering...";
        const orderIds = [];
        pendingOrders.forEach((element, index) => {
            orderIds.push(element.order_id)
        });
        formData.orderIds = orderIds;
        console.log(formData)

        /*Finalizing orders */

        fetch(`http://localhost:5400/api/order/updateStatusToPlaced`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (response) {
                    e.target.innerHTML = "Place Order";
                    return response.json();
                } 
            })
            .then(data => {
                //if successfull go to landing page
                if(data.success){
                    setTimeout(() => {
                        navigate('/')
                    }, 5000);
                    setComplete(true)
                }else{
                    alert(data.message)
                }
            })
            .catch(error => {
                alert(error)
            });
    };

    return (
        <div className={modalcss.modal}>
            {
                complete === true ?
                    <div className={modalcss.completeMark}>
                        <div className={modalcss.completeImg}>
                            <img src={completeImg} alt='Order Completed' />
                        </div>
                        <button onClick={() => navigate('/')}>Order Placed!!</button>
                    </div>
                    :
                    <>
                        <div className={modalcss.left_section}>
                            <div className={modalcss.shipping_details_section}>
                                <h3>Shipping Details</h3>
                                <input type='text' name='shippingAddress' placeholder='Shipping Address' value={formData.shippingAddress} onChange={handleInputChange} />
                                <input type='text' name='city' placeholder='City' value={formData.city} onChange={handleInputChange} />
                                <input type='text' name='stateProvince' placeholder='State/Province' value={formData.stateProvince} onChange={handleInputChange} />
                                <input type='text' name='postalCode' placeholder='Postal/ZIP Code' value={formData.postalCode} onChange={handleInputChange} />
                                <input type='text' name='country' placeholder='Country' value={formData.country} onChange={handleInputChange} />
                            </div>

                            <div className={modalcss.credit_card_section}>
                                <h3>Credit Card Details</h3>
                                <input type='text' name='creditCardNumber' placeholder='Credit Card Number' value={formData.creditCardNumber} onChange={handleInputChange} />
                                <input type='text' name='nameOnCard' placeholder='Name on Card' value={formData.nameOnCard} onChange={handleInputChange} />
                                <input type='text' name='cvv' placeholder='CVV' maxLength='3' value={formData.cvv} onChange={handleInputChange} />
                                <div className={modalcss.expiry_section}>
                                    <input type='text' name='expiryMonth' placeholder='Expiry Month (MM)' maxLength='2' value={formData.expiryMonth} onChange={handleInputChange} />
                                    <input type='text' name='expiryYear' placeholder='Expiry Year (YY)' maxLength='2' value={formData.expiryYear} onChange={handleInputChange} />
                                </div>
                            </div>

                            <button className={modalcss.confirm_button} onClick={handleSubmit}>Confirm Order</button>
                        </div>

                        <div className={modalcss.right_section}>
                            <div className={modalcss.charges_section}>
                                <p>Items : {pendingOrders.length}</p>
                                <p>Amount: ${totalAmount}</p>
                                <p>Shipping Charges: $10</p>
                                <p>Total Amount: ${Math.abs(totalAmount+10).toFixed(2)}</p>
                            </div>
                        </div>

                        <FontAwesomeIcon
                            onClick={toggleModal}
                            size='lg'
                            style={{ position: "absolute", top: 20, right: 20, cursor: "pointer" }}
                            icon={faClose}
                            color={"#004945"}
                        />
                    </>
            }
        </div>
    );
}

export default CheckOutModal;
