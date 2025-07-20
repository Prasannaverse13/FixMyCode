import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Copy, 
  CheckCircle, 
  FileText, 
  AlertTriangle, 
  AlertCircle, 
  XCircle, 
  Zap, 
  TrendingUp, 
  ShieldCheck 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Issue {
  type: 'performance' | 'security' | 'bug' | 'style';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  suggestion: string;
  line?: number;
}

interface Optimization {
  title: string;
  description: string;
  impact: string;
}

interface AnalysisResult {
  language: string;
  confidence: number;
  overview: string;
  issues: Issue[];
  optimizations: Optimization[];
  metrics: {
    qualityScore: number;
    complexity: 'low' | 'medium' | 'high';
    maintainability: number;
  };
}

interface AnalysisResultsProps {
  result: AnalysisResult | null;
  isLoading: boolean;
}

export function AnalysisResults({ result, isLoading }: AnalysisResultsProps) {
  const { toast } = useToast();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Code suggestion copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const getIssueIcon = (type: string, severity: string) => {
    if (severity === 'high') return <XCircle className="w-5 h-5 text-red-600" />;
    if (severity === 'medium') return <AlertCircle className="w-5 h-5 text-amber-600" />;
    return <AlertTriangle className="w-5 h-5 text-amber-600" />;
  };

  const getIssueColor = (severity: string) => {
    if (severity === 'high') return 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20';
    if (severity === 'medium') return 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20';
    return 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20';
  };

  const getSeverityTextColor = (severity: string) => {
    if (severity === 'high') return 'text-red-900 dark:text-red-200';
    if (severity === 'medium') return 'text-amber-900 dark:text-amber-200';
    return 'text-amber-900 dark:text-amber-200';
  };

  const getSeverityDescColor = (severity: string) => {
    if (severity === 'high') return 'text-red-700 dark:text-red-300';
    if (severity === 'medium') return 'text-amber-700 dark:text-amber-300';
    return 'text-amber-700 dark:text-amber-300';
  };

  const getSeverityCodeColor = (severity: string) => {
    if (severity === 'high') return 'text-red-600 dark:text-red-400';
    if (severity === 'medium') return 'text-amber-600 dark:text-amber-400';
    return 'text-amber-600 dark:text-amber-400';
  };

  const getSeverityCodeBg = (severity: string) => {
    if (severity === 'high') return 'bg-red-100 dark:bg-red-900/40';
    if (severity === 'medium') return 'bg-amber-100 dark:bg-amber-900/40';
    return 'bg-amber-100 dark:bg-amber-900/40';
  };

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader className="border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
            <Brain className="w-5 h-5 mr-2 text-primary animate-pulse" />
            AI Analysis Results
          </h2>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader className="border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
            <Brain className="w-5 h-5 mr-2 text-primary" />
            AI Analysis Results
          </h2>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-slate-500 dark:text-slate-400 text-center py-8">
            Enter your code above and click "Analyze Code" to see detailed analysis results.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <CardHeader className="border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
            <Brain className="w-5 h-5 mr-2 text-primary" />
            AI Analysis Results
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        
        {/* Language Detection */}
        <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <CheckCircle className="w-5 h-5 text-blue-600" />
          <div>
            <p className="font-medium text-blue-900 dark:text-blue-200">
              Language Detected: {result.language}
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Confidence: {result.confidence}%
            </p>
          </div>
        </div>

        {/* Code Overview */}
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Code Overview
          </h3>
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
              {result.overview}
            </p>
          </div>
        </div>

        {/* Issues Found */}
        {result.issues.length > 0 && (
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-amber-600" />
              Issues Found ({result.issues.length})
            </h3>
            <div className="space-y-3">
              {result.issues.map((issue, index) => (
                <div key={index} className={`border rounded-lg p-4 ${getIssueColor(issue.severity)}`}>
                  <div className="flex items-start space-x-3">
                    {getIssueIcon(issue.type, issue.severity)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className={`font-medium ${getSeverityTextColor(issue.severity)}`}>
                          {issue.title}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {issue.severity} {issue.type}
                        </Badge>
                      </div>
                      <p className={`text-sm mt-1 ${getSeverityDescColor(issue.severity)}`}>
                        {issue.description}
                      </p>
                      {issue.suggestion && (
                        <div className="mt-2">
                          <p className={`text-xs font-medium ${getSeverityCodeColor(issue.severity)}`}>
                            Suggested Fix:
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <code className={`text-xs px-2 py-1 rounded font-mono flex-1 ${getSeverityCodeBg(issue.severity)}`}>
                              {issue.suggestion}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(issue.suggestion)}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Optimization Suggestions */}
        {result.optimizations.length > 0 && (
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
              <Zap className="w-4 h-4 mr-2 text-emerald-600" />
              Optimization Suggestions
            </h3>
            <div className="space-y-3">
              {result.optimizations.map((optimization, index) => (
                <div key={index} className="border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 bg-emerald-50 dark:bg-emerald-900/20">
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-emerald-900 dark:text-emerald-200">
                        {optimization.title}
                      </p>
                      <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">
                        {optimization.description}
                      </p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                        Impact: {optimization.impact}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Learn More Section */}
        <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
          <h4 className="font-medium text-slate-900 dark:text-white mb-2">Learn More</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600">
              Best Practices Guide
            </Badge>
            <Badge variant="secondary" className="cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600">
              Code Quality Metrics
            </Badge>
            <Badge variant="secondary" className="cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600">
              Performance Optimization
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
