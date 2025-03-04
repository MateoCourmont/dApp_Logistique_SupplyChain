import React, { useContext } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ThemeContext } from '../src/ThemeContext'; 

const SenderDashboard = () => {
    // Accéder au contexte du thème
    const { theme } = useContext(ThemeContext);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        swipe: false,
        draggable: false,
        arrows: true,
        prevArrow: <button className="slick-prev">Prev</button>,
        nextArrow: <button className="slick-next">Next</button>,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 769,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,  
                }
            },
            {
                breakpoint: 501,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <div className='dashboards-container'>
            <Slider {...settings}>
                <div className={`cards ${theme === 'dark' ? 'cards-dark' : 'cards-light'}`}>
                    <img src="./src/assets/images/create-exp.jpg" alt="card image" />
                    <div className='card-text'>
                        <h1 className={`card-title ${theme === 'dark' ? 'card-title-dark' : 'card-title-light'}`}>Create a shipment</h1>
                        <p className='card-description'></p>
                    </div>
                </div>
                <div className={`cards ${theme === 'dark' ? 'cards-dark' : 'cards-light'}`}>
                    <img src="./src/assets/images/create-exp.jpg" alt="card image" />
                    <div className='card-text'>
                        <h1 className={`card-title ${theme === 'dark' ? 'card-title-dark' : 'card-title-light'}`}>Get a shipment by ID</h1>
                        <p className='card-description'></p>
                    </div>
                </div>
                <div className={`cards ${theme === 'dark' ? 'cards-dark' : 'cards-light'}`}>
                    <img src="./src/assets/images/create-exp.jpg" alt="card image" />
                    <div className='card-text'>
                        <h1 className={`card-title ${theme === 'dark' ? 'card-title-dark' : 'card-title-light'}`}>Get all shipments</h1>
                        <p className='card-description'></p>
                    </div>
                </div>
                <div className={`cards ${theme === 'dark' ? 'cards-dark' : 'cards-light'}`}>
                    <img src="./src/assets/images/create-exp.jpg" alt="card image" />
                    <div className='card-text'>
                        <h1 className={`card-title ${theme === 'dark' ? 'card-title-dark' : 'card-title-light'}`}>Realese payment for the shipment</h1>
                        <p className='card-description'></p>
                    </div>
                </div>
                <div className={`cards ${theme === 'dark' ? 'cards-dark' : 'cards-light'}`}>
                    <img src="./src/assets/images/create-exp.jpg" alt="card image" />
                    <div className='card-text'>
                        <h1 className={`card-title ${theme === 'dark' ? 'card-title-dark' : 'card-title-light'}`}>User profile</h1>
                        <p className='card-description'></p>
                    </div>
                </div>
            </Slider>
        </div>
    )
};

export default SenderDashboard;