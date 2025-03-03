import React, { useContext } from 'react';
import { ThemeContext } from '../src/ThemeContext'; 

const CarrierDashboard = () => {
    // Accéder au contexte du thème
    const { theme } = useContext(ThemeContext);

    return (   
        <div className='dashboards-container'>
            <div className={`cards ${theme === 'dark' ? 'cards-dark' : 'cards-light'}`}>
                <img src="./src/assets/images/create-exp.jpg" alt="card image" />
                <div className='card-text'>
                    <h1 className={`card-title ${theme === 'dark' ? 'card-title-dark' : 'card-title-light'}`}>Create an expedition</h1>
                    <p className='card-description'>Specify the details of your expedition :
                        <ul>
                            <li>Receiver address</li>
                            <li>Pickup location</li>
                            <li>Delivery location</li>
                            <li>Price</li>
                        </ul>
                    </p>
                </div>
            </div>
        </div> 
    ); 
};

export default CarrierDashboard; 