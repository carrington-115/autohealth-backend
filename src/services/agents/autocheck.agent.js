import * as z from "zod";
import { createAgent, tool } from "langchain";

const analyzeSymptomSet = tool(
  async ({ symptoms, duration, severity }) => {
    console.log(
      `Analyzing symptoms: ${symptoms.join(", ")} for ${duration} (${severity})`
    );

    // Mock response
    if (symptoms.includes("fever") && symptoms.includes("cough")) {
      return `[Mock Result] Symptoms match informational guides for:
      1.  **Common Cold**: Characterized by cough, fever, and runny nose.
      2.  **Influenza (Flu)**: Similar to a cold but often more severe and sudden.

      **Self-Care Info**: For mild symptoms, rest, stay hydrated, and consider Paracetamol for fever.`;
    }
    return "[Mock Result] No specific informational match found. Please describe your symptoms in more detail.";
  },
  {
    name: "analyze_symptom_set",
    description:
      "Analyzes a structured list of symptoms from the user's 'AutoCheck' form. It provides informational (non-diagnostic) matches and self-care advice from the AutoHealth knowledge base.",
    schema: z.object({
      symptoms: z
        .array(z.string())
        .describe("A list of symptoms reported by the user"),
      duration: z
        .string()
        .describe("How long the user has had the symptoms (e.g., '3 days')"),
      severity: z
        .enum(["mild", "moderate", "severe"])
        .describe("The user's self-reported severity"),
    }),
  }
);

const autoCheckSystemPrompt = `You are the AutoCheck engine. You are not a conversational chatbot.
Your one and only job is to receive a structured symptom list, immediately pass it to the 'analyze_symptom_set' tool, and then present the tool's output clearly to the user.

You MUST always conclude your response with this exact disclaimer:
"This information is not a medical diagnosis. For a professional opinion, please consult a healthcare provider, especially if your symptoms worsen or are severe."`;

const agent = createAgent({
  model: "gemini-2.5-pro", // Placeholder
  tools: [analyzeSymptomSet],
  system: autoCheckSystemPrompt,
});

export default agent;
