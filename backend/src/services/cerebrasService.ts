import axios, { AxiosResponse } from 'axios';



export class CerebrasService {
  
  private static get API_KEY(): string {
    const key = (process.env.CEREBRAS_API_KEY || '').trim();
    if (!key) throw new Error('CEREBRAS_API_KEY not set on the server');
    return key;
  }
  private static readonly BASE_URL = 'https://api.cerebras.ai/v1';

  static async analyzeResumeOnly(resumeContent: string, skills: string[]): Promise<any> {
    try {
        const prompt = `
        Analyze this resume and return a JSON response with this EXACT structure:
          {
          "summary": "2-3 sentence overview of the resume",
          "strengths": ["strength1", "strength2", "strength3", "strength4", "strength5"],
          "improvements": ["improvement1", "improvement2", "improvement3", "improvement4"],
          "extractedSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
          "jobSearchKeyword": "keyword1",
          "skillAssessments": [
            {
              "skill": "JavaScript",
              "level": "Advanced",
              "score": 85,
              "feedback": "Strong foundation, consider learning frameworks"
            }
          ],
          "actionableRecommendations": [
            "Add quantifiable achievements",
            "Include portfolio links based on major",
            "Get relevant certifications"
          ]
        }

        Resume: ${resumeContent}
        Skills found: ${skills.join(", ")}

        Return ONLY the JSON object, no other text.
        `;


      const requestBody = {
        model: "llama-4-scout-17b-16e-instruct",
        messages: [
          {
            role: "system",
            content: "You are a professional resume analyst. Provide detailed, actionable insights in valid JSON format. Keep in mind of major if provided"
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
      Analyze this job description and return resume optimization advice in this EXACT JSON structure:
      {
        "summary": "Analysis of what this job requires",
        "strengths": ["skills to highlight", "experience to emphasize"],
        "improvements": ["what to add to resume", "what to strengthen"],
        "actionableRecommendations": [
          "Specific resume improvements for this job"
        ]
      }

      Job Description: ${jobContent}
      Requirements: ${requirements.join(', ')}

      Return ONLY the JSON object.
      `;

      const requestBody = {
        model: "llama-4-scout-17b-16e-instruct",
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
      Compare this resume against the job description and return this EXACT JSON structure:
      {
        "summary": "Overall match assessment",
        "strengths": ["matching skills", "relevant experience"],
        "improvements": ["missing skills", "gaps to address"],
        "matchScore": 75,
        "skillAssessments": [
          {
            "skill": "React",
            "level": "Advanced",
            "score": 90,
            "feedback": "Strong match for job requirements"
          }
        ],
        "actionableRecommendations": [
          "Specific steps to improve match"
        ]
      }

      Resume: ${resumeContent}
      Job Description: ${jobContent}

      Return ONLY the JSON object.
      `;

      const requestBody = {
        model: "llama-4-scout-17b-16e-instruct",
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
  static async testConnection(): Promise<boolean> {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/chat/completions`,
        {
          model: "llama-4-scout-17b-16e-instruct",
          messages: [
            {
              role: "user",
              content: "Respond with 'Hello, Cerebras is working!'"
            }
          ],
          max_tokens: 50
        },
        {
          headers: {
            'Authorization': `Bearer ${this.API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      const aiResponse = response.data.choices[0].message.content;
      return aiResponse.includes('Cerebras is working');
    } catch (error) {
      console.error('Cerebras connection test failed:', error);
      return false;
    }
  }
}
