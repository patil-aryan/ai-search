import toml from "@iarna/toml";
import fs from "fs";
import path from "path";

const configFileName = "config.toml";

// Always resolve config.toml from process.cwd(), not relative to __dirname
const configPath = path.resolve(process.cwd(), configFileName);

interface Config {
  GENERAL: {
    PORT: number;
    SIMILARITY_MEASURE: string;
    CHAT_MODEL_PROVIDER: string;
    CHAT_MODEL: string;
  };
  API_KEYS: {
    OPENAI: string;
    GROQ: string;
    GEMINI: string | string[]; // Support both single key and array of keys
    SEARXNG_SECRET?: string;
  };
  API_ENDPOINTS: {
    SEARXNG: string;
    OLLAMA: string;
  };
}

let currentKeyIndex = 0;

const loadConfig = () =>
  toml.parse(
    fs.readFileSync(configPath, "utf-8")
  ) as any as Config;

export const getPort = () => loadConfig().GENERAL.PORT;

export const getSimilarityMeasure = () =>
  loadConfig().GENERAL.SIMILARITY_MEASURE;

export const getChatModelProvider = () =>
  loadConfig().GENERAL.CHAT_MODEL_PROVIDER;

export const getOllamaApiEndpoint = () => loadConfig().API_ENDPOINTS.OLLAMA;

export const getChatModel = () => loadConfig().GENERAL.CHAT_MODEL;

export const getOpenaiApiKey = () => loadConfig().API_KEYS.OPENAI;

export const getGroqApiKey = () => loadConfig().API_KEYS.GROQ;

// Enhanced Gemini API key management with load balancing and failover
export const getGeminiApiKey = () => {
  const config = loadConfig();
  const geminiKeys = config.API_KEYS.GEMINI;
  
  if (Array.isArray(geminiKeys)) {
    // Round-robin load balancing
    const selectedKey = geminiKeys[currentKeyIndex % geminiKeys.length];
    currentKeyIndex = (currentKeyIndex + 1) % geminiKeys.length;
    return selectedKey;
  }
  
  return geminiKeys; // Single key fallback
};

// Get all Gemini keys for failover scenarios
export const getAllGeminiApiKeys = () => {
  const config = loadConfig();
  const geminiKeys = config.API_KEYS.GEMINI;
  return Array.isArray(geminiKeys) ? geminiKeys : [geminiKeys];
};

// Get a specific Gemini key by index
export const getGeminiApiKeyByIndex = (index: number) => {
  const keys = getAllGeminiApiKeys();
  return keys[index % keys.length];
};

export const getSearxngApiEndpoint = () => loadConfig().API_ENDPOINTS.SEARXNG;

export const getSearxngSecretKey = (): string | undefined => {
  return loadConfig().API_KEYS.SEARXNG_SECRET;
};

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

export const updateConfig = (config: RecursivePartial<Config>) => {
  const currentConfig = loadConfig();

  for (const key in currentConfig) {
    if (currentConfig[key] && typeof currentConfig[key] === "object") {
      for (const nestedKey in currentConfig[key]) {
        if (
          currentConfig[key][nestedKey] &&
          !config[key][nestedKey] &&
          config[key][nestedKey] !== ""
        ) {
          config[key][nestedKey] = currentConfig[key][nestedKey];
        }
      }
    } else if (currentConfig[key] && !config[key] && config[key] !== "") {
      config[key] = currentConfig[key];
    }
  }

  fs.writeFileSync(
    path.join(__dirname, `../${configFileName}`),
    toml.stringify(config)
  );
};
