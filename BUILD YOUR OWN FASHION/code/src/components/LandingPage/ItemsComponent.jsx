import React, { useEffect, useState } from 'react'
import appcss from "../../assets/styles/App.module.css"
import ItemModal from './ItemModal'
import { Image } from 'cloudinary-react'
import { useNavigate } from 'react-router-dom'

const ItemsComponent = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    const navigate = useNavigate();
    const priceRanges = [
        { label: "All Prices", min: 0, max: Infinity },
        { label: "$0 - $50", min: 0, max: 50 },
        { label: "$50 - $100", min: 50, max: 100 },
        { label: "$100 - $500", min: 100, max: 500 },
        { label: "$500+", min: 500, max: Infinity }
    ];

    const handlePriceRangeChange = (range) => {
        setMinPriceFilter(range.min);
        setMaxPriceFilter(range.max);
    }

    const initialFetch = async () => {
        const auth_token = localStorage.getItem("auth_token");
        try {
            const data = await fetch('http://localhost:5400/api/products/', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth_token": auth_token
                },
                body: JSON.stringify({
                    limit: 4
                })
            })
                .then(res => { return res.json() })
                .catch(err => console.log("Internal Server error" + err));
            if (data.success) {
                setAllProducts(data.products);
                setFilteredProducts(data.products);
                console.log(data.products)
                console.log(`ecomm/${allProducts[0].product_images[0]}`)
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

    const showAllFetch = async (e) => {
        const auth_token = localStorage.getItem("auth_token");
        e.target.innerHTML = "Fetching..."
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
                e.target.style.display = "none";
                setAllProducts(data.products);
                applyFilters()
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

    useEffect(() => {
        initialFetch();
    }, [])

    useEffect(() => {
        setFilteredProducts(allProducts);
        setMaxPriceFilter(Math.max(...allProducts.map(p => parseFloat(p.base_price))));
    }, [allProducts]);
    

    const [tagsFilter, setTagsFilter] = useState([]);
    const [minPriceFilter, setMinPriceFilter] = useState(0);
    const [maxPriceFilter, setMaxPriceFilter] = useState(Math.max(...allProducts.map(p => parseFloat(p.base_price))));


    // Extracting unique tags from all products
    const availableTags = [...new Set(allProducts.flatMap(product => product.tags))];

    const applyFilters = () => {
        let filtered = [...allProducts];
        console.log(tagsFilter)
    
        if (tagsFilter.length > 0) {
            filtered = filtered.filter(product => tagsFilter.some(tag => product.tags.includes(tag)));
        }
    
        filtered = filtered.filter(product => parseFloat(product.base_price) >= minPriceFilter && parseFloat(product.base_price) <= maxPriceFilter);
        setFilteredProducts(filtered);
    }
    const handleTagChange = (event) => {
        const tag = event.target.value;
        if(tag === ""){
            setTagsFilter(availableTags)
            return;
        }

        if (tagsFilter.includes(tag)) {
            setTagsFilter(prevTags => prevTags.filter(t => t !== tag));
            console.log(tagsFilter.filter(t => t !== tag))
        } else {
            setTagsFilter([tag]);
        }
    }

    useEffect(() => {
        applyFilters();
    }, [tagsFilter, minPriceFilter, maxPriceFilter]);

    return (
        <div className={appcss.items_main_component}>
            <h1>Featured Products</h1>

            {/* Filter section */}
            <div className={appcss.filters}>
                {/* Tags filter dropdown */}
                <div>
                    <label>Filter by Tag: </label>
                    <select onChange={handleTagChange}>
                        <option value="">All Tags</option>
                        {availableTags.map(tag => (
                            <option key={tag} value={tag}>
                                {tag}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Price filter dropdown */}
                <div>
                    <label>Filter by Price: </label>
                    <select onChange={(e) => handlePriceRangeChange(priceRanges[e.target.selectedIndex])}>
                        {priceRanges.map(range => (
                            <option key={range.label} value={range.label}>
                                {range.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Products list */}
            <div className={appcss.items_list}>
                <div className={appcss.items}>
                    {
                        filteredProducts.map(product => (
                            <CardComponent key={product._id} product={product} />
                        ))
                    }
                </div>
            </div>
            <button type="button" onClick={showAllFetch}>Show All Products</button>
        </div>
    )
}

export default ItemsComponent


const CardComponent = ({ product }) => {
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
            </div>
            <div className={appcss.card_details}>
                <h3>{product.product_name}</h3>
                <p>$ {product.base_price}</p>
            </div>
            <div className={appcss.card_button}>
                <ItemModal product={product} />
            </div>
        </div>
    )
}
