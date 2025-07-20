# FixMyCode: AI-Agent Code Review & Mentorship Platform

**FixMyCode** is an intelligent AI-Agent code review and mentorship platform built for the Launch IO Hackathon. It leverages io.net's powerful Intelligence API and AI Agents framework to provide comprehensive code analysis, bug detection, performance optimization, security vulnerability scanning, and interactive AI mentorship guidance.

## 🚀 Features

### 1. **Intelligent Code Analysis**
- **Automatic Language Detection**: Identifies programming language with confidence scores
- **Bug Detection**: Finds syntax errors, logical issues, and potential runtime problems
- **Performance Optimization**: Suggests improvements for better code efficiency
- **Security Scanning**: Detects vulnerabilities and security anti-patterns
- **Best Practices Validation**: Ensures code follows industry standards
- **Quality Scoring**: Provides numerical quality metrics (0-100 scale)

### 2. **Interactive AI Mentor Chat**
- **Real-time Guidance**: Chat with an AI mentor about your code
- **Contextual Understanding**: AI knows about your submitted code and analysis results
- **Educational Responses**: Explains the "why" behind suggestions
- **Code Examples**: Provides practical examples and improvements
- **Session Persistence**: Maintains conversation history per analysis session

### 3. **Modern User Interface**
- **Dark/Light Theme**: Toggle between themes with system preference detection
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Live feedback and typing indicators
- **Clean Typography**: Easy-to-read analysis results and chat interface
- **Interactive Elements**: Hover effects and smooth animations

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Wouter** for lightweight client-side routing
- **TanStack Query** for server state management and caching
- **Radix UI + shadcn/ui** for accessible component primitives
- **Tailwind CSS** for utility-first styling
- **Vite** for fast development and optimized builds

### Backend
- **Node.js + Express.js** for the REST API server
- **TypeScript** with ES modules for modern JavaScript
- **Memory Storage** for development (PostgreSQL ready for production)
- **Drizzle ORM** for database schema and queries

## 🤖 io.net AI Integration

This project showcases the power of io.net's AI infrastructure through two main APIs:

### 1. Intelligence API for Code Analysis
**File Location**: `server/services/ioService.ts` (lines 15-127)

The Intelligence API powers our comprehensive code analysis engine:

```typescript
// Key method: analyzeCode()
const response = await fetch(`${this.baseUrl}/chat/completions`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${this.apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
    messages: [/* analysis prompt */],
    response_format: { type: "json_object" }
  })
});
```

**Features Powered by Intelligence API**:
- Language detection with confidence scoring
- Bug identification and severity classification
- Performance bottleneck detection
- Security vulnerability scanning
- Code quality metrics calculation
- Actionable improvement suggestions

### 2. AI Agents API for Interactive Mentorship
**File Location**: `server/services/ioService.ts` (lines 129-165)

The AI Agents API enables our interactive mentor chat system:

```typescript
// Key method: chatWithMentor()
const response = await fetch(`${this.agentsUrl}/chat/completions`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${this.apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo',
    messages: [systemMessage, ...messages]
  })
});
```

**AI Mentor Capabilities**:
- Contextual understanding of submitted code
- Educational explanations with examples
- Best practices guidance
- Interactive Q&A sessions
- Personalized learning recommendations

## 📁 Project Structure & Key Files

### Backend Core Files

#### `server/services/ioService.ts`
**Primary AI Integration Hub** - Contains all io.net API interactions:
- `IOIntelligenceService` class with dual API support
- `analyzeCode()` - Intelligence API integration for code analysis
- `chatWithMentor()` - AI Agents API integration for mentorship
- Structured JSON response parsing and error handling

#### `server/routes.ts`
**API Endpoints** - Defines all REST API routes:
- `POST /api/analyze` - Code analysis endpoint
- `POST /api/chat/new-session` - Create new chat session
- `GET /api/chat/:sessionId` - Retrieve chat history
- `POST /api/chat` - Send message to AI mentor

#### `server/storage.ts`
**Data Management** - In-memory storage with PostgreSQL schema:
- `AnalysisResult` storage and retrieval
- `ChatSession` and `ChatMessage` management
- Database-ready interface for production scaling

#### `server/index.ts`
**Application Entry Point** - Express server configuration:
- Middleware setup for JSON parsing and CORS
- Static file serving for frontend assets
- Environment variable management for API keys

### Frontend Core Files

#### `client/src/pages/code-review.tsx`
**Main Application Page** - Primary user interface:
- Code input with syntax highlighting
- Analysis results display with severity indicators
- AI mentor chat integration
- Theme toggle and responsive layout

#### `client/src/components/code-input.tsx`
**Code Editor Component** - Multi-line code input:
- Character and line counting
- Language detection preview
- Real-time validation
- Copy/paste functionality

#### `client/src/components/analysis-results.tsx`
**Analysis Display Component** - Comprehensive results presentation:
- Color-coded severity indicators (critical, high, medium, low)
- Expandable sections for detailed findings
- Quality score visualization
- Improvement suggestions formatting

#### `client/src/components/ai-mentor-chat.tsx`
**Interactive Chat Interface** - Real-time AI mentorship:
- Message history with role-based styling
- Typing indicators and loading states
- Markdown-to-text conversion for readable responses
- Session management and context awareness

### Configuration Files

#### `shared/schema.ts`
**Data Models** - TypeScript interfaces and Zod schemas:
- `AnalysisResult`, `ChatSession`, `ChatMessage` types
- Database schema definitions with Drizzle ORM
- Input validation schemas for API requests

#### `client/src/lib/queryClient.ts`
**API Client Setup** - TanStack Query configuration:
- HTTP client with automatic JSON parsing
- Error handling and retry logic
- Cache invalidation strategies

## 🔧 How It Works

### 1. Code Analysis Workflow

1. **User Input**: Developer pastes code into the editor
2. **Language Detection**: Optional preliminary detection via io.net Intelligence API
3. **Comprehensive Analysis**: Full code review sent to Intelligence API with structured prompt
4. **Result Processing**: JSON response parsed and stored in memory
5. **Visual Display**: Results shown with color-coded severity indicators

### 2. AI Mentor Interaction

1. **Session Creation**: New chat session linked to analysis results
2. **Context Injection**: AI mentor receives code context and analysis findings
3. **Interactive Chat**: Real-time Q&A powered by io.net AI Agents API
4. **Educational Guidance**: Personalized learning recommendations and explanations

### 3. Data Flow Architecture

```
User Code Input → Intelligence API → Analysis Results → Storage
                                         ↓
AI Mentor Chat ← AI Agents API ← Context + User Questions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- io.net API key ([Get yours here](https://io.net))

### Installation

1. **Clone and Install**:
```bash
git clone <repository-url>
cd fixmycode
npm install
```

2. **Set Up Environment**:
```bash
# Add your io.net API key
export IO_API_KEY="your_io_api_key_here"
```

3. **Run Development Server**:
```bash
npm run dev
```

4. **Access Application**:
Open `http://localhost:5000` in your browser

### Production Deployment

**Replit Deployment Ready**: The application is configured for seamless deployment on Replit with automatic environment variable handling and PostgreSQL database support.

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `IO_API_KEY` | io.net API key for Intelligence and Agents APIs | Yes |
| `DATABASE_URL` | PostgreSQL connection string (production) | Optional |
| `NODE_ENV` | Environment mode (development/production) | Optional |

## 🎯 Use Cases

### For Individual Developers
- **Code Review**: Get instant feedback on code quality and potential issues
- **Learning**: Understand best practices through interactive AI mentorship
- **Bug Fixing**: Identify and resolve issues before deployment
- **Security**: Detect vulnerabilities early in the development process

### For Development Teams
- **Code Standards**: Ensure consistent code quality across team members
- **Mentorship**: Provide AI-powered guidance for junior developers
- **Knowledge Sharing**: Learn from AI explanations and examples
- **Productivity**: Reduce time spent on manual code reviews

### For Educators
- **Teaching Tool**: Demonstrate good coding practices with real examples
- **Assessment**: Evaluate student code with detailed feedback
- **Interactive Learning**: Engage students with AI-powered Q&A sessions

## 🏗️ Architecture Highlights

### Scalability Features
- **Modular Design**: Separation of concerns with clear API boundaries
- **Database Ready**: PostgreSQL schema with Drizzle ORM for production scaling
- **Caching Strategy**: TanStack Query for efficient client-side caching
- **Error Handling**: Comprehensive error boundaries and fallback states

### Security Considerations
- **API Key Protection**: Server-side API key management
- **Input Validation**: Zod schema validation for all API requests
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Environment Isolation**: Separate development and production configurations

## 🤝 Contributing

This project was built for the Launch IO Hackathon to showcase the capabilities of io.net's AI infrastructure. The codebase demonstrates best practices for integrating AI APIs into modern web applications.

## 📄 License

MIT License - Feel free to use this project as a reference for your own io.net AI integrations.

---

**Built with ❤️ for the Launch IO Hackathon**

*Showcasing the power of io.net's Intelligence API and AI Agents framework for next-generation developer tools.*
