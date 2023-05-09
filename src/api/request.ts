import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from 'eventsource-parser';

export type ChatGPTAgent = 'user' | 'system';

export interface ChatGPTMessage {
  role: ChatGPTAgent;
  content: string;
}

export interface OpenAIStreamPayload {
  model: string;
  messages: ChatGPTMessage[];
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  max_tokens: number;
  stream: boolean;
  n: number;
}

export interface OpenAIWithOutStreamResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  choices: [
    {
      message: {
        role: 'assistant';
        content: string;
      };
      finish_reason: 'stop';
      index: number;
    }
  ];
}

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const API_KEY_PROXY_URL =
  import.meta.env.VITE_OPENAI_API_PROXY_URL ?? 'https://api.openai.com';

export async function OpenAIStream(payload: OpenAIStreamPayload) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  let counter = 0;

  const res = await window.fetch(`${API_KEY_PROXY_URL}/v1/chat/completions`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
      Origin: '*',
    },
    method: 'POST',
    body: JSON.stringify(payload),
  });

  const stream = new ReadableStream({
    async start(controller) {
      // callback
      function onParse(event: ParsedEvent | ReconnectInterval) {
        if (event.type === 'event') {
          const data = event.data;
          // https://beta.openai.com/docs/api-reference/completions/create#completions/create-stream
          if (data === '[DONE]') {
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(data);

            const text = json.choices[0].delta?.content || '';
            if (counter < 2 && (text.match(/\n/) || []).length) {
              return;
            }
            const queue = encoder.encode(text);
            controller.enqueue(queue);
            counter++;
          } catch (e) {
            controller.error(e);
          }
        }
      }

      // stream response (SSE) from OpenAI may be fragmented into multiple chunks
      // this ensures we properly read chunks and invoke an event for each SSE event stream
      const parser = createParser(onParse);

      // https://web.dev/streams/#asynchronous-iteration
      const reader = res.body?.getReader();
      let isDone = false;
      while (!isDone) {
        if (reader) {
          const { done, value } = await reader.read();
          if (done) isDone = true;
          parser.feed(decoder.decode(value));
        }
      }
    },
  });

  return stream;
}

export async function OpenAIWithOutStream(payload: OpenAIStreamPayload) {
  return await window.fetch(`${API_KEY_PROXY_URL}/v1/chat/completions`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
      Origin: '*',
    },
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function requestData(
  prompt: string,
  isStream: boolean
): Promise<Response> {
  if (!prompt) {
    return new Response('No prompt in the request', { status: 400 });
  }

  const payload: OpenAIStreamPayload = {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 1000,
    stream: isStream,
    n: 1,
  };
  if (isStream) {
    const stream = await OpenAIStream(payload);
    return new Response(stream);
  } else {
    return await OpenAIWithOutStream(payload);
  }
}
