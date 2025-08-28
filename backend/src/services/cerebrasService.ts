import axios, { AxiosResponse } from 'axios';

export class CerebrasService {
  private static readonly API_KEY = process.env.CEREBRAS_API_KEY;
  private static readonly BASE_URL = 'https://api.cerebras.ai/v1';

  static async analyzeResumeOnly(resumeContent: string, skills: string[]): Promise<any> {
    try {
      const prompt = `
        Analyze this resume and provide a JSON response with:
        1. Key skills and keywords that stand out (array of strings)
        2. Top 5 job titles that would be a good match (array of strings)
        3. Industry recommendations (array of strings)
        4. Skill level assessment (object with levels: beginner, intermediate, advanced)
        5. Overall summary (string)
        
        Resume content: ${resumeContent}
        Extracted skills: ${skills.join(', ')}
        
        Return only valid JSON.
      `;

      const requestBody = {
        model: "cerebras-llama-2-7b-chat",
        messages: [
          {
            role: "system",
            content: "You are a professional resume analyst. Provide detailed, actionable insights in valid JSON format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
        stream: false
      };

      const response: AxiosResponse = await axios.post(
        `${this.BASE_URL}/chat/completions`,
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${this.API_KEY}`,
            'Content-Type': 'application/json',
            'User-Agent': 'ResumeAnalyzer/1.0'
          },
          timeout: 30000
        }
      );

      const aiResponse = response.data.choices[0].message.content;
      console.log('Cerebras API Response:', aiResponse);
      
      return this.parseAIResponse(aiResponse);
    } catch (error) {
      console.error('Cerebras API error:', error);
      return this.getDefaultAnalysis();
    }
  }

  
      
  }
}