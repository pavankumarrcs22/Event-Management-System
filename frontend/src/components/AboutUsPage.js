import React, { useState, useEffect } from "react";
import "../App.css";

const AboutUsPage = () => {
    const images = [
        "/images/im6.jpg",

        "/images/im8.jpg",
        "/images/im9.jpg",
        "/images/im10.jpg",
        "/images/im11.jpg",
        "/images/im12.jpg",
        "/images/im5.jpg",
        "/images/im3.jpg",
        "/images/im2.jpg",
        "/images/im4.jpg",
        "/images/im1.jpg",
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 2500);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="about-page">
            {/* Background Image with "About Us" Title */}
            <div
                id="about-background"
                style={{
                    backgroundImage: `url(${images[currentImageIndex]})`,
                }}
            >
                <h1>About Us</h1>
            </div>

            {/* Content Section */}
            <div className="about-content">
                <h2>Welcome to EMS (Event Management System)</h2>
                <p>
                    We are your trusted partner in organizing and managing exceptional events.
                    Our expertise lies in creating unique, memorable experiences for our clients.
                </p>
                <p>
                    Our journey began with the vision of simplifying event management. We combine advanced technology with creativity
                    to provide solutions tailored to your needs. Whether it's a corporate event, wedding, product launch, or virtual
                    conference, we bring your vision to life.
                </p>
                <p>
                    Our team consists of seasoned professionals passionate about excellence. With a focus on innovation and a deep
                    commitment to customer satisfaction, we have successfully managed events for a wide range of clients.
                </p>
                <p>
                    At EMS, we prioritize collaboration and transparency. From planning to execution, our process is designed to keep
                    you informed and stress-free.
                </p>
                <p>
                    Let's create something unforgettable together. Thank you for choosing EMS as your event management partner.
                </p>

                {/* Add More Content */}
                <h2>Our Expertise:</h2>
                <div className="expertise-section">
                    <div className="expertise-block">
                        <h3>Event Planning</h3>
                        <p>We specialize in seamless event planning, ensuring every detail is executed perfectly.</p>
                    </div>
                    <div className="expertise-block">
                        <h3>Venue Management</h3>
                        <p>We help you choose the perfect venue and manage all the logistics for you.</p>
                    </div>
                    <div className="expertise-block">
                        <h3>Vendor Coordination</h3>
                        <p>Our expert team coordinates with vendors to bring the best services to your event.</p>
                    </div>
                    <div className="expertise-block">
                        <h3>Budget Management</h3>
                        <p>We create and stick to budgets, ensuring the best value for your investment.</p>
                    </div>
                    <div className="expertise-block">
                        <h3>Event Marketing</h3>
                        <p>Our marketing strategies help you promote your event and increase audience engagement.</p>
                    </div>
                    <div className="expertise-block">
                        <h3>Real-Time Analytics</h3>
                        <p>We provide real-time insights into your event's performance and attendee interactions.</p>
                    </div>
                    <div className="expertise-block">
                        <h3>Logistics Management</h3>
                        <p>We ensure smooth logistics, including transportation, catering, and equipment setup.</p>
                    </div>
                    <div className="expertise-block">
                        <h3>Post-Event Evaluation</h3>
                        <p>We analyze post-event data to measure success and gather insights for future events.</p>
                    </div>
                </div>

                {/* Call to Action Button */}
                <button onClick={() => window.location.href = "/services"}>Learn More About Our Services</button>
            </div>
        </div>
    );
};

export default AboutUsPage;
