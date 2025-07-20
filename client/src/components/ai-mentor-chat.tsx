import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Lightbulb, 
  RefreshCw, 
  HelpCircle,
  BarChart3 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

interface AIMentorChatProps {
  sessionId: string;
  currentCode?: string;
  analysisResult?: any;
}

export function AIMentorChat({ sessionId, currentCode, analysisResult }: AIMentorChatProps) {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Convert markdown to plain text
  const markdownToText = (markdown: string): string => {
    return markdown
      // Remove headers
      .replace(/#{1,6}\s+/g, '')
      // Remove bold/italic
      .replace(/(\*\*|__)(.*?)\1/g, '$2')
      .replace(/(\*|_)(.*?)\1/g, '$2')
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, '[Code Example]')
      .replace(/`([^`]+)`/g, '$1')
      // Remove links
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // Remove list markers
      .replace(/^\s*[\*\-\+]\s+/gm, '• ')
      .replace(/^\s*\d+\.\s+/gm, '')
      // Clean up extra whitespace
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  };

  // Fetch chat history
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['/api/chat', sessionId],
    enabled: !!sessionId,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ message, context }: { message: string; context?: any }) => {
      const response = await apiRequest('POST', '/api/chat', {
        sessionId,
        message,
        context
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat', sessionId] });
      setInput("");
      setIsTyping(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive"
      });
      setIsTyping(false);
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || sendMessageMutation.isPending) return;

    setIsTyping(true);
    sendMessageMutation.mutate({
      message: input,
      context: currentCode ? { code: currentCode } : undefined
    });
  };

  const handleQuickAction = (action: string) => {
    if (sendMessageMutation.isPending) return;

    let message = "";
    switch (action) {
      case "explain":
        message = "Can you explain how this code works?";
        break;
      case "refactor":
        message = "How can I refactor this code to make it better?";
        break;
      case "best-practices":
        message = "What are the best practices I should follow for this code?";
        break;
      default:
        return;
    }

    setIsTyping(true);
    sendMessageMutation.mutate({
      message,
      context: currentCode ? { code: currentCode } : undefined
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Chat Panel */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 h-[600px] flex flex-col">
        <CardHeader className="border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
            <MessageCircle className="w-5 h-5 mr-2 text-primary" />
            AI Code Mentor
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Ask questions about your code and get expert guidance
          </p>
        </CardHeader>
        
        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <>
              {messages.length === 0 && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 bg-slate-50 dark:bg-slate-900 rounded-lg p-3">
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      Hello! I'm your AI code mentor. I can help you understand your code, suggest improvements, explain best practices, and answer any programming questions you have. What would you like to know?
                    </p>
                    <span className="text-xs text-slate-500 dark:text-slate-400 mt-2 block">
                      Just now
                    </span>
                  </div>
                </div>
              )}
              
              {messages.map((message: ChatMessage) => (
                <div 
                  key={message.id} 
                  className={`flex items-start space-x-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' 
                      ? 'bg-slate-300 dark:bg-slate-600' 
                      : 'bg-gradient-to-br from-purple-500 to-blue-600'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={`flex-1 rounded-lg p-3 ${
                    message.role === 'user' 
                      ? 'bg-primary text-white' 
                      : 'bg-slate-50 dark:bg-slate-900'
                  }`}>
                    <p className={`text-sm whitespace-pre-wrap ${
                      message.role === 'user' 
                        ? 'text-white' 
                        : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      {message.role === 'assistant' ? markdownToText(message.content) : message.content}
                    </p>
                    <span className={`text-xs mt-2 block ${
                      message.role === 'user' 
                        ? 'text-blue-200' 
                        : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      {formatTime(message.createdAt)}
                    </span>
                  </div>
                </div>
              ))}

              {(isTyping || sendMessageMutation.isPending) && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 bg-slate-50 dark:bg-slate-900 rounded-lg p-3">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Chat Input */}
        <div className="border-t border-slate-200 dark:border-slate-700 p-4">
          <div className="flex space-x-2 mb-2">
            <Input
              type="text"
              placeholder="Ask about your code..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              disabled={sendMessageMutation.isPending}
              className="flex-1 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-600"
            />
            <Button 
              onClick={handleSend}
              disabled={!input.trim() || sendMessageMutation.isPending}
              className="bg-primary hover:bg-primary/90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuickAction('explain')}
              disabled={sendMessageMutation.isPending}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <Lightbulb className="w-3 h-3 mr-1" />
              Explain this code
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuickAction('refactor')}
              disabled={sendMessageMutation.isPending}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Refactor code
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuickAction('best-practices')}
              disabled={sendMessageMutation.isPending}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <HelpCircle className="w-3 h-3 mr-1" />
              Best practices
            </Button>
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      {analysisResult && (
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardContent className="p-4">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analysis Summary
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">
                  {analysisResult.issues?.length || 0}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Issues Found</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">
                  {analysisResult.optimizations?.length || 0}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Suggestions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {analysisResult.metrics?.qualityScore || 0}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Quality Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {analysisResult.metrics?.complexity || 'N/A'}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Complexity</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
