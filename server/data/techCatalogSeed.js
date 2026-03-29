const CATEGORY_SERIES = [
  {
    category: "Smartphones",
    groups: [
      { brand: "Apple", basePrice: 69900, step: 6500, models: ["iPhone 15", "iPhone 15 Plus", "iPhone 15 Pro", "iPhone 15 Pro Max", "iPhone 16", "iPhone 16 Plus", "iPhone 16 Pro", "iPhone 16 Pro Max", "iPhone SE"] },
      { brand: "Samsung", basePrice: 54900, step: 5200, models: ["Galaxy S23", "Galaxy S23+", "Galaxy S23 Ultra", "Galaxy S24", "Galaxy S24+", "Galaxy S24 Ultra", "Galaxy Z Flip 5", "Galaxy Z Flip 6", "Galaxy Z Fold 5", "Galaxy A55"] },
      { brand: "OnePlus", basePrice: 31900, step: 4800, models: ["OnePlus 11", "OnePlus 11R", "OnePlus 12", "OnePlus 12R", "Nord 4", "Nord CE4"] },
      { brand: "Google", basePrice: 42900, step: 5400, models: ["Pixel 8", "Pixel 8a", "Pixel 8 Pro", "Pixel 9", "Pixel 9 Pro", "Pixel 9 Pro XL"] },
      { brand: "Xiaomi", basePrice: 20900, step: 4300, models: ["Xiaomi 13 Pro", "Xiaomi 14", "Xiaomi 14 Ultra", "Redmi Note 13", "Redmi Note 13 Pro", "Redmi Note 13 Pro+", "Poco X6 Pro", "Poco F6"] },
      { brand: "Nothing", basePrice: 23900, step: 3900, models: ["Phone 2", "Phone 2a", "CMF Phone 1"] },
      { brand: "Motorola", basePrice: 19900, step: 4100, models: ["Edge 50 Fusion", "Edge 50 Pro", "Edge 50 Ultra", "Razr 40 Ultra", "Razr 50", "Moto G85"] },
      { brand: "Oppo", basePrice: 24900, step: 4500, models: ["Find X8", "Find X8 Pro", "Reno 12", "Reno 12 Pro", "F27 Pro+"] },
      { brand: "Vivo", basePrice: 26900, step: 4200, models: ["X100", "X200", "V40", "V40 Pro", "T3 Ultra"] }
    ]
  },
  {
    category: "Tablets",
    groups: [
      { brand: "Apple", basePrice: 34900, step: 9800, models: ["iPad 10th Gen", "iPad Air 11", "iPad Air 13", "iPad Pro 11", "iPad Pro 13"] },
      { brand: "Samsung", basePrice: 18900, step: 7600, models: ["Galaxy Tab S9", "Galaxy Tab S9+", "Galaxy Tab S9 Ultra", "Galaxy Tab S10+", "Galaxy Tab A9+"] },
      { brand: "OnePlus", basePrice: 32900, step: 5200, models: ["Pad", "Pad 2"] },
      { brand: "Xiaomi", basePrice: 21900, step: 4700, models: ["Pad 6", "Pad 6S Pro", "Redmi Pad Pro"] },
      { brand: "Lenovo", basePrice: 17900, step: 4200, models: ["Tab P12", "Tab Plus", "Legion Tab", "Yoga Tab 13"] },
      { brand: "Amazon", basePrice: 8990, step: 2900, models: ["Fire HD 8", "Fire HD 10", "Fire Max 11"] }
    ]
  },
  {
    category: "Laptops",
    groups: [
      { brand: "Apple", basePrice: 89900, step: 14800, models: ["MacBook Air 13 M2", "MacBook Air 15 M2", "MacBook Air 13 M3", "MacBook Air 15 M3", "MacBook Pro 14 M3", "MacBook Pro 16 M3 Max"] },
      { brand: "Dell", basePrice: 64900, step: 9600, models: ["XPS 13", "XPS 14", "XPS 15", "Inspiron 14", "Inspiron 16", "Alienware m16", "Latitude 7440", "G15"] },
      { brand: "HP", basePrice: 61900, step: 9200, models: ["Spectre x360 14", "Spectre x360 16", "Envy x360 14", "Envy 16", "Pavilion Plus 14", "Victus 16", "Omen 16", "EliteBook 840 G10"] },
      { brand: "Lenovo", basePrice: 55900, step: 8900, models: ["Yoga Slim 7i", "Yoga Pro 7i", "IdeaPad Slim 5", "IdeaPad Pro 5", "Legion Slim 5", "Legion Pro 5i", "ThinkPad X1 Carbon", "ThinkBook 14"] },
      { brand: "Asus", basePrice: 57900, step: 9100, models: ["Zenbook 14 OLED", "Zenbook S 13 OLED", "Vivobook S 15", "Vivobook 16X", "ROG Zephyrus G14", "ROG Strix G16", "TUF A15", "ExpertBook B9"] },
      { brand: "Acer", basePrice: 48900, step: 8600, models: ["Swift Go 14", "Swift X 14", "Nitro 16", "Predator Helios Neo 16", "Aspire 5", "TravelMate P4"] }
    ]
  },
  {
    category: "Headphones",
    groups: [
      { brand: "Sony", basePrice: 3990, step: 4200, models: ["WH-CH520", "WH-CH720N", "WH-XB910N", "WH-1000XM4", "WH-1000XM5", "ULT Wear"] },
      { brand: "Bose", basePrice: 15990, step: 5400, models: ["QuietComfort", "QC Ultra", "Noise Cancelling Headphones 700", "SoundLink Around-Ear II"] },
      { brand: "JBL", basePrice: 4990, step: 3500, models: ["Tune 770NC", "Live 770NC", "Tour One M2", "Quantum 910"] },
      { brand: "Sennheiser", basePrice: 6990, step: 4700, models: ["HD 450BT", "Momentum 4", "Accentum", "Accentum Plus"] },
      { brand: "Skullcandy", basePrice: 6990, step: 2600, models: ["Crusher Evo", "Hesh ANC", "Icon ANC"] },
      { brand: "Apple", basePrice: 17990, step: 10900, models: ["AirPods Max", "Beats Solo 4", "Beats Studio Pro"] }
    ]
  },
  {
    category: "Earbuds",
    groups: [
      { brand: "Apple", basePrice: 9990, step: 4200, models: ["AirPods 2", "AirPods 3", "AirPods Pro 2", "Beats Fit Pro"] },
      { brand: "Samsung", basePrice: 5990, step: 3600, models: ["Galaxy Buds FE", "Galaxy Buds 2", "Galaxy Buds 2 Pro", "Galaxy Buds 3 Pro"] },
      { brand: "Sony", basePrice: 4990, step: 4400, models: ["WF-C500", "WF-C700N", "LinkBuds S", "WF-1000XM5"] },
      { brand: "OnePlus", basePrice: 2990, step: 2800, models: ["Buds 3", "Buds Pro 2", "Nord Buds 2", "Buds Ace"] },
      { brand: "Nothing", basePrice: 2990, step: 2500, models: ["Ear (a)", "Ear", "CMF Buds Pro 2"] },
      { brand: "Jabra", basePrice: 5990, step: 4100, models: ["Elite 4", "Elite 8 Active", "Elite 10"] }
    ]
  },
  {
    category: "Smartwatches",
    groups: [
      { brand: "Apple", basePrice: 29900, step: 8200, models: ["Watch SE", "Watch Series 9 41mm", "Watch Series 9 45mm", "Watch Ultra 2", "Watch Nike Edition"] },
      { brand: "Samsung", basePrice: 16990, step: 5300, models: ["Galaxy Watch 6 40mm", "Galaxy Watch 6 Classic", "Galaxy Watch 7", "Galaxy Watch Ultra"] },
      { brand: "OnePlus", basePrice: 19990, step: 2800, models: ["Watch 2", "Watch 2R"] },
      { brand: "Google", basePrice: 22990, step: 4100, models: ["Pixel Watch 2", "Pixel Watch 3 41mm", "Pixel Watch 3 45mm"] },
      { brand: "Garmin", basePrice: 23990, step: 6300, models: ["Venu 3", "Forerunner 165", "Forerunner 265", "Instinct 2", "Fenix 7"] },
      { brand: "Amazfit", basePrice: 8990, step: 2500, models: ["GTR 4", "Balance", "Bip 5", "T-Rex Ultra"] }
    ]
  },
  {
    category: "Bluetooth Speakers",
    groups: [
      { brand: "Sony", basePrice: 3990, step: 5200, models: ["SRS-XB100", "ULT Field 1", "SRS-XG300"] },
      { brand: "JBL", basePrice: 8990, step: 4200, models: ["Flip 6", "Charge 5"] },
      { brand: "Bose", basePrice: 12990, step: 8900, models: ["SoundLink Flex", "SoundLink Max"] }
    ]
  }
];

const BRAND_DOMAINS = {
  Acer: "store.acer.com",
  Amazfit: "in.amazfit.com",
  Amazon: "amazon.com",
  Apple: "apple.com",
  Asus: "asus.com",
  Bose: "bose.com",
  Dell: "dell.com",
  Garmin: "garmin.com",
  Google: "store.google.com",
  HP: "hp.com",
  JBL: "jbl.com",
  Jabra: "jabra.com",
  Lenovo: "lenovo.com",
  Motorola: "motorola.com",
  Nothing: "nothing.tech",
  OnePlus: "oneplus.in",
  Oppo: "oppo.com",
  Samsung: "samsung.com",
  Sennheiser: "sennheiser-hearing.com",
  Skullcandy: "skullcandy.com",
  Sony: "sony.com",
  Vivo: "vivo.com",
  Xiaomi: "mi.com"
};

const hashString = (value = "") => {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
};

const roundToNearestHundred = (value) => Math.round(value / 100) * 100;

const buildPriceHistory = (productName, currentPrice) => {
  const hash = hashString(productName);
  const history = [];

  for (let offset = 4; offset >= 0; offset -= 1) {
    const movement = ((hash % 9) - 4) * 0.008;
    const seasonal = Math.sin((offset + 1) * 1.4 + (hash % 11)) * 0.012;
    const multiplier = 1 - offset * 0.01 + movement + seasonal;

    history.push({
      price: roundToNearestHundred(currentPrice * multiplier),
      source: "self",
      date: new Date(Date.now() - offset * 7 * 24 * 60 * 60 * 1000)
    });
  }

  return history;
};

const buildWebsiteOffers = (item) => {
  const officialStore = BRAND_DOMAINS[item.brand] || `${item.brand.toLowerCase()}.com`;
  const marketplaces = ["Amazon", "Flipkart", officialStore];

  return marketplaces.map((storefront, index) => {
    const priceSeed = hashString(`${item.name}:${storefront}`);
    const offsetBands = [-0.026, -0.014, 0.012];
    const variance = ((priceSeed % 7) - 3) * 0.0045;
    const multiplier = 1 + offsetBands[index] + variance;

    return {
      competitorName: storefront,
      price: Math.max(1900, roundToNearestHundred(item.currentPrice * multiplier))
    };
  });
};

export const buildTechCatalogSeed = () => {
  const catalog = [];

  CATEGORY_SERIES.forEach(({ category, groups }) => {
    groups.forEach(({ brand, basePrice, step, models }) => {
      models.forEach((modelName, index) => {
        const jitter = (hashString(`${brand}:${modelName}`) % 1400) - 700;
        const currentPrice = Math.max(2900, roundToNearestHundred(basePrice + step * index + jitter));

        catalog.push({
          brand,
          name: `${brand} ${modelName}`,
          category,
          currentPrice,
          priceHistory: buildPriceHistory(`${brand} ${modelName}`, currentPrice)
        });
      });
    });
  });

  if (catalog.length !== 200) {
    throw new Error(`Expected 200 seeded products but generated ${catalog.length}.`);
  }

  return catalog.map((item, index) => ({
    ...item,
    competitors: buildWebsiteOffers(catalog[index])
  }));
};
