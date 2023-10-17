import React, { useState } from 'react'
import modalcss from "../../assets/styles/Modal.module.css"
import ModalDetails from './ModalDetails';

const ItemModal = ({product}) => {
  const [open, setOpen] = useState(false);
  const toggleModal = () => {
    console.log("this")
      setOpen(open=>!open);
  }
  return (
    <>
      <button type='button' onClick={toggleModal}>Details</button>
      {
        open ?
          <div className={modalcss.main_body}>
            <div onClick={toggleModal} className={modalcss.modal_background}>
            </div>
            <ModalDetails product={product} toggleModal={toggleModal}/>
          </div>
          :
          <>
          </>
      }
    </>
  )
}

export default ItemModal