import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Terminal, Search, Eraser } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CodeInputProps {
  onAnalyze: (code: string) => void;
  isAnalyzing: boolean;
  detectedLanguage?: string;
}

export function CodeInput({ onAnalyze, isAnalyzing, detectedLanguage }: CodeInputProps) {
  const [code, setCode] = useState("");
  const [stats, setStats] = useState({ lines: 0, characters: 0 });
  const { toast } = useToast();

  useEffect(() => {
    const lines = code.split('\n').length;
    const characters = code.length;
    setStats({ lines, characters });
  }, [code]);

  const handleAnalyze = () => {
    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please enter some code to analyze",
        variant: "destructive"
      });
      return;
    }
    onAnalyze(code);
  };

  const handleClear = () => {
    setCode("");
    setStats({ lines: 0, characters: 0 });
  };

  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <CardHeader className="border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
            <Terminal className="w-5 h-5 mr-2 text-primary" />
            Code Input
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-500 dark:text-slate-400">Language:</span>
            <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-mono">
              {detectedLanguage || "Auto-detect"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <Textarea
          placeholder="Paste or type your code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="min-h-80 font-mono text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-600 resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Lines: <span className="font-medium">{stats.lines}</span>
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Characters: <span className="font-medium">{stats.characters}</span>
            </span>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleClear}
              disabled={isAnalyzing}
              className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            >
              <Eraser className="w-4 h-4 mr-2" />
              Clear
            </Button>
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !code.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              <Search className="w-4 h-4 mr-2" />
              {isAnalyzing ? "Analyzing..." : "Analyze Code"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
