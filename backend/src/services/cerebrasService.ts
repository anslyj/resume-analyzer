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
  static async analyzeJobOnly(jobContent: string, requirements: string[]): Promise<any> {
    try {
      const prompt = `
        Based on this job description, suggest improvements for a resume:
        1. Key skills to highlight (array of strings)
        2. Specific keywords to include (array of strings)
        3. Experience examples to emphasize (array of strings)
        4. Resume sections to strengthen (array of strings)
        5. Overall recommendations (string)
        
        Job description: ${jobContent}
        Requirements: ${requirements.join(', ')}
        
        Return only valid JSON.
      `;

      const requestBody = {
        model: "gpt-oss-120b-chat",
        messages: [
          {
            role: "system",
            content: "You are a career coach helping job seekers optimize their resumes. Return valid JSON."
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
      return this.parseAIResponse(aiResponse);
    } catch (error) {
      console.error('Cerebras API error:', error);
      return this.getDefaultAnalysis();
    } 
  }

  static async analyzeBoth(resumeContent: string, jobContent: string, resumeSkills: string[], jobRequirements: string[]): Promise<any> {
    try {
      const prompt = `
        Compare this resume with the job description and provide analysis:
        1. Skills that match well (object with strengths: array of strings)
        2. Skills that are missing (object with gaps: array of strings)
        3. Specific improvements needed (array of strings)
        4. Overall match percentage (number)
        5. Detailed analysis (string)
        
        Resume: ${resumeContent}
        Resume Skills: ${resumeSkills.join(', ')}
        Job Description: ${jobContent}
        Job Requirements: ${jobRequirements.join(', ')}
        
        Return only valid JSON.
      `;

      const requestBody = {
        model: "gpt-oss-120b-chat",
        messages: [
          {
            role: "system",
            content: "You are a hiring manager comparing resumes to job requirements. Return valid JSON."
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
      return this.parseAIResponse(aiResponse);
    } catch (error) {
      console.error('Cerebras API error:', error);
      return this.getDefaultAnalysis();
    }
  }



  private static parseAIResponse(response: string | null): any {
    if (!response) return this.getDefaultAnalysis();
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log('Successfully parsed AI respose:', parsed);
        return parsed;
      }
      return this.getDefaultAnalysis();
    } catch ( error) {
      console.error('Failed to parse AI response:', error);
      return this.getDefaultAnalysis();
    }

  }

  private static getDefaultAnalysis(): any {
    return {
      skills: ['JavaScript', 'React', 'Node.js'],
      jobMatches: ['Software Developer', 'Frontend Engineer', 'Full Stack Developer'],
      recommendations: ['Add more specific project examples', 'Include metrics and achievements'],
      summary: 'Resume shows good technical skills but could benefit from more quantifiable achievements.'
    };
  }
}
