import { HfInference } from '@huggingface/inference';

export async function analyzeIdea(title: string, description: string) {
  if (!process.env.HUGGINGFACE_API_KEY) {
    throw new Error("HUGGINGFACE_API_KEY is missing in .env.local. Please add it to get real AI analysis.");
  }
  
  const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
  
  const systemInstruction = `You are a highly analytical startup consultant. Analyze the given startup idea and return a structured JSON object with the fields: problem, customer, market, competitor, tech_stack, risk_level, profitability_score, justification. Rules: You MUST use extreme variance in your scoring based on realistic market mechanics. The profitability_score must be a strict integer between 10 and 95. Huge scalable markets should score highly (70-95), while niche or highly saturated markets should score poorly (10-40). The risk_level must be exactly one of: Low, Medium, or High. Physical hardware, strict regulations, or extreme competition = High risk. Simple SaaS or proven models = Low/Medium risk. Do not default all ideas to Medium or the same score. The competitor field must contain exactly 3 objects each with a name field and a differentiation field. The tech_stack field must be an array of 4 to 6 strings. Return ONLY valid JSON with no markdown formatting, no backticks, and no text outside the JSON object.`;
  
  const prompt = `Title: ${title}\nDescription: ${description}`;

  try {
    const response = await hf.chatCompletion({
      model: 'meta-llama/Meta-Llama-3-8B-Instruct',
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1500,
      temperature: 0.1, // Low temp for strictly bound JSON formats
    });

    const text = response.choices[0]?.message?.content || "";
    
    // Robustly extract JSON from the response text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const cleanText = jsonMatch ? jsonMatch[0] : text;
    
    try {
      return JSON.parse(cleanText);
    } catch (parseError) {
      console.error("AI returned malformed response:", text);
      throw new Error("The AI provided an invalid response format. Please try again.");
    }
  } catch (error: any) {
    console.error("HF Inference Error:", error.message);
    throw new Error(error.message || "Failed to analyze idea via Hugging Face. Please try again later.");
  }
}
