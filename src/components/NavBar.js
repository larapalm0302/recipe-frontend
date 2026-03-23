import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/navbar.css";

const logo = require("../images/logo.png");

export default function NavBar({ onLogout }) {
	const navigate = useNavigate();

	return (
		<header className="dashboard-header">
			<img
				src={logo}
				alt="Flour Power Bakery Logo"
				className="dashboard-logo"
			/>

			<nav className="dashboard-nav">
				<button onClick={() => navigate("/dashboard")}>Dashboard</button>
				<button onClick={() => navigate("/recipes")}>Recepten</button>
				<button onClick={() => navigate("/profile")}>Profiel</button>
				<button onClick={onLogout} className="logout-button">
					Logout
				</button>
			</nav>
		</header>
	);
}
