import toml from "@iarna/toml";
import fs from "fs";
import path from "path";

const configFileName = "config.toml";

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
    GEMINI: string; // Added Gemini API Key
    SEARXNG_SECRET?: string; // Added SearXNG Secret Key (optional if not always present)
  };
  API_ENDPOINTS: {
    SEARXNG: string;
    OLLAMA: string;
  };
}

const loadConfig = () =>
  toml.parse(
    fs.readFileSync(path.join(__dirname, `../${configFileName}`), "utf-8")
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

export const getGeminiApiKey = () => loadConfig().API_KEYS.GEMINI; // Added Gemini API Key getter

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
