import React, { useState } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './ImageSlider.css'; // Import the CSS

const ImageSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0); // Track current slide

    const settings = {
        dots: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        fade: true,
        pauseOnHover: false,
        beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex), // Update current slide
    };

    const slides = [
        { image: './images/slideBar1.jpeg', text: 'Welcome to Our Website' },
        { image: './images/LShape.png', text: 'Experience the Best Services' },
        { image: './images/island3.jpg', text: 'Innovation & Creativity' },
        { image: './images/Sofa(1).jpeg', text: 'Your Satisfaction, Our Priority' },
    ];

    return (
        <div className="slider-container">
            <Slider {...settings} className='custom-slider'>
            {slides.map((slide, index) => (
                <div key={index} className="slide">
                    <img src={slide.image} alt={`Slide ${index}`} />
                    <div className="slider-content">
                    <h1>{slide.text}</h1>
                    </div>
                </div>
                ))}
            </Slider>
        </div>
    );
};

export default ImageSlider;