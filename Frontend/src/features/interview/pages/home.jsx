import React from "react";
import "../style/PrepBuddy.scss";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import InterviewForm from "../components/InterviewForm";
import InterviewHistory from "../components/InterviewHistory";
import Footer from "../components/Footer";

const Home = () => {
    return (
        <div className="pb-page">
            <Navbar />
            <main className="pb-container">
                <div className="pb-main-content">
                    <Hero />
                    <InterviewForm />
                </div>
                <InterviewHistory />
            </main>
            <Footer />
        </div>
    );
};

export default Home;