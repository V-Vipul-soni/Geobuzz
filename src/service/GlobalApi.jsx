const _imageCache = new Map();

const BASE_URL = "https://places.googleapis.com/v1/places:searchText";

export const GetPlaceDetails = async (data) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": import.meta.env.VITE_GOOGLE_PLACE_API_KEY,
      "X-Goog-FieldMask": "places.photos,places.displayName,places.id",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to fetch place details");
  return response.json();
};

export const PHOTO_REF_URL =
  "https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1000&maxWidthPx=1000&key=" +
  import.meta.env.VITE_GOOGLE_PLACE_API_KEY;

/**
 * Build a context-aware Pexels search query.
 *
 * - 'hotel'  → appends "hotel building exterior" so Pexels doesn't
 *              return a literal lemon for "Lemon Tree Hotel"
 * - 'place'  → appends "tourism landmark" so city searches return
 *              recognisable skylines/monuments instead of random streets
 */
const buildSearchQuery = (name, type) => {
  if (type === "hotel") return `${name} hotel building exterior`;
  if (type === "place") return `${name} tourism landmark`;
  return name;
};

/**
 * Fetch the best available image for a hotel or tourist place.
 *
 * Priority order for hotels:
 *   1. Google Places API  (actual business photos — most accurate)
 *   2. Pexels             (with "hotel building exterior" appended)
 *   3. Wikipedia          (thumbnail of the article)
 *   4. /placeholder.jpg
 *
 * Priority order for destinations / tourist places:
 *   1. Pexels             (with "tourism landmark" appended)
 *   2. Wikipedia
 *   3. /placeholder.jpg
 *
 * @param {string} query  - Hotel name or place/city name
 * @param {'hotel'|'place'} type - Controls query enrichment strategy
 */
export const getPlaceImage = async (query, type = "place") => {
  if (!query) return "/placeholder.jpg";

  const cleanQuery = query.split(",")[0].trim();
  const cacheKey = `${type}::${cleanQuery}`;

  if (_imageCache.has(cacheKey)) return _imageCache.get(cacheKey);

  // ── 1. Google Places API (hotels only) ───────────────────────────────────
  if (type === "hotel") {
    try {
      const data = await GetPlaceDetails({ textQuery: cleanQuery });
      const photoName = data?.places?.[0]?.photos?.[0]?.name;
      if (photoName) {
        const url = PHOTO_REF_URL.replace("{NAME}", photoName);
        _imageCache.set(cacheKey, url);
        return url;
      }
    } catch { /* fall through */ }
  }

  // ── 2. Pexels (context-aware query) ──────────────────────────────────────
  try {
    const searchQuery = buildSearchQuery(cleanQuery, type);
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchQuery)}&per_page=5&orientation=landscape`,
      { headers: { Authorization: import.meta.env.VITE_PEXELS_API_KEY } }
    );
    if (res.ok) {
      const pexelsData = await res.json();
      // Pick the first photo — Pexels ranks by relevance
      const url = pexelsData?.photos?.[0]?.src?.large;
      if (url) {
        _imageCache.set(cacheKey, url);
        return url;
      }
    }
  } catch { /* fall through */ }

  // ── 3. Wikipedia thumbnail ────────────────────────────────────────────────
  try {
    const res = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(cleanQuery)}&prop=pageimages&format=json&pithumbsize=1000&origin=*`
    );
    if (res.ok) {
      const wikiData = await res.json();
      const pages = wikiData?.query?.pages;
      const url = pages ? Object.values(pages)[0]?.thumbnail?.source : null;
      if (url) {
        _imageCache.set(cacheKey, url);
        return url;
      }
    }
  } catch { /* fall through */ }

  return "/placeholder.jpg";
};
