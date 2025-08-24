import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface AIRecommendation {
  title: string;
  description: string;
  matchScore: number;
  tags: string[];
  impactEstimate: string;
  timeline: string;
  reasoning: string;
}

export interface ProjectAnalysis {
  sdgCategory: string;
  urgencyLevel: string;
  keywordExtraction: string[];
  locationContext: string;
  estimatedBudget: number;
}

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
export async function generateAIRecommendations(
  problemDescription: string,
  location: string,
  preferredSDG?: string
): Promise<AIRecommendation[]> {
  try {
    const prompt = `
      You are an AI expert in UN Sustainable Development Goals (SDGs) and impact measurement. 
      
      Problem: "${problemDescription}"
      Location: "${location}"
      Preferred SDG: "${preferredSDG || 'Any'}"
      
      Generate 3 specific, actionable recommendations for addressing this problem. Focus on:
      1. Practical solutions that can be implemented by NGOs
      2. Measurable impact metrics
      3. Realistic timelines and resource requirements
      
      Respond with valid JSON in this exact format:
      {
        "recommendations": [
          {
            "title": "Solution title",
            "description": "Detailed description of the solution approach",
            "matchScore": 0.95,
            "tags": ["tag1", "tag2", "tag3"],
            "impactEstimate": "Number of people/communities impacted",
            "timeline": "Implementation timeframe",
            "reasoning": "Why this solution is well-matched"
          }
        ]
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert in sustainable development and NGO operations. Provide practical, implementable solutions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.recommendations || [];
  } catch (error) {
    console.error("Error generating AI recommendations:", error);
    throw new Error("Failed to generate AI recommendations: " + (error as Error).message);
  }
}

export async function analyzeProjectContent(
  title: string,
  description: string,
  location: string
): Promise<ProjectAnalysis> {
  try {
    const prompt = `
      Analyze this project submission for SDG categorization and key insights:
      
      Title: "${title}"
      Description: "${description}"
      Location: "${location}"
      
      Determine:
      1. Most relevant SDG category (sdg1-sdg17)
      2. Urgency level (low, medium, high, critical)
      3. Key problem areas and solution opportunities
      4. Estimated budget range in USD
      
      Respond with valid JSON:
      {
        "sdgCategory": "sdg2",
        "urgencyLevel": "high",
        "keywordExtraction": ["keyword1", "keyword2"],
        "locationContext": "Geographic and demographic context",
        "estimatedBudget": 5000
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert in SDG classification and project analysis."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error) {
    console.error("Error analyzing project content:", error);
    throw new Error("Failed to analyze project content: " + (error as Error).message);
  }
}

export async function generateImpactSummary(
  projectData: any,
  evidenceImages: string[]
): Promise<string> {
  try {
    const prompt = `
      Generate a comprehensive impact summary for this completed project:
      
      Project: ${JSON.stringify(projectData)}
      Evidence Count: ${evidenceImages.length} images
      
      Create a professional summary highlighting:
      1. Problem addressed
      2. Solution implemented  
      3. Measurable outcomes
      4. Community impact
      5. SDG goals achieved
      
      Keep it concise but impactful (200-300 words).
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional impact measurement specialist."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.6,
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("Error generating impact summary:", error);
    throw new Error("Failed to generate impact summary: " + (error as Error).message);
  }
}
