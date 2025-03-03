import React, { useContext } from 'react';
import { ThemeContext } from '../src/ThemeContext'; 

const SenderDashboard = () => {
    // Accéder au contexte du thème
    const { theme } = useContext(ThemeContext);

    return (
        <div className='dashboards-container'>
            <div className={`cards ${theme === 'dark' ? 'cards-dark' : 'cards-light'}`}>
                <img src="./src/assets/images/create-exp.jpg" alt="card image" />
                <div className='card-text'>
                    <h1 className={`card-title ${theme === 'dark' ? 'card-title-dark' : 'card-title-light'}`}>Join an expedition</h1>
                    <p className='card-description'>You will be able to deliver the product to the receiver</p>
                </div>
            </div>
        </div>
    )
};

export default SenderDashboard;