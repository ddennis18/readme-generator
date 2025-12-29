import { generateContent } from "../llm/geminiClient.js";

export async function generateReadme(aggregatedData, userContext = {}) {
  const { projectName, projectDescription } = userContext;

  const prompt = `
You are a professional technical writer and senior software engineer. 
Write a high-quality, professional README.md for a GitHub repository using the following structured JSON data and user-provided context.

${
  projectName || projectDescription
    ? `USER-PROVIDED CONTEXT:
${projectName ? `- Requested Project Name: ${projectName}` : ""}
${projectDescription ? `- Project Description/Goal: ${projectDescription}` : ""}
`
    : ""
}

PROJECT AST DATA (DETERMINISTIC FACTS):
${JSON.stringify(aggregatedData, null, 2)}

INSTRUCTIONS:
1. Use the "Requested Project Name" if provided; otherwise, use the repository name from the AST data.
2. Use the "Project Description/Goal" to write a better Project Overview.
3. Do NOT invent features not supported by the AST data.
4. Do NOT describe non-exported functions or internal details.
5. Focus on the public API, features, and tech stack.

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
