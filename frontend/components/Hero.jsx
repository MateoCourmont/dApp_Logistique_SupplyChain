const Hero = () => {
    return (
        <div className="hero w-full h-2/3 flex items-start justify-between px-8 py-12 pl-20">

            <div className="hero-text-content flex flex-col items-start justify-center gap-6 w-full md:w-1/2">
                <h1 className="hero-title text-4xl md:text-5xl font-bold leading-tight">
                    Welcome to Xchain
                </h1>
                <p className="hero-description text-lg md:text-xl text-start max-w-lg">
                    The blockchain-based logistics platform which follows steps in the supply chain.
                </p>
            </div>

            <div className="hero-img-content w-full md:w-1/2">
                <img
                    src="./src/assets/images/hero-img.jpg"
                    alt="Hero Image"
                    className="hero-img max-w-full h-3/4"
                />
            </div>
        </div>
    );
};

export default Hero;
