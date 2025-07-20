import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CodeInput } from "@/components/code-input";
import { AnalysisResults } from "@/components/analysis-results";
import { AIMentorChat } from "@/components/ai-mentor-chat";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Code2, 
  Sun, 
  Moon, 
  Clock 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function CodeReview() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [chatSessionId, setChatSessionId] = useState("");
  const [currentCode, setCurrentCode] = useState("");
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  // Create new chat session on component mount
  useEffect(() => {
    const createSession = async () => {
      try {
        const response = await apiRequest('POST', '/api/chat/new-session', {});
        const data = await response.json();
        setChatSessionId(data.sessionId);
      } catch (error) {
        console.error('Failed to create chat session:', error);
      }
    };
    createSession();
  }, []);

  // Analyze code mutation
  const analyzeCodeMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await apiRequest('POST', '/api/analyze', { code });
      return response.json();
    },
    onSuccess: (data) => {
      setAnalysisResult(data);
      toast({
        title: "Analysis Complete",
        description: `Found ${data.issues?.length || 0} issues and ${data.optimizations?.length || 0} optimization suggestions`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze code",
        variant: "destructive"
      });
    }
  });

  const handleAnalyze = (code: string) => {
    setCurrentCode(code);
    analyzeCodeMutation.mutate(code);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">FixMyCode</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">AI Code Review & Mentorship</p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                ) : (
                  <Sun className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                )}
              </Button>
              <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-2"></div>
                io.net API Connected
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Code Input and Analysis Section */}
          <div className="lg:col-span-2 space-y-6">
            <CodeInput
              onAnalyze={handleAnalyze}
              isAnalyzing={analyzeCodeMutation.isPending}
              detectedLanguage={analysisResult?.language}
            />
            
            <AnalysisResults
              result={analysisResult}
              isLoading={analyzeCodeMutation.isPending}
            />
          </div>

          {/* AI Mentor Chat */}
          <div className="space-y-6">
            <AIMentorChat
              sessionId={chatSessionId}
              currentCode={currentCode}
              analysisResult={analysisResult}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Powered by <span className="font-medium text-primary">io.net AI Intelligence</span>
              </p>
              {analysisResult && (
                <div className="flex items-center space-x-1 text-xs text-slate-400 dark:text-slate-500">
                  <Clock className="w-3 h-3" />
                  <span>Last analysis: Just now</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <a href="https://docs.io.net" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                Documentation
              </a>
              <a href="https://docs.io.net/reference/get-started-with-io-intelligence-api" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                API Reference
              </a>
              <a href="https://io.net/hackathon" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
