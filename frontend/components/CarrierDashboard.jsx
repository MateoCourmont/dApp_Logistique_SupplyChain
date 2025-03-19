import React, { useContext } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { ThemeContext } from '../src/ThemeContext'
import { useWallet } from '../src/WalletContext'
const CarrierDashboard = () => {
  const { theme } = useContext(ThemeContext)
  const { account } = useWallet()

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    swipe: false,
    draggable: false,
    responsive: [
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
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
        },
      },
      {
        breakpoint: 501,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }

  // Si l'utilisateur n'est pas connecté, on n'affiche pas le contenu dynamique (dashboard)
  if (!account || account === null) {
    return <div>Please connect your wallet to access the dashboard.</div>
  }

  return (
    <div className="dashboards-container">
      <Slider {...settings}>
        <div
          className={`cards ${theme === 'dark' ? 'cards-dark' : 'cards-light'}`}
        >
          <img src="./src/assets/images/create-exp.jpg" alt="card image" />
          <div className="card-text">
            <h1
              className={`card-title ${theme === 'dark' ? 'card-title-dark' : 'card-title-light'}`}
            >
              Join a shipment
            </h1>
            <p className="card-description"></p>
          </div>
        </div>
        <div
          className={`cards ${theme === 'dark' ? 'cards-dark' : 'cards-light'}`}
        >
          <img src="./src/assets/images/create-exp.jpg" alt="card image" />
          <div className="card-text">
            <h1
              className={`card-title ${theme === 'dark' ? 'card-title-dark' : 'card-title-light'}`}
            >
              Get a shipment by ID
            </h1>
            <p className="card-description"></p>
          </div>
        </div>
        <div
          className={`cards ${theme === 'dark' ? 'cards-dark' : 'cards-light'}`}
        >
          <img src="./src/assets/images/create-exp.jpg" alt="card image" />
          <div className="card-text">
            <h1
              className={`card-title ${theme === 'dark' ? 'card-title-dark' : 'card-title-light'}`}
            >
              Complete shipment information
            </h1>
            <p className="card-description"></p>
          </div>
        </div>
        <div
          className={`cards ${theme === 'dark' ? 'cards-dark' : 'cards-light'}`}
        >
          <img src="./src/assets/images/create-exp.jpg" alt="card image" />
          <div className="card-text">
            <h1
              className={`card-title ${theme === 'dark' ? 'card-title-dark' : 'card-title-light'}`}
            >
              User profile
            </h1>
            <p className="card-description"></p>
          </div>
        </div>
      </Slider>
    </div>
  )
}

export default CarrierDashboard
