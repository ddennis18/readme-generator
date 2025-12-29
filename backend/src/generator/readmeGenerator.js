import { generateContent } from "../llm/geminiClient.js";

export async function generateReadme(aggregatedData) {
  const prompt = `
You are a professional technical writer and senior software engineer. 
Write a high-quality, professional README.md for a GitHub repository using ONLY the following structured JSON data. 
Do NOT invent facts. Do NOT describe non-exported functions or internal details.
Focus on the public API, features, and tech stack.

PROJECT DATA:
${JSON.stringify(aggregatedData, null, 2)}

README SECTIONS TO INCLUDE:
1. Project Overview (One or two concise paragraphs)
2. Tech Stack (List format)
3. Features (List format)
4. Project Structure (Briefly explain the folder layout)
5. Getting Started (Assume standard npm or python install/start commands based on tech stack)
6. API Routes (If applicable)
7. Notes / Limitations (If inferred, otherwise skip)

Tone: Professional, concise, developer-friendly. Avoid marketing fluff.
Output only the Markdown content.
`;

  return await generateContent(prompt);
}
