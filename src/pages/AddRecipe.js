import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import "../styles/recipes.css";

export default function AddRecipe() {
	const navigate = useNavigate();
	const [form, setForm] = useState({
		title: "",
		category: "",
		description: "",
		ingredients: "",
		instructions: "",
	});
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [imageFile, setImageFile] = useState(null);

	const handleLogout = () => {
		localStorage.removeItem("authToken");
		localStorage.removeItem("authUser");
		navigate("/");
	};

	const handleChange = (event) => {
		const { name, value } = event.target;
		setForm((previous) => ({ ...previous, [name]: value }));
	};

	const handleImageChange = (event) => {
		const file = event.target.files?.[0] || null;
		setImageFile(file);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setError("");

		const token = localStorage.getItem("authToken");
		if (!token) {
			navigate("/");
			return;
		}

		if (!form.title || !form.description || !form.ingredients || !form.instructions) {
			setError("Vul alle verplichte velden in.");
			return;
		}

		setIsLoading(true);
		try {
			const payload = new FormData();
			payload.append("title", form.title);
			payload.append("category", form.category);
			payload.append("description", form.description);
			payload.append("ingredients", form.ingredients);
			payload.append("instructions", form.instructions);
			if (imageFile) {
				payload.append("image", imageFile);
			}

			const response = await fetch(
				`${process.env.REACT_APP_API_URL || "http://127.0.0.1:8000"}/api/recipes`,
				{
					method: "POST",
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: payload,
				}
			);

			if (!response.ok) {
				const data = await response.json().catch(() => ({}));
				throw new Error(data.message || "Recept toevoegen is mislukt.");
			}

			navigate("/dashboard");
		} catch (submitError) {
			setError(submitError.message || "Er ging iets mis.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="recipes-page">
			<NavBar onLogout={handleLogout} />
			<main className="recipes-wrap">
				<div className="recipes-head">
					<h1>Nieuw Recept</h1>
				</div>

				{error && <p className="recipes-error">{error}</p>}

				<form className="recipe-form" onSubmit={handleSubmit}>
					<label>
						Titel *
						<input name="title" value={form.title} onChange={handleChange} />
					</label>

					<label>
						Categorie
						<input name="category" value={form.category} onChange={handleChange} />
					</label>

					<label>
						Beschrijving *
						<textarea name="description" rows="3" value={form.description} onChange={handleChange} />
					</label>

					<label>
						Ingrediënten *
						<textarea name="ingredients" rows="4" value={form.ingredients} onChange={handleChange} />
					</label>

					<label>
						Bereiding *
						<textarea name="instructions" rows="5" value={form.instructions} onChange={handleChange} />
					</label>

					<label>
						Afbeelding
						<input type="file" accept="image/*" onChange={handleImageChange} />
					</label>

					{imageFile && <p>Gekozen bestand: {imageFile.name}</p>}

					<div className="recipe-form-actions">
						<button type="button" className="recipe-view-btn" onClick={() => navigate("/recipes")}>
							Annuleren
						</button>
						<button type="submit" className="recipe-view-btn" disabled={isLoading}>
							{isLoading ? "Opslaan..." : "Opslaan"}
						</button>
					</div>
				</form>
			</main>
		</div>
	);
}
