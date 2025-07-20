interface IOIntelligenceConfig {
  apiKey: string;
  baseUrl: string;
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface CodeAnalysisResult {
  language: string;
  confidence: number;
  overview: string;
  issues: Array<{
    type: 'performance' | 'security' | 'bug' | 'style';
    severity: 'low' | 'medium' | 'high';
    title: string;
    description: string;
    suggestion: string;
    line?: number;
  }>;
  optimizations: Array<{
    title: string;
    description: string;
    impact: string;
  }>;
  metrics: {
    qualityScore: number;
    complexity: 'low' | 'medium' | 'high';
    maintainability: number;
  };
}

class IOIntelligenceService {
  private config: IOIntelligenceConfig;

  constructor() {
    this.config = {
      apiKey: process.env.IO_API_KEY || '',
      baseUrl: 'https://api.intelligence.io.solutions/api/v1'
    };

    if (!this.config.apiKey) {
      throw new Error('IO_API_KEY environment variable is required');
    }
  }

  async analyzeCode(code: string): Promise<CodeAnalysisResult> {
    try {
      const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'meta-llama/Llama-3.3-70B-Instruct',
          messages: [
            {
              role: 'system',
              content: `You are an expert code reviewer and software engineer. Analyze the provided code and return a comprehensive analysis in JSON format. Include:
              1. Language detection with confidence
              2. Code overview
              3. Issues found (performance, security, bugs, style)
              4. Optimization suggestions
              5. Quality metrics

              Return your response as valid JSON with this structure:
              {
                "language": "string",
                "confidence": number (0-100),
                "overview": "string",
                "issues": [
                  {
                    "type": "performance|security|bug|style",
                    "severity": "low|medium|high",
                    "title": "string",
                    "description": "string",
                    "suggestion": "string",
                    "line": number (optional)
                  }
                ],
                "optimizations": [
                  {
                    "title": "string",
                    "description": "string",
                    "impact": "string"
                  }
                ],
                "metrics": {
                  "qualityScore": number (0-100),
                  "complexity": "low|medium|high",
                  "maintainability": number (0-100)
                }
              }`
            },
            {
              role: 'user',
              content: `Please analyze this code:\n\n${code}`
            }
          ],
          response_format: { type: "json_object" },
          temperature: 0.1
        })
      });

      if (!response.ok) {
        throw new Error(`IO Intelligence API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No response content from IO Intelligence API');
      }

      return JSON.parse(content);
    } catch (error) {
      console.error('Error analyzing code:', error);
      throw new Error(`Failed to analyze code: ${error.message}`);
    }
  }

  async chatWithMentor(messages: ChatMessage[]): Promise<string> {
    try {
      const systemMessage: ChatMessage = {
        role: 'system',
        content: `You are an experienced software engineering mentor and code review expert. You help developers understand their code, learn best practices, and improve their programming skills. 

        Your responses should be:
        - Educational and explanatory
        - Practical with actionable advice
        - Encouraging and supportive
        - Include code examples when helpful
        - Reference best practices and modern patterns
        - Written in plain text format (no markdown, headers, or special formatting)
        - Use simple paragraphs and bullet points with • symbol for lists

        When discussing code issues, always explain the "why" behind your suggestions. Keep your responses conversational and easy to read.`
      };

      const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'meta-llama/Llama-3.3-70B-Instruct',
          messages: [systemMessage, ...messages],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`IO Intelligence API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No response content from IO Intelligence API');
      }

      return content;
    } catch (error) {
      console.error('Error in mentor chat:', error);
      throw new Error(`Failed to get mentor response: ${error.message}`);
    }
  }

  async detectLanguage(code: string): Promise<{ language: string; confidence: number }> {
    try {
      const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'meta-llama/Llama-3.3-70B-Instruct',
          messages: [
            {
              role: 'system',
              content: 'You are a programming language detection expert. Analyze the provided code and identify the programming language. Return your response as JSON with this format: {"language": "string", "confidence": number (0-100)}'
            },
            {
              role: 'user',
              content: `Detect the programming language of this code:\n\n${code}`
            }
          ],
          response_format: { type: "json_object" },
          temperature: 0.1
        })
      });

      if (!response.ok) {
        throw new Error(`IO Intelligence API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No response content from IO Intelligence API');
      }

      return JSON.parse(content);
    } catch (error) {
      console.error('Error detecting language:', error);
      throw new Error(`Failed to detect language: ${error.message}`);
    }
  }
}

export const ioService = new IOIntelligenceService();
export type { CodeAnalysisResult, ChatMessage };
