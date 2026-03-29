import { useEffect, useState } from "react";
import API from "../api/api";
import PriceHistoryChart from "../components/PriceHistoryChart";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(Number(value) || 0);

const ProductDetails = ({ productId, onBackHome }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get(`/products/${productId}`);
        setProduct(response.data ?? null);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("We couldn't load that product right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return <main className="details-page"><div className="dashboard__state">Loading product details...</div></main>;
  }

  if (error || !product) {
    return (
      <main className="details-page">
        <button type="button" className="details-page__back" onClick={onBackHome}>
          Back to catalog
        </button>
        <div className="dashboard__state dashboard__state--error">{error || "Product not found."}</div>
      </main>
    );
  }

  const competitors = Array.isArray(product.competitors) ? product.competitors : [];
  const priceHistory = Array.isArray(product.priceHistory) ? product.priceHistory : [];
  const pricingInsight = product.pricingInsight;
  const ourPrice = product.ourPrice ?? pricingInsight?.ourOfferPrice ?? product.currentPrice;

  return (
    <main className="details-page">
      <button type="button" className="details-page__back" onClick={onBackHome}>
        Back to catalog
      </button>

      <section className="details-page__hero">
        <div>
          <p className="dashboard__eyebrow">Price Pulse</p>
          <span className="product-card__badge">Our offering</span>
          <h1>{product.name}</h1>
          <p className="dashboard__subtitle">
            Our offer blends the ML prediction and hybrid recommendation, then keeps the result
            competitive against Amazon, Flipkart, and the brand's official website.
          </p>
        </div>

        <div className="details-page__hero-meta">
          <span>Category</span>
          <strong>{product.category}</strong>
        </div>
      </section>

      <section className="details-page__stats">
        <article className="details-page__stat">
          <span>Our offer price</span>
          <strong>{formatCurrency(ourPrice)}</strong>
        </article>

        <article className="details-page__stat">
          <span>ML predicted price</span>
          <strong>{formatCurrency(pricingInsight?.predictedPrice)}</strong>
        </article>

        <article className="details-page__stat">
          <span>Hybrid recommendation</span>
          <strong>{formatCurrency(pricingInsight?.suggestedPrice)}</strong>
        </article>

        <article className="details-page__stat">
          <span>Lowest website offer</span>
          <strong>{formatCurrency(pricingInsight?.competitorMinPrice)}</strong>
        </article>
      </section>

      <section className="details-page__layout">
        <div className="details-page__chart-panel">
          <div className="details-page__section-head">
            <div>
              <p className="dashboard__eyebrow">Price history</p>
              <h2>Historical trend vs website price levels</h2>
            </div>
          </div>

          <PriceHistoryChart priceHistory={priceHistory} competitors={competitors} />
        </div>

        <aside className="details-page__sidebar">
          <section className="details-page__card">
            <p className="dashboard__eyebrow">Tracked websites</p>
            <div className="details-page__list">
              {competitors.map((competitor) => (
                <div key={competitor._id || competitor.competitorName} className="details-page__list-row">
                  <div>
                    <strong>{competitor.competitorName}</strong>
                    <span>Same product listing</span>
                  </div>
                  <strong>{formatCurrency(competitor.price)}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="details-page__card">
            <p className="dashboard__eyebrow">Model notes</p>
            <div className="details-page__insights">
              <div className="details-page__chip-row">
                <span className="product-card__chip">{pricingInsight?.trend}</span>
                <span className="product-card__chip">{pricingInsight?.marketPosition}</span>
                <span className="product-card__chip">
                  Baseline {formatCurrency(product.currentPrice)}
                </span>
                <span className="product-card__chip">
                  Confidence {Math.round((pricingInsight?.confidence || 0) * 100)}%
                </span>
              </div>

              <p>{pricingInsight?.pricingStrategy}</p>
              <p>
                Savings versus the lowest tracked website:{" "}
                {formatCurrency(pricingInsight?.savingsVsLowestWebsite)}
              </p>
              <p>
                Savings versus the average tracked website price:{" "}
                {formatCurrency(pricingInsight?.savingsVsAverageWebsite)}
              </p>

              {pricingInsight?.drivers?.map((driver) => (
                <p key={driver}>{driver}</p>
              ))}
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
};

export default ProductDetails;
