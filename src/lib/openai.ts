import OpenAI from "openai";

let client: OpenAI | null = null;

export const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-5.2";

export function hasOpenAIKey() {
  return Boolean(process.env.OPENAI_API_KEY);
}

export function getOpenAIClient() {
  if (!hasOpenAIKey()) return null;
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}
