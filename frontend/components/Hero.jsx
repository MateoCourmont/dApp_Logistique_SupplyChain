const Hero = () => {
    return (
        <section id="_hero">

            <div className="hero-left">
                <h1 className="hero-title">
                    MANAGE YOUR SUPPLY CHAIN LIKE NEVER
                </h1>
                <p className="hero-description">
                    The blockchain-based logistics platform which follows steps in the supply chain.
                </p>
                <button className="btn">
                    Start to work!
                </button>
            </div>

            <div className="hero-right">
                <img
                    src="./src/assets/images/driver.avif"
                    alt="Hero Image"
                    className="hero-img"
                />
            </div>
        </section>
    );
};

export default Hero;
