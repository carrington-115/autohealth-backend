import { HumanMessage } from "@langchain/core/messages";
import { createAgent, tool } from "langchain";

export const getHumanMessage = (prompt) => {
  return new HumanMessage(`
User Query: ${prompt} `);
};

import * as z from "zod";
import { createAgent, tool } from "langchain";

const searchMedicalKnowledgeBase = tool(
  async ({ query }) => {
    console.log(`Querying RAG for: ${query}`);
    return `[Mock Result] Based on AutoHealth's knowledge base for '${query}': Paracetamol is effective for mild fever and pain. Standard adult dosage is 500mg-1000mg every 4-6 hours.`;
  },
  {
    name: "search_medical_knowledge_base",
    description:
      "Searches the AutoHealth medical knowledge base for information on symptoms, medications, and safe self-medication practices. Use this to answer user questions about conditions or drugs.",
    schema: z.object({
      query: z
        .string()
        .describe(
          "The user's question or symptom to search for (e.g., 'treatment for mild fever', 'paracetamol dosage')"
        ),
    }),
  }
);

const checkContraindications = tool(
  async ({ medications, allergies }) => {
    console.log(
      `Checking interactions for: ${medications.join(
        ", "
      )} with allergies: ${allergies.join(", ")}`
    );
    if (medications.includes("warfarin") && medications.includes("ibuprofen")) {
      return "[Mock Safety Alert] CRITICAL: Do not take Ibuprofen with Warfarin. This combination can significantly increase the risk of bleeding. Consult a doctor.";
    }
    return "[Mock Safety OK] No critical interactions found for the provided list.";
  },
  {
    name: "check_contraindications",
    description:
      "Checks for drug-to-drug interactions or drug-to-allergy conflicts. Use this BEFORE recommending any medication if the user mentions current medications or allergies.",
    schema: z.object({
      medications: z
        .array(z.string())
        .describe("A list of medications the user is currently taking"),
      allergies: z
        .array(z.string())
        .describe(
          "A list of the user's known allergies (e.g., 'penicillin', 'aspirin')"
        ),
    }),
  }
);

// --- Tool 3: Triage / Escalation Tool ---
const recommendDoctorVisit = tool(
  async ({ reason }) => {
    // This tool might just return a standardized response for the agent to use
    console.log(`Escalating to human: ${reason}`);
    return `You must tell the user: 'Based on your symptoms (${reason}), I strongly recommend you seek medical attention from a doctor or visit an emergency room. My guidance is for informational purposes only.'`;
  },
  {
    name: "recommend_doctor_visit",
    description:
      "Use this tool to escalate to a human doctor. You MUST use this if the user describes severe, life-threatening, or emergency symptoms (e.g., 'chest pain', 'difficulty breathing', 'severe bleeding', 'suicidal thoughts').",
    schema: z.object({
      reason: z
        .string()
        .describe("The specific, severe symptom that warrants escalation"),
    }),
  }
);

// --- The System Prompt (The Most Important Part) ---
const systemPrompt = `You are "AutoHealth," a specialized AI assistant for safe self-medication guidance.

YOUR CORE RULES:
1.  **YOU ARE NOT A DOCTOR.** You must always state that your advice is not a substitute for professional medical consultation.
2.  **NEVER PROVIDE A DEFINITIVE DIAGNOSIS.** You can only provide information based on your knowledge base.
3.  **SAFETY FIRST.** Your primary goal is user safety.
4.  **USE YOUR TOOLS:**
    * Use 'search_medical_knowledge_base' to answer all questions about symptoms, conditions, or medications.
    * If a user mentions *any* other medication or allergy, you *must* use 'check_contraindications' before providing information on a new drug.
    * If a user describes *any* severe symptoms (chest pain, shortness of breath, severe pain, heavy bleeding, loss of consciousness, confusion), you MUST use 'recommend_doctor_visit' immediately and stop providing other advice.
5.  **Be empathetic, clear, and concise.**
`;

const agent = createAgent({
  model: "gemini-2.5-pro",
  tools: [
    searchMedicalKnowledgeBase,
    checkContraindications,
    recommendDoctorVisit,
  ],
  system: systemPrompt,
});
