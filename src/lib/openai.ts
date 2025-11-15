import OpenAI from "openai";
import { Tiktoken } from "js-tiktoken";

import o200k_base from "js-tiktoken/ranks/o200k_base";

const encoding = new Tiktoken(o200k_base);

export const client = new OpenAI();
export class OpenAIClient {
  client: OpenAI;

  constructor(client: OpenAI) {
    this.client = client;
  }

  countToken(text_to_count: string) {
    const tokens = encoding.encode(text_to_count);
    const token_count = tokens.length;

    return token_count;
  }

  async chatgptModelPaid(
    system: string,
    userInput: string,
    modelName: string = "gpt-4.1"
  ) {
    const response = await this.client.chat.completions.create({
      model: modelName,
      messages: [
        { role: "system", content: system },
        { role: "user", content: userInput },
      ],
      response_format: { type: "json_object" },
    });
    return response.choices[0].message.content;
  }
  async chatgptModelForChatbot(
    system: string,
    userInput: string,
    developerInput: string,
    modelName: string = "gpt-4.1"
  ) {
    const response = await this.client.chat.completions.create({
      model: modelName,
      messages: [
        { role: "system", content: system },
        { role: "developer", content: developerInput },
        { role: "user", content: userInput },
      ],
    });
    return response.choices[0].message.content;
  }
  async chatgptModelFree(system: string, userInput: string) {
    const response = await this.client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: userInput },
      ],
      response_format: { type: "json_object" },
    });
    return response.choices[0].message.content;
  }
}
