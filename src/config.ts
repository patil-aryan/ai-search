import toml from "@iarna/toml";
import fs from "fs";
import path from "path";

const configFileName = "config.toml";

// Resolve config.toml relative to the dist/ directory where compiled code runs
const configPath = path.resolve(__dirname, '..', configFileName);

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

const configExists = fs.existsSync(configPath);

const loadConfig = () => {
  if (!configExists) {
    throw new Error(
      'No config.toml found and no environment variables set. Please set environment variables for all required secrets and config.'
    );
  }
  return toml.parse(fs.readFileSync(configPath, "utf-8")) as any as Config;
};

const getEnvOrConfig = <T>(envKey: string, fallback: () => T, isArray = false): T => {
  const envValue = process.env[envKey];
  if (envValue !== undefined) {
    if (isArray) {
      return envValue.split(',').map((v) => v.trim()) as any as T;
    }
    return envValue as any as T;
  }
  if (configExists) return fallback();
  throw new Error(`Missing required config: ${envKey}`);
};

export const getPort = () => Number(process.env.PORT) || (configExists ? loadConfig().GENERAL.PORT : 3001);

export const getSimilarityMeasure = () =>
  getEnvOrConfig('SIMILARITY_MEASURE', () => loadConfig().GENERAL.SIMILARITY_MEASURE);

export const getChatModelProvider = () =>
  getEnvOrConfig('CHAT_MODEL_PROVIDER', () => loadConfig().GENERAL.CHAT_MODEL_PROVIDER);

export const getOllamaApiEndpoint = () =>
  getEnvOrConfig('OLLAMA_API_URL', () => loadConfig().API_ENDPOINTS.OLLAMA);

export const getChatModel = () =>
  getEnvOrConfig('CHAT_MODEL', () => loadConfig().GENERAL.CHAT_MODEL);

export const getOpenaiApiKey = () =>
  getEnvOrConfig('OPENAI_API_KEY', () => loadConfig().API_KEYS.OPENAI);

export const getGroqApiKey = () =>
  getEnvOrConfig('GROQ_API_KEY', () => loadConfig().API_KEYS.GROQ);

// Enhanced Gemini API key management with load balancing and failover
export const getGeminiApiKey = () => {
  const geminiKeys = getEnvOrConfig('GEMINI_API_KEYS', () => loadConfig().API_KEYS.GEMINI, true);
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
  const geminiKeys = getEnvOrConfig('GEMINI_API_KEYS', () => loadConfig().API_KEYS.GEMINI, true);
  return Array.isArray(geminiKeys) ? geminiKeys : [geminiKeys];
};

// Get a specific Gemini key by index
export const getGeminiApiKeyByIndex = (index: number) => {
  const keys = getAllGeminiApiKeys();
  return keys[index % keys.length];
};

export const getSearxngApiEndpoint = () =>
  getEnvOrConfig('SEARXNG_API_URL', () => loadConfig().API_ENDPOINTS.SEARXNG);

export const getSearxngSecretKey = (): string | undefined => {
  return getEnvOrConfig('SEARXNG_SECRET', () => loadConfig().API_KEYS.SEARXNG_SECRET);
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

  // Write config.toml to the working directory root, not relative to __dirname
  fs.writeFileSync(
    configPath,
    toml.stringify(config)
  );
};
