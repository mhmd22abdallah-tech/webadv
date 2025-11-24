import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import about from "../images/about.png"

function About() {
    const [year, setYear] = useState();
    const startYear = 1899; // Year FC Barcelona was founded

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        setYear(currentYear - startYear);
    }, [year]);

    return (
        <div className="container py-5">
            <div className="row align-items-center">
                <div className="col-lg-6">
                    <img className="img-fluid mb-4 mb-lg-0" src={about} alt="Image" />
                </div>
                <div className="col-lg-6">
                    <h2 className="display-4 font-weight-bold mb-4">{year} Years Of Making History</h2>
                    <p>FC Barcelona, one of the most iconic football clubs in the world, has a rich history that spans over {year} years. From its humble beginnings in 1899 to becoming a global symbol of excellence, passion, and success, Barça has always remained true to its roots while achieving incredible milestones in the world of football.</p>
                    <div className="row py-2">
                        <div className="col-sm-6">
                            <i className="flaticon-barbell display-2 text-primary"></i>
                            <h4 className="font-weight-bold">Legendary Football Club</h4>
                            <p>With a legacy of winning prestigious trophies, including multiple La Liga and UEFA Champions League titles, FC Barcelona is a force to be reckoned with in the football world.</p>
                        </div>
                        <div className="col-sm-6">
                            <i className="flaticon-medal display-2 text-primary"></i>
                            <h4 className="font-weight-bold">Award Winning Team</h4>
                            <p>Throughout its history, Barça has consistently demonstrated exceptional talent and sportsmanship, earning the admiration of fans worldwide and securing countless accolades.</p>
                        </div>
                    </div>
                    <Link to="/about" className="btn btn-lg px-4 btn-outline-danger">Learn More</Link>
                </div>
            </div>
        </div>
    );
}

export default About;
