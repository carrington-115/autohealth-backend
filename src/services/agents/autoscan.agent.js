import * as z from "zod";
import { createAgent, tool } from "langchain";

const identifyPill = tool(
  async ({ imprint, color, shape }) => {
    console.log(`Querying pill DB for: ${imprint}, ${color}, ${shape}`);
    return `[Mock Pill Result] Pill identified: **Paracetamol 500mg** (Generic).
    - **Use**: For mild to moderate pain and fever.
    - **Warning**: Do not exceed 4000mg in 24 hours. Avoid if you have liver problems.`;
  },
  {
    name: "identify_pill_from_description",
    description:
      "Searches a pill database for a match based on its physical characteristics (imprint, color, shape).",
    schema: z.object({
      imprint: z.string().describe("The text or code stamped on the pill"),
      color: z.string().describe("The primary color of the pill"),
      shape: z
        .string()
        .describe("The shape of the pill (e.g., 'round', 'oval')"),
    }),
  }
);

const getMedicationInfo = tool(
  async ({ medicationName }) => {
    console.log(`Querying RAG for medication: ${medicationName}`);
    return `[Mock RAG Result] Information for **${medicationName}**:
    - **Use**: [Mock usage info...]
    - **Dosage**: [Mock dosage info...]
    - **Warnings**: [Mock warnings...]`;
  },
  {
    name: "get_medication_info_from_name",
    description:
      "Retrieves information (dosage, warnings) for a specific medication name. Use this *after* reading a name from a prescription or medicine bottle.",
    schema: z.object({
      medicationName: z.string().describe("The name of the drug to search for"),
    }),
  }
);

const autoScanSystemPrompt = `You are the AutoScan visual engine. You will be given an image from the user.
Your job is to analyze the image and decide which tool to use.

1.  **If the image is a pill:** Extract its imprint, color, and shape. Then, you MUST use the 'identify_pill_from_description' tool.
2.  **If the image is a prescription or medicine bottle:** Read the primary medication name. Then, you MUST use the 'get_medication_info_from_name' tool.
3.  Present the tool's result directly.

Always include a disclaimer: "Please confirm this information with your pharmacist or doctor."`;

const autoScanAgent = createAgent({
  model: "gemini-2.5-pro", // Placeholder
  tools: [identifyPill, getMedicationInfo],
  system: autoScanSystemPrompt,
});
