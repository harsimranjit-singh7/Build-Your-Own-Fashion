import React, { useEffect, useState } from 'react'
import ProductContext from './ProductContext'

const ProductState = () => {
    const [products, setProducts] = useState(["sm"]);

    useEffect(() => {
      initialFetch();
    }, [])
    

    const initialFetch = async() =>{
        try{
            const data = await fetch('http://localhost:5400/api/products/',{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    limit:4
                })
            })
            .then(res=>{return res.json()})
            .catch(err => console.log("Internal Server error"));
            console.log(data);
        }catch(err){
            console.log("Internal Server error");
        }
        console.log("initial fethc")
    }

  <ProductContext.Provider value={{products}}>
    {props.children}
  </ProductContext.Provider>
}

export default ProductState