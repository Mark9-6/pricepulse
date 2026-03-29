const formatCurrency = (value) => {
  const amount = Number(value) || 0;

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(amount);
};

const formatPercent = (value) => {
  const amount = Number(value) || 0;
  const sign = amount > 0 ? "+" : "";

  return `${sign}${amount.toFixed(1)}%`;
};

const ProductCard = ({ product, onSelectProduct, compact = false }) => {
  const category = product.category?.trim() || "Uncategorized";
  const pricingInsight = product.pricingInsight;
  const websiteOffers = Array.isArray(product.competitors) ? product.competitors.slice(0, 3) : [];
  const ourPrice = product.ourPrice ?? pricingInsight?.ourOfferPrice ?? product.currentPrice;
  const websiteAverage = pricingInsight?.competitorAveragePrice;

  return (
    <article
      className="product-card product-card--our-offering"
      role="button"
      tabIndex={0}
      onClick={() => onSelectProduct?.(product)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelectProduct?.(product);
        }
      }}
    >
      <div className="product-card__header">
        <div>
          <p className="product-card__eyebrow">{category}</p>
          <span className="product-card__badge">Our offering</span>
          <h2 className="product-card__title">{product.name}</h2>
        </div>

        <div className="product-card__price-block">
          <span className="product-card__price-label">Our price</span>
          <span className="product-card__price">{formatCurrency(ourPrice)}</span>
        </div>
      </div>

      {compact && pricingInsight ? (
        <section className="product-card__compact-summary">
          <div>
            <span className="product-card__section-label">Website average</span>
            <strong>{formatCurrency(websiteAverage)}</strong>
          </div>

          <div className="product-card__chips">
            <span className="product-card__chip">{pricingInsight.trend}</span>
            <span className="product-card__chip">
              {Math.round((pricingInsight.confidence || 0) * 100)}% confidence
            </span>
          </div>
        </section>
      ) : null}

      {!compact && pricingInsight ? (
        <section className="product-card__prediction">
          <div className="product-card__prediction-main">
            <div>
              <span className="product-card__section-label">ML predicted price</span>
              <strong>{formatCurrency(pricingInsight.predictedPrice)}</strong>
            </div>

            <div>
              <span className="product-card__section-label">Recommended</span>
              <strong>{formatCurrency(pricingInsight.suggestedPrice)}</strong>
            </div>
          </div>

          <div className="product-card__chips">
            <span className="product-card__chip">{pricingInsight.trend}</span>
            <span className="product-card__chip">{pricingInsight.marketPosition}</span>
            <span className="product-card__chip">
              Confidence {Math.round((pricingInsight.confidence || 0) * 100)}%
            </span>
          </div>

          <div className="product-card__metrics">
            <div>
              <span>Expected move</span>
              <strong>{formatPercent(pricingInsight.predictedChangePct)}</strong>
            </div>

            <div>
              <span>Website avg</span>
              <strong>{formatCurrency(pricingInsight.competitorAveragePrice)}</strong>
            </div>

            <div>
              <span>You save vs lowest</span>
              <strong>{formatCurrency(pricingInsight.savingsVsLowestWebsite)}</strong>
            </div>
          </div>

          {pricingInsight.drivers?.length ? (
            <div className="product-card__drivers">
              {pricingInsight.drivers.map((driver) => (
                <p key={driver}>{driver}</p>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {!compact && websiteOffers.length > 0 ? (
        <section className="product-card__competitors">
          <div className="product-card__competitors-header">
            <span className="product-card__section-label">Website comparison</span>
            <span className="product-card__competitors-note">Same product across tracked stores</span>
          </div>

          <div className="product-card__competitor-list">
            {websiteOffers.map((competitor) => (
              <div key={`${product._id}-${competitor.competitorName}`} className="product-card__competitor-row">
                <div>
                  <strong>{competitor.competitorName}</strong>
                  <span>Website listing</span>
                </div>

                <strong>{formatCurrency(competitor.price)}</strong>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <div className="product-card__meta">
        <span>{compact ? "Tap to view history and comparison" : "Product ID"}</span>
        {!compact ? <code>{product._id}</code> : null}
        {pricingInsight?.simulated ? (
          <span className="product-card__meta-note">{pricingInsight.modelVersion}</span>
        ) : null}
        <span className="product-card__cta">Open detailed view</span>
      </div>
    </article>
  );
};

export default ProductCard;
