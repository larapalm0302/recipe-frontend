import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import "../styles/recipes.css";

export default function EditRecipe() {
	const navigate = useNavigate();
	const { id } = useParams();
	const [form, setForm] = useState({
		title: "",
		category: "",
		description: "",
		ingredients: "",
		instructions: "",
	});
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState("");
	const [imageFile, setImageFile] = useState(null);
	const [currentImage, setCurrentImage] = useState("");

	const handleLogout = () => {
		localStorage.removeItem("authToken");
		localStorage.removeItem("authUser");
		navigate("/");
	};

	useEffect(() => {
		const token = localStorage.getItem("authToken");
		if (!token) {
			navigate("/");
			return;
		}

		const fetchRecipe = async () => {
			setError("");
			try {
				const response = await fetch(
					`${process.env.REACT_APP_API_URL || "http://127.0.0.1:8000"}/api/recipes/${id}`,
					{
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${token}`,
						},
					}
				);

				if (!response.ok) {
					const data = await response.json().catch(() => ({}));
					throw new Error(data.message || "Kon recept niet laden.");
				}

				const data = await response.json();
				setForm({
					title: data.title || "",
					category: data.category || "",
					description: data.description || "",
					ingredients: data.ingredients || "",
					instructions: data.instructions || "",
				});
				setCurrentImage(data.image || "");
			} catch (fetchError) {
				setError(fetchError.message || "Er ging iets mis.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchRecipe();
	}, [id, navigate]);

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

		setIsSaving(true);
		try {
			const payload = new FormData();
			payload.append("_method", "PUT");
			payload.append("title", form.title);
			payload.append("category", form.category);
			payload.append("description", form.description);
			payload.append("ingredients", form.ingredients);
			payload.append("instructions", form.instructions);
			if (imageFile) {
				payload.append("image", imageFile);
			}

			const response = await fetch(
				`${process.env.REACT_APP_API_URL || "http://127.0.0.1:8000"}/api/recipes/${id}`,
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
				throw new Error(data.message || "Recept bewerken is mislukt.");
			}

			navigate("/dashboard");
		} catch (saveError) {
			setError(saveError.message || "Er ging iets mis.");
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className="recipes-page">
			<NavBar onLogout={handleLogout} />
			<main className="recipes-wrap">
				<div className="recipes-head">
					<h1>Recept Bewerken</h1>
				</div>

				{error && <p className="recipes-error">{error}</p>}

				{isLoading ? (
					<p>Recept laden...</p>
				) : (
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
							Nieuwe afbeelding
							<input type="file" accept="image/*" onChange={handleImageChange} />
						</label>

						{imageFile && <p>Gekozen bestand: {imageFile.name}</p>}
						{!imageFile && currentImage && <img src={currentImage} alt={form.title} className="edit-recipe-preview" />}

						<div className="recipe-form-actions">
							<button type="button" className="recipe-view-btn" onClick={() => navigate("/dashboard")}>
								Annuleren
							</button>
							<button type="submit" className="recipe-view-btn" disabled={isSaving}>
								{isSaving ? "Opslaan..." : "Wijzigingen opslaan"}
							</button>
						</div>
					</form>
				)}
			</main>
		</div>
	);
}
