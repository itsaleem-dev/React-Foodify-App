import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://forkify-api.herokuapp.com/api/v2/recipes";

function App() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");

  async function searchRecipes(searchTerm = query) {
    const term = searchTerm.trim();
    if (!term) return;

    setLoading(true);
    setError("");
    setRecipes([]);
    setSelectedRecipe(null);

    try {
      const response = await fetch(
        `${API_URL}?search=${encodeURIComponent(term)}`
      );
      const data = await response.json();

      if (!response.ok || data.status === "fail") {
        throw new Error(data.message || "Recipes nahi mil sakin.");
      }

      const results = data.data?.recipes || [];
      setRecipes(results);

      if (results.length === 0) {
        setError("Koi recipe nahi mili. Koi aur food search karein.");
      }
    } catch (err) {
      setError(err.message || "API se data load nahi ho saka.");
    } finally {
      setLoading(false);
    }
  }

  async function getRecipeDetails(id) {
    setDetailLoading(true);
    setSelectedRecipe(null);
    setError("");

    try {
      const response = await fetch(`${API_URL}/${id}`);
      const data = await response.json();

      if (!response.ok || data.status === "fail") {
        throw new Error(data.message || "Recipe details load nahi huin.");
      }

      setSelectedRecipe(data.data.recipe);
    } catch (err) {
      setError(err.message || "Details load nahi ho sakin.");
    } finally {
      setDetailLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    searchRecipes();
  }

  return (
    <div className="app">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Foodify home">
          <span className="brand-icon">🍳</span>
          <span>Foodify</span>
        </a>

        <form className="search-form" onSubmit={handleSubmit}>
          <span className="search-icon">⌕</span>
          <input
            type="search"
            placeholder="Search pizza, pasta, burger..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search recipes"
          />
          <button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        <div className="result-count">
          {recipes.length} recipes found
        </div>
      </header>

      <main className="main-layout">
        <section className="results-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">FIND YOUR NEXT MEAL</p>
              <h1>Explore recipes<span>.</span></h1>
              <p className="subtitle">
                Delicious ideas for your next cooking adventure.
              </p>
            </div>
            <span className="result-pill">
              {recipes.length} results
            </span>
          </div>

          {loading && (
            <div className="status-message">
              <div className="spinner" />
              <h3>Finding delicious recipes...</h3>
              <p>Please wait a moment.</p>
            </div>
          )}

          {!loading && error && (
            <div className="status-message error-message">
              <span className="status-emoji">🥲</span>
              <h3>Oops!</h3>
              <p>{error}</p>
              <button
                className="retry-button"
                onClick={() => searchRecipes()}
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && recipes.length > 0 && (
            <div className="recipe-grid">
              {recipes.map((recipe) => (
                <button
                  type="button"
                  className={`recipe-card ${selectedRecipe?.id === recipe.id ? "active" : ""
                    }`}
                  key={recipe.id}
                  onClick={() => getRecipeDetails(recipe.id)}
                >
                  <div className="card-image-wrap">
                    <img
                      className="card-image"
                      src={recipe.image_url}
                      alt={recipe.title}
                      loading="lazy"
                    />
                    <span className="image-tag">Recipe</span>
                  </div>

                  <div className="card-content">
                    <p className="card-publisher">
                      {recipe.publisher || "Home Kitchen"}
                    </p>
                    <h2>{recipe.title}</h2>
                    <div className="card-footer">
                      <span>🍽️ Recipe details</span>
                      <span className="arrow">↗</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        {!loading && !error && recipes.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🍽️</div>
            <h3>What are you craving?</h3>
            <p>
              Search for pizza, burger, pasta or any food
              to discover delicious recipes.
            </p>
          </div>
        )}

        <aside className="details-panel">
          <div className="panel-top">
            <div>
              <p className="eyebrow">YOUR NEXT FAVORITE</p>
              <h2>Recipe details</h2>
            </div>
            <span className="panel-icon">✦</span>
          </div>

          {detailLoading && (
            <div className="detail-placeholder">
              <div className="spinner" />
              <p>Loading recipe details...</p>
            </div>
          )}

          {!detailLoading && !selectedRecipe && (
            <div className="detail-placeholder">
              <div className="placeholder-icon">🥘</div>
              <h3>Something delicious awaits</h3>
              <p>
                Select any recipe from the list to explore its
                ingredients and cooking details.
              </p>
              <div className="hint">← Choose a recipe to get started</div>
            </div>
          )}

          {!detailLoading && selectedRecipe && (
            <div className="recipe-details">
              <img
                className="detail-image"
                src={selectedRecipe.image_url}
                alt={selectedRecipe.title}
              />

              <p className="detail-publisher">
                BY {selectedRecipe.publisher || "FOODIFY KITCHEN"}
              </p>

              <h2 className="detail-title">{selectedRecipe.title}</h2>

              <div className="detail-stats">
                <div>
                  <span>⏱</span>
                  <strong>{selectedRecipe.cooking_time ?? "—"}</strong>
                  <small>Minutes</small>
                </div>
                <div>
                  <span>🍽</span>
                  <strong>{selectedRecipe.servings ?? "—"}</strong>
                  <small>Servings</small>
                </div>
                <div>
                  <span>🥕</span>
                  <strong>
                    {selectedRecipe.ingredients?.length ?? 0}
                  </strong>
                  <small>Ingredients</small>
                </div>
              </div>

              <div className="ingredients-heading">
                <h3>Ingredients</h3>
                <span>
                  {selectedRecipe.ingredients?.length ?? 0} items
                </span>
              </div>

              {selectedRecipe.ingredients?.length > 0 ? (
                <ul className="ingredients-list">
                  {selectedRecipe.ingredients.map((ingredient, index) => (
                    <li key={`${ingredient.description}-${index}`}>
                      <span className="ingredient-check">✓</span>
                      <span>
                        <strong>
                          {ingredient.quantity != null
                            ? `${Math.round(ingredient.quantity * 100) / 100} `
                            : ""}
                          {ingredient.unit || ""}
                        </strong>{" "}
                        {ingredient.description}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-ingredients">
                  Ingredients are not available for this recipe.
                </p>
              )}

              {selectedRecipe.source_url && (
                <a
                  className="source-button"
                  href={selectedRecipe.source_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  View full cooking instructions <span>↗</span>
                </a>
              )}
            </div>
          )}
        </aside>
      </main>

      <footer className="app-footer">
        <span>🍳 Foodify</span>
        <span>Made for people who love good food.</span>
      </footer>
    </div>
  );
}

export default App;