import { useEffect, useState } from "react";
import API from "../api/api";
import ProductCard from "../components/ProductCard";

const pickFeaturedProducts = (products) => {
  if (products.length <= 5) {
    return products;
  }

  const trending = [...products]
    .sort((left, right) => {
      const leftScore =
        Math.abs(left.pricingInsight?.predictedChangePct || 0) +
        (left.pricingInsight?.confidence || 0) * 10;
      const rightScore =
        Math.abs(right.pricingInsight?.predictedChangePct || 0) +
        (right.pricingInsight?.confidence || 0) * 10;
      return rightScore - leftScore;
    })
    .slice(0, 2);
  const trendingIds = new Set(trending.map((product) => product._id));
  const randomPool = products.filter((product) => !trendingIds.has(product._id));
  const shuffled = [...randomPool].sort(() => Math.random() - 0.5);

  return [...trending, ...shuffled.slice(0, 3)];
};

const Dashboard = ({ onSelectProduct }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const predictedProducts = products.filter((product) => product.pricingInsight?.simulated).length;
  const trackedCompetitors = products.reduce(
    (total, product) => total + (Array.isArray(product.competitors) ? product.competitors.length : 0),
    0
  );
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredProducts = products.filter((product) => {
    if (!normalizedQuery) {
      return true;
    }

    const name = product.name?.toLowerCase() || "";
    const category = product.category?.toLowerCase() || "";

    return name.includes(normalizedQuery) || category.includes(normalizedQuery);
  });
  const featuredProducts = normalizedQuery ? filteredProducts.slice(0, 5) : pickFeaturedProducts(products);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get("/products");
        setProducts(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("We couldn't load the product catalog right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main className="dashboard">
      <section className="dashboard__hero">
        <div className="dashboard__hero-copy">
          <h1>Price Pulse</h1>
          <p className="dashboard__hero-subheading">
            Get the best price predicted by our ML model.
          </p>
          <p className="dashboard__subtitle">
            Explore our technology catalog, compare our computed offer against Amazon, Flipkart,
            and official brand websites, and open any product to inspect price history over time.
          </p>
        </div>

        <div className="dashboard__summary-grid">
          <div className="dashboard__summary">
            <span>Total products</span>
            <strong>{products.length}</strong>
          </div>

          <div className="dashboard__summary">
            <span>Predictions ready</span>
            <strong>{predictedProducts}</strong>
          </div>

          <div className="dashboard__summary">
            <span>Competitor offers tracked</span>
            <strong>{trackedCompetitors}</strong>
          </div>
        </div>
      </section>

      <section className="dashboard__toolbar">
        <div className="dashboard__search">
          <label htmlFor="product-search">Search by product name or category</label>
          <input
            id="product-search"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search iPhone, headphones, tablets, MacBook..."
          />
        </div>

        <div className="dashboard__toolbar-note">
          <strong>{filteredProducts.length}</strong>
          <span>products match your search</span>
        </div>
      </section>

      {loading ? <div className="dashboard__state">Loading products...</div> : null}

      {!loading && error ? (
        <div className="dashboard__state dashboard__state--error">{error}</div>
      ) : null}

      {!loading && !error && products.length === 0 ? (
        <div className="dashboard__state">No products found yet.</div>
      ) : null}

      {!loading && !error && products.length > 0 && filteredProducts.length === 0 ? (
        <div className="dashboard__state">No products matched that name or category.</div>
      ) : null}

      {!loading && !error && featuredProducts.length > 0 ? (
        <section className="dashboard__featured-head">
          <div>
            <p className="dashboard__eyebrow">Featured products</p>
            <h2>{normalizedQuery ? "Top search matches" : "Trending picks"}</h2>
          </div>
          <span className="dashboard__featured-count">Showing {featuredProducts.length} products</span>
        </section>
      ) : null}

      {!loading && !error && featuredProducts.length > 0 ? (
        <section className="dashboard__grid">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onSelectProduct={onSelectProduct}
              compact
            />
          ))}
        </section>
      ) : null}
    </main>
  );
};

export default Dashboard;
