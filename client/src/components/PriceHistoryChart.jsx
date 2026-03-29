const formatCurrencyShort = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(value) || 0);

const formatDateLabel = (value) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short"
  });

const CHART_WIDTH = 760;
const CHART_HEIGHT = 320;
const PADDING = { top: 28, right: 28, bottom: 42, left: 74 };
const COMPETITOR_COLORS = ["#f49b56", "#7e60bf", "#1c7d7f", "#cf5f5f"];

const PriceHistoryChart = ({ priceHistory = [], competitors = [] }) => {
  const filteredHistory = priceHistory.filter((entry) => Number.isFinite(Number(entry.price)));
  const competitorPrices = competitors.map((competitor) => Number(competitor.price)).filter(Boolean);
  const values = [...filteredHistory.map((entry) => Number(entry.price)), ...competitorPrices];

  if (values.length === 0) {
    return <div className="chart__empty">No price history available yet.</div>;
  }

  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = Math.max(maxValue - minValue, maxValue * 0.08, 1);
  const chartInnerWidth = CHART_WIDTH - PADDING.left - PADDING.right;
  const chartInnerHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;

  const getY = (value) =>
    PADDING.top + ((maxValue + range * 0.08 - value) / (range * 1.16)) * chartInnerHeight;

  const getX = (index) => {
    if (filteredHistory.length <= 1) {
      return PADDING.left + chartInnerWidth / 2;
    }

    return PADDING.left + (index / (filteredHistory.length - 1)) * chartInnerWidth;
  };

  const linePath = filteredHistory
    .map((entry, index) => `${index === 0 ? "M" : "L"} ${getX(index)} ${getY(Number(entry.price))}`)
    .join(" ");

  const yAxisTicks = Array.from({ length: 5 }, (_, index) => {
    const ratio = index / 4;
    const value = maxValue + range * 0.08 - ratio * range * 1.16;
    return {
      label: formatCurrencyShort(value),
      y: PADDING.top + ratio * chartInnerHeight
    };
  });

  return (
    <div className="chart">
      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        className="chart__svg"
        role="img"
        aria-label="Price history and website comparison chart"
      >
        <rect x="0" y="0" width={CHART_WIDTH} height={CHART_HEIGHT} rx="24" fill="rgba(255,255,255,0.9)" />

        {yAxisTicks.map((tick) => (
          <g key={tick.label}>
            <line
              x1={PADDING.left}
              y1={tick.y}
              x2={CHART_WIDTH - PADDING.right}
              y2={tick.y}
              stroke="rgba(71,54,39,0.1)"
              strokeDasharray="4 6"
            />
            <text x={PADDING.left - 14} y={tick.y + 4} textAnchor="end" className="chart__axis-label">
              {tick.label}
            </text>
          </g>
        ))}

        {competitors.slice(0, 3).map((competitor, index) => {
          const y = getY(Number(competitor.price));
          const color = COMPETITOR_COLORS[index % COMPETITOR_COLORS.length];

          return (
            <g key={competitor.competitorName}>
              <line
                x1={PADDING.left}
                y1={y}
                x2={CHART_WIDTH - PADDING.right}
                y2={y}
                stroke={color}
                strokeWidth="2"
                strokeDasharray="8 6"
                opacity="0.7"
              />
              <text x={CHART_WIDTH - PADDING.right} y={y - 8} textAnchor="end" className="chart__competitor-label" fill={color}>
                {competitor.competitorName}: {formatCurrencyShort(competitor.price)}
              </text>
            </g>
          );
        })}

        <path d={linePath} fill="none" stroke="#1c7d7f" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

        {filteredHistory.map((entry, index) => (
          <g key={`${entry.date}-${entry.price}`}>
            <circle cx={getX(index)} cy={getY(Number(entry.price))} r="5" fill="#1c7d7f" />
            <text x={getX(index)} y={CHART_HEIGHT - 12} textAnchor="middle" className="chart__axis-label">
              {formatDateLabel(entry.date)}
            </text>
          </g>
        ))}

        <text x={CHART_WIDTH / 2} y={CHART_HEIGHT - 2} textAnchor="middle" className="chart__title">
          Time
        </text>
        <text
          x="22"
          y={CHART_HEIGHT / 2}
          textAnchor="middle"
          transform={`rotate(-90 22 ${CHART_HEIGHT / 2})`}
          className="chart__title"
        >
          Price
        </text>
      </svg>
    </div>
  );
};

export default PriceHistoryChart;
