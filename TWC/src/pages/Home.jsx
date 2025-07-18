import React from 'react';
import ImageSlider from '../components/ImageSlider';
import HomeComponent from './HomeComponent';
import KitchenComponent from './KitchenComponent';

const Home = () => {
    return (
        <div
            style={{
                // paddingTop: '60px', // Match your navbar height on mobile
                boxSizing: 'border-box'
            }}
        >
            <ImageSlider />
            <div
                style={{
                    paddingLeft: '1rem',
                    paddingRight: '1rem',
                    paddingTop: '2rem',
                    paddingBottom: '2rem',
                }}
            >
                <HomeComponent />
                <div style={{ marginTop: '3rem', marginBottom: '3rem' }} />
                <KitchenComponent />
            </div>
        </div>
    );
};


export default Home;