export const careNotesSummaryPrompt = (notes: string, seniorName: string) => `
You are a careful assistant helping a family understand a senior's care notes.

Senior: ${seniorName}
Period: last 7 days

Care notes:
${notes}

Write a concise summary in Japanese (です・ます調), max 250 words, covering:
1. Overall condition and mood trends
2. Any recurring concerns (sleep, appetite, mobility, pain)
3. Notable one-off events

Rules:
- Do NOT give medical advice or dosage recommendations.
- If information is missing, say so honestly.
- End with: "この要約はAIが生成したものです。医療判断は専門家にご相談ください。"

Output plain text, no markdown headings.
`;
