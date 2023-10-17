import React, { useEffect, useRef } from 'react'
import carousels from '../../assets/styles/Carousels.module.css';
import banner1 from "../../assets/images/banners/banner1.jpg"
import banner2 from "../../assets/images/banners/banner2.jpg"
import banner3 from "../../assets/images/banners/banner3.jpg"

const Carousels = () => {
    const parent = useRef(null);
    const bannersArr = [banner1,banner2,banner3];
    const bannerArrLength = bannersArr.length;

    useEffect(() => {
        const inputs = parent.current.querySelectorAll("input");
        let current = 0;
        const changeImg = () => {
            setInterval(() => {
                inputs[current].checked = false;
                current = (current + 1) % bannerArrLength;
                inputs[current].checked = true;
            }, 3000);
        }
        changeImg();
    }, [bannerArrLength])

    return (
        <main className={carousels.main}>
            <div className={carousels.carousel}>
                <div className={carousels.carousel_controls} ref={parent}>
                    {
                        bannersArr.map((element, index) => (
                            <input 
                                key={index}
                                id={index}
                                type="radio"
                                name="controls"
                            />
                        ))
                    }
                    <div className={carousels.carousel_images}>
                        {
                            bannersArr.map(banner => (
                                <CarouselsImg key={banner} banner={banner} />
                            ))
                        }
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Carousels

const CarouselsImg = ({ banner }) => {
    return (
        <div>
            <img src={banner} alt='Banner' />
        </div>
    )
}