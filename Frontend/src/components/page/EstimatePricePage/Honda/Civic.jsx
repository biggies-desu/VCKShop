import React from "react";
import Navbar from "../../../Navbar.jsx";
import Footer from "../../../Footer.jsx";
import { Link } from "react-router-dom";

function Civic() {
    return <>
    <Navbar />
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-5">Civic</h1>
            <Link to="/EstimatePrice">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg">
                    Back
                </button>
            </Link>
        </div>
    <Footer />
    </>
}

export default Civic;
