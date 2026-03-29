import hashlib
import json
import math
import sys
from datetime import datetime, timedelta


CATEGORY_BASELINE_DEMAND = {
    "electronics": 0.78,
    "fashion": 0.63,
    "apparel": 0.62,
    "grocery": 0.58,
    "groceries": 0.58,
    "beauty": 0.67,
    "home": 0.56,
    "furniture": 0.52,
    "sports": 0.61,
    "books": 0.49,
    "default": 0.60,
}


def clamp(value, minimum, maximum):
    return min(max(value, minimum), maximum)


def round_to_nearest_ten(value):
    return round(value / 10) * 10


def average(values):
    return sum(values) / len(values) if values else 0


def get_seed(product):
    raw = f"{product.get('_id', '')}:{product.get('name', '')}".encode("utf-8")
    digest = hashlib.sha256(raw).hexdigest()
    return (int(digest[:8], 16) % 1000) / 1000


def get_category_demand(category):
    normalized = str(category or "").strip().lower()
    return CATEGORY_BASELINE_DEMAND.get(normalized, CATEGORY_BASELINE_DEMAND["default"])


def build_synthetic_history(current_price, market_anchor, seed):
    series = []

    for index in range(5, -1, -1):
        swing = math.sin((index + 1) * 1.7 + seed * 5) * 0.018 + ((seed - 0.5) * 0.012)
        market_pull = ((market_anchor - current_price) / max(current_price, 1)) * 0.28
        price = current_price * (1 - index * 0.006 + swing + market_pull)

        series.append(
            {
                "price": round_to_nearest_ten(price),
                "date": (datetime.utcnow() - timedelta(days=index)).isoformat() + "Z",
            }
        )

    return series


def normalise_history(current_price, avg_competitor_price, price_history, seed):
    valid_entries = []

    for entry in price_history or []:
        try:
            price = float(entry.get("price"))
        except (TypeError, ValueError):
            continue

        valid_entries.append({"price": price, "date": entry.get("date", "")})

    if valid_entries:
        valid_entries.sort(key=lambda entry: str(entry.get("date", "")))
        return valid_entries

    return build_synthetic_history(current_price, avg_competitor_price or current_price, seed)


def infer_trend(momentum):
    if momentum >= 0.03:
        return "rising"
    if momentum <= -0.03:
        return "softening"
    return "stable"


def infer_market_position(current_price, avg_competitor_price):
    if not avg_competitor_price:
        return "market-aligned"
    if current_price > avg_competitor_price * 1.03:
        return "premium"
    if current_price < avg_competitor_price * 0.97:
        return "value"
    return "market-aligned"


def build_drivers(current_price, avg_competitor_price, competitor_count, demand_score, momentum, volatility):
    drivers = []

    if competitor_count > 0:
        if current_price > avg_competitor_price:
            drivers.append("Competitor pricing is lower, so the simulation nudges the forecast downward.")
        else:
            drivers.append("Your price is competitive against the market average, supporting pricing stability.")
    else:
        drivers.append("No competitor prices were found, so the model leans more heavily on internal price behavior.")

    if demand_score >= 0.72:
        drivers.append("Demand signal is strong for this category, which supports a slightly higher simulated price.")
    elif demand_score <= 0.5:
        drivers.append("Demand signal is softer, so the forecast stays conservative.")

    if momentum >= 0.03:
        drivers.append("Recent price momentum is upward, which lifts the prediction.")
    elif momentum <= -0.03:
        drivers.append("Recent price momentum is cooling, which pulls the prediction down.")

    if volatility >= 0.04:
        drivers.append("Higher short-term volatility lowers confidence and keeps the recommendation closer to the current price.")

    return drivers[:3]


def simulate_price_prediction(item):
    product = item.get("product", {})
    competitors = item.get("competitors", [])
    price_history = item.get("priceHistory", [])

    current_price = float(product.get("currentPrice") or 0)
    competitor_prices = []

    for competitor in competitors:
        try:
            price = float(competitor.get("price"))
        except (TypeError, ValueError):
            continue

        if price > 0:
            competitor_prices.append(price)

    seed = get_seed(product)
    avg_competitor_price = average(competitor_prices) if competitor_prices else current_price * (0.97 + seed * 0.05)
    min_competitor_price = min(competitor_prices) if competitor_prices else avg_competitor_price * 0.985

    history_series = normalise_history(current_price, avg_competitor_price, price_history, seed)
    history_prices = [entry["price"] for entry in history_series]
    first_price = history_prices[0] if history_prices else current_price
    last_price = history_prices[-1] if history_prices else current_price
    momentum = ((last_price - first_price) / first_price) if first_price else 0

    if len(history_prices) > 1:
        average_step_change = average(
            [abs(price - history_prices[index]) for index, price in enumerate(history_prices[1:])]
        )
    else:
        average_step_change = 0

    volatility = (average_step_change / current_price) if current_price else 0
    category_demand = get_category_demand(product.get("category"))
    demand_score = clamp(
        category_demand
        + clamp((avg_competitor_price - current_price) / max(current_price, 1), -0.08, 0.1) * 0.45
        + momentum * 0.4
        + (seed - 0.5) * 0.08,
        0.38,
        0.92,
    )

    predicted_price_raw = (
        current_price
        + (avg_competitor_price - current_price) * 0.42
        + current_price * momentum * 0.26
        + current_price * (demand_score - 0.5) * 0.18
        - current_price * volatility * 0.08
        + current_price * (seed - 0.5) * 0.02
    )

    bounded_prediction = clamp(
        predicted_price_raw,
        current_price * 0.84,
        max(current_price * 1.2, min_competitor_price * 1.08),
    )

    confidence = clamp(
        0.58 + min(0.15, len(competitor_prices) * 0.05) + min(0.12, len(history_series) * 0.02) - volatility * 0.22,
        0.56,
        0.93,
    )

    predicted_price = round_to_nearest_ten(bounded_prediction)

    return {
        "modelVersion": "PricePulse Python ML v1",
        "simulated": True,
        "predictedPrice": predicted_price,
        "confidence": round(confidence, 2),
        "demandScore": round(demand_score, 2),
        "trend": infer_trend(momentum),
        "marketPosition": infer_market_position(current_price, avg_competitor_price),
        "competitorAveragePrice": round_to_nearest_ten(avg_competitor_price),
        "competitorMinPrice": round_to_nearest_ten(min_competitor_price),
        "competitorCount": len(competitor_prices),
        "predictedChangePct": round(((predicted_price - current_price) / max(current_price, 1)) * 100, 1),
        "trainingWindowDays": 30,
        "drivers": build_drivers(
            current_price,
            avg_competitor_price,
            len(competitor_prices),
            demand_score,
            momentum,
            volatility,
        ),
        "featureSnapshot": {
            "currentPrice": current_price,
            "avgCompetitorPrice": round_to_nearest_ten(avg_competitor_price),
            "priceMomentum": round(momentum, 3),
            "volatilityIndex": round(volatility, 3),
            "historyPoints": len(history_series),
        },
    }


def main():
    raw = sys.stdin.read()

    if not raw.strip():
        raise ValueError("No input payload received.")

    payload = json.loads(raw)
    items = payload.get("items", [])
    results = [simulate_price_prediction(item) for item in items]
    sys.stdout.write(json.dumps({"results": results}))


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        sys.stderr.write(str(error))
        sys.exit(1)
