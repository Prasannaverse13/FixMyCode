import { 
  users, 
  codeAnalyses, 
  chatMessages,
  type User, 
  type InsertUser,
  type CodeAnalysis,
  type InsertCodeAnalysis,
  type ChatMessage,
  type InsertChatMessage
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createCodeAnalysis(analysis: InsertCodeAnalysis & { analysisResult: any }): Promise<CodeAnalysis>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessages(sessionId: string): Promise<ChatMessage[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private analyses: Map<number, CodeAnalysis>;
  private messages: Map<number, ChatMessage>;
  private userCurrentId: number;
  private analysisCurrentId: number;
  private messageCurrentId: number;

  constructor() {
    this.users = new Map();
    this.analyses = new Map();
    this.messages = new Map();
    this.userCurrentId = 1;
    this.analysisCurrentId = 1;
    this.messageCurrentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createCodeAnalysis(analysis: InsertCodeAnalysis & { analysisResult: any }): Promise<CodeAnalysis> {
    const id = this.analysisCurrentId++;
    const codeAnalysis: CodeAnalysis = {
      id,
      code: analysis.code,
      language: analysis.language || null,
      analysisResult: analysis.analysisResult,
      createdAt: new Date()
    };
    this.analyses.set(id, codeAnalysis);
    return codeAnalysis;
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const id = this.messageCurrentId++;
    const chatMessage: ChatMessage = {
      ...message,
      id,
      createdAt: new Date()
    };
    this.messages.set(id, chatMessage);
    return chatMessage;
  }

  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    return Array.from(this.messages.values())
      .filter(message => message.sessionId === sessionId)
      .sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime());
  }
}

export const storage = new MemStorage();
