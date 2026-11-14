// Renders an SVG from src/assets/icons. `name` can be an icon file name ("cart")
// or an old emoji string ("🛒") coming from product/category data.
const files = import.meta.glob("../assets/icons/*.svg", { eager: true, query: "?raw", import: "default" });
const ICONS = Object.fromEntries(
  Object.entries(files).map(([path, svg]) => [path.split("/").pop().replace(".svg", ""), svg])
);

const EMOJI_TO_ICON = {
  "✅": "check-circle", "💳": "credit-card", "🔄": "refresh", "🚚": "truck", "🔥": "fire",
  "☎": "phone", "📞": "phone", "✉": "mail", "📬": "mail", "📍": "map-pin", "❄": "snowflake",
  "☰": "menu", "👤": "user", "♙": "user", "🔍": "search", "🛍": "bag", "🛒": "cart",
  "♡": "heart", "✓": "check", "✕": "close", "⭐": "star", "★": "star", "♻": "recycle",
  "🔧": "wrench", "🏪": "store", "🏷": "tag", "🌀": "cooler", "🪭": "fan", "🎧": "headphones",
  "💻": "laptop", "📱": "smartphone", "📷": "camera", "📺": "tv", "🔊": "speaker", "🖥": "monitor",
  "🧊": "fridge", "🫧": "washing", "⌚": "watch", "🏢": "building", "📦": "package", "🪟": "window",
  "🏠": "home", "🔒": "lock", "🗑": "trash", "🛡": "shield", "📋": "clipboard", "💬": "chat",
  "👕": "shirt", "🧺": "basket", "⚠": "alert", "❌": "x-circle", "🍳": "microwave", "💰": "rupee",
  "🔌": "plug", "✦": "sparkle", "♧": "gift",
};

export default function Icon({ name, className = "", title }) {
  const clean = String(name ?? "").replace(/\uFE0F/g, "");
  const key = EMOJI_TO_ICON[clean] || clean;
  const svg = ICONS[key] || ICONS.bag;
  return (
    <span
      className={`icon icon-${EMOJI_TO_ICON[clean] || (ICONS[key] ? key : "bag")} ${className}`.trim()}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
