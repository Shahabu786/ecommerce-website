import { products as demoProducts } from "./products";

// Curated real product photography (remote image CDN). These URLs are direct
// image files, so no API key or extra package is required.
// Real product photos: drop a file named exactly like the product id
// (e.g. src/assets/products/sony-headphones.jpg) and it is picked up automatically.
// Supported: jpg, jpeg, png, webp. Products without a file keep the fallback URLs below.
const LOCAL_IMAGES = Object.fromEntries(
  Object.entries(
    import.meta.glob("../assets/products/*.{jpg,jpeg,png,webp}", { eager: true, query: "?url", import: "default" })
  ).map(([path, url]) => [path.split("/").pop().replace(/\.[^.]+$/, "").toLowerCase(), url])
);

export const PRODUCT_IMAGES = {
  "samsung-split-ac": "https://images.unsplash.com/photo-1631545806609-0e1e6c7b1c4b?auto=format&fit=crop&w=900&q=85",
  "lg-4k-smart-tv": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=900&q=85",
  "oneplus-12": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=85",
  "whirlpool-fridge": "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=900&q=85",
  "symphony-cooler": "https://images.unsplash.com/photo-1631545806609-0e1e6c7b1c4b?auto=format&fit=crop&w=900&q=85",
  "crompton-fan": "https://images.unsplash.com/photo-1631545806609-0e1e6c7b1c4b?auto=format&fit=crop&w=900&q=85",
  "sony-headphones": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85",
  "apple-watch": "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=900&q=85",
  "lg-washing-machine": "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=900&q=85",
  "canon-eos-r50": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85",
  "samsung-s24-ultra": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=85",
  "macbook-air-m3": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=85",
  "sony-bravia-oled": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=900&q=85",
  "daikin-split-ac": "https://images.unsplash.com/photo-1631545806609-0e1e6c7b1c4b?auto=format&fit=crop&w=900&q=85",
  "wireless-headphones": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85",
  "smart-watch": "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=900&q=85",
  "bluetooth-speaker": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85",
  "dell-xps-13": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85",
  "hp-pavilion-15": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85",
  "lenovo-ideapad": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85",
  "lg-ultragear-27": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=85",
  "samsung-curved-32": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=85",
  "dell-curved-34": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=85",
};

export const CATEGORY_PHOTOS = {
  "All Products": "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=160&q=80",
  Electronics: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=160&q=80",
  "Mobiles & Accessories": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=160&q=80",
  "Computers & Laptops": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=160&q=80",
  "Home Appliances": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=160&q=80",
  "TV & Audio": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=160&q=80",
  Accessories: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=160&q=80",
  Fashion: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=160&q=80",
};

const slug = (value = "") =>
  String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const IMAGE_BY_NAME = Object.fromEntries(
  demoProducts.filter((demo) => PRODUCT_IMAGES[demo.id]).map((demo) => [slug(demo.name), PRODUCT_IMAGES[demo.id]])
);

const CATEGORY_IMAGES = {
  "air conditioners": "samsung-split-ac", televisions: "lg-4k-smart-tv", "mobile phones": "oneplus-12",
  refrigerators: "whirlpool-fridge", "air coolers": "symphony-cooler", fans: "crompton-fan",
  audio: "sony-headphones", smartwatches: "apple-watch", wearables: "smart-watch",
  "washing machines": "lg-washing-machine", cameras: "canon-eos-r50", laptops: "macbook-air-m3",
  monitors: "lg-ultragear-27",
};

export function getProductImage(product) {
  if (!product) return "";
  const id = String(product.id ?? "").toLowerCase();
  if (product.imagePath) return product.imagePath;
  if (product.image) return product.image;
  if (LOCAL_IMAGES[id]) return LOCAL_IMAGES[id];
  const localByName = LOCAL_IMAGES[slug(product.name ?? product.productName)];
  if (localByName) return localByName;
  if (PRODUCT_IMAGES[id]) return PRODUCT_IMAGES[id];
  const byName = IMAGE_BY_NAME[slug(product.name ?? product.productName)];
  if (byName) return byName;
  const key = CATEGORY_IMAGES[String(product.category ?? "").toLowerCase()];
  return key ? PRODUCT_IMAGES[key] : "";
}
