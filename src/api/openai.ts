import streamFetchProcessor from "stream-fetch-processor";
import { OpenAIStreamPayload } from "./request";

const sfp = new streamFetchProcessor();
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const API_KEY_PROXY_URL =
  import.meta.env.VITE_OPENAI_API_PROXY_URL ?? "https://api.openai.com";

type responseType = {
  id: string;
  object: string;
  created: unknown;
  model: string;
  choices: [
    {
      delta: {
        role: string;
        content: string;
      };
      index: number;
      finish_reason: unknown;
    }
  ];
};

export async function* requestWithStream(prompt: string) {
  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 1000,
    stream: true,
    n: 1,
  };
  const response = await sfp.fetch(`${API_KEY_PROXY_URL}/v1/chat/completions`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
      Origin: "*",
    },
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (response.ok) {
    const asyncResult = sfp.read();
    for await (const data of await asyncResult) {
      if (data.length > 0 && data !== "[DONE]") {
        yield JSON.parse(data) as responseType;
      }
    }
  }
}

export class streamController {
  async *requestWithStream(prompt: string) {
    const payload: OpenAIStreamPayload = {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 1000,
      stream: true,
      n: 1,
    };
    const response = await sfp.fetch(
      `${API_KEY_PROXY_URL}/v1/chat/completions`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
          Origin: "*",
        },
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
    if (response.ok) {
      const asyncResult = sfp.read();
      for await (const data of await asyncResult) {
        if (data.length > 0 && data !== "[DONE]") {
          yield JSON.parse(data) as responseType;
        }
      }
    }
  }
  cancel() {
    sfp.cancel();
  }
}
