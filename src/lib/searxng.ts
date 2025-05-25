import axios from "axios";
// import { getSearxngApiEndpoint, getSearxngSecretKey } from "../config"; // getSearxngSecretKey no longer needed
import { getSearxngApiEndpoint } from "../config"; // Only getSearxngApiEndpoint needed

interface SearxngSearchOptions {
  categories?: string[];
  engines?: string[];
  language?: string;
  pageno?: number;
}

interface SearxngSearchResult {
  title: string;
  url: string;
  img_src?: string;
  thumbnail_src?: string;
  thumbnail?: string;
  content?: string;
  author?: string;
  iframe_src?: string;
}

export const searchSearxng = async (
  query: string,
  opts?: SearxngSearchOptions
) => {
  const searxngURL = getSearxngApiEndpoint();
  if (!searxngURL) {
    console.error("SearXNG API endpoint is not configured.");
    return { results: [], suggestions: [] };
  }

  const url = new URL(`${searxngURL}/search`);
  url.searchParams.append("q", query);
  url.searchParams.append("format", "json");

  if (opts) {
    Object.entries(opts).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        url.searchParams.append(key, value.join(","));
      } else if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  console.log(`[SearXNG] Sending query: "${query}" to URL: ${url.toString()}`);
  // const secretKey = getSearxngSecretKey(); // No longer needed if secret_key is commented out in SearXNG
  const headers: Record<string, string> = {}; // Define headers object

  // if (secretKey) { // No longer sending auth headers
    // const basicAuth = Buffer.from(`:${secretKey}`).toString('base64');
    // headers["Authorization"] = `Basic ${basicAuth}`;
    // console.log("[SearXNG] Using Basic Authorization header.");
  // }

  try {
    const res = await axios.get(url.toString(), { 
      headers,
      timeout: 10000  // Increase timeout to 10 seconds
    });

    const results: SearxngSearchResult[] = res.data.results || [];
    const suggestions: string[] = res.data.suggestions || [];

    console.log(`[SearXNG] Received ${results.length} results for query: "${query}"`);
    if (results.length === 0) {
        console.log("[SearXNG] Response data:", res.data);
    }

    return { results, suggestions };
  } catch (error) {
    console.error(`[SearXNG] Error fetching search results for query "${query}":`, error.message);
    if (error.response) {
      console.error("[SearXNG] Error response data:", error.response.data);
      console.error("[SearXNG] Error response status:", error.response.status);
    }
    return { results: [], suggestions: [] };
  }
};
