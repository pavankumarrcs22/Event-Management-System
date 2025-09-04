import React, { useState, useEffect } from "react";
import "../App.css";

const ServicesPage = () => {
    const images = [
        "/images/im5.jpg",
        "/images/im3.jpg",
        "/images/im6.jpg",

        "/images/im8.jpg",
        "/images/im9.jpg",
        "/images/im10.jpg",
        "/images/im11.jpg",
        "/images/im12.jpg",
        "/images/im2.jpg",
        "/images/im4.jpg",
        "/images/im1.jpg",
    ]; // Add the paths to your service images here

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 2500); // Change background every 2.5 seconds
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="services-page">
            {/* Background Image with "Our Services" Title */}
            <div
                id="services-background"
                style={{
                    backgroundImage: `url(${images[currentImageIndex]})`,
                }}
            >
                <h1>Our Services</h1>
            </div>

            {/* Content Section */}
            <div className="services-content">
                <h2>Welcome to Our Services</h2>
                <p>
                    At EMS, we offer a wide range of services designed to make your event unforgettable.
                    From planning to execution, we ensure that every detail is taken care of.
                </p>
                <p>
                    Our services are tailored to your needs, whether you're hosting a corporate event, a wedding, or a large public gathering.
                    Let us manage the details while you focus on enjoying the moment.
                </p>
                <p>
                    With years of experience in the event management industry, we bring creativity, professionalism, and passion to every event we manage.
                </p>

                {/* Services Section */}
                <h2>Our Core Services:</h2>
                <div className="services">
                    <div className="services-block">
                        <h3>Event Planning</h3>
                        <p>We take care of every aspect of planning, from concept to execution, ensuring your event is a success.</p>
                    </div>
                    <div className="services-block">
                        <h3>Venue Management</h3>
                        <p>We help you find the perfect venue and handle all the logistics, making the process effortless for you.</p>
                    </div>
                    <div className="services-block">
                        <h3>Vendor Coordination</h3>
                        <p>We work closely with trusted vendors to provide the best quality services for your event, such as catering, décor, and more.</p>
                    </div>
                    <div className="services-block">
                        <h3>Guest Management</h3>
                        <p>Our team ensures a smooth guest experience, from invitations and RSVPs to check-ins and seating arrangements.</p>
                    </div>
                    <div className="services-block">
                        <h3>Event Marketing</h3>
                        <p>We help you promote your event to the right audience, ensuring maximum attendance and engagement.</p>
                    </div>
                    <div className="services-block">
                        <h3>Real-Time Analytics</h3>
                        <p>We provide live data and insights to help you understand guest behavior and make real-time adjustments to the event.</p>
                    </div>
                    <div className="services-block">
                        <h3>Logistics & Transportation</h3>
                        <p>We handle all logistical aspects, including transportation, deliveries, and set-up to make sure your event goes smoothly.</p>
                    </div>
                    <div className="services-block">
                        <h3>Post-Event Evaluation</h3>
                        <p>After the event, we analyze feedback, provide performance insights, and suggest improvements for future events.</p>
                    </div>
                </div>
                <button onClick={() => alert("Contact Us for a Custom Quote!")}>Get a Custom Quote</button>
            </div>
        </div>
    );
};

export default ServicesPage;
