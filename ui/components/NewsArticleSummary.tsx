"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  Clock,
  User,
  Calendar,
  Share2,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  Copy,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface NewsArticle {
  id: string;
  title: string;
  url: string;
  content: string;
  author?: string;
  publishedDate: string;
  source: string;
  category?: string;
  imageUrl?: string;
}

interface NewsArticleSummaryProps {
  article: NewsArticle;
  onBack: () => void;
}

const NewsArticleSummary: React.FC<NewsArticleSummaryProps> = ({ article, onBack }) => {
  const [summary, setSummary] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate AI summary on component mount
  useEffect(() => {
    generateSummary();
    checkBookmarkStatus();
  }, [article.id]);

  const generateSummary = async () => {
    setIsGenerating(true);
    try {
      // Simulate API call to Gemini for summary generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock summary - in real implementation, this would call the Gemini API
      const mockSummary = `This article discusses ${article.title.toLowerCase()}. Key points include:

• Main topic analysis and context
• Important developments and implications  
• Expert opinions and market reactions
• Future outlook and potential impacts

The article provides comprehensive coverage of the subject matter with detailed analysis and supporting evidence.`;
      
      setSummary(mockSummary);
    } catch (error) {
      console.error("Failed to generate summary:", error);
      setSummary("Failed to generate summary. Please try again later.");
    } finally {
      setIsGenerating(false);
    }
  };

  const checkBookmarkStatus = () => {
    const bookmarks = JSON.parse(localStorage.getItem("futuresearch_bookmarks") || "[]");
    setIsBookmarked(bookmarks.some((bookmark: any) => bookmark.id === article.id));
  };

  const toggleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem("futuresearch_bookmarks") || "[]");
    
    if (isBookmarked) {
      const updatedBookmarks = bookmarks.filter((bookmark: any) => bookmark.id !== article.id);
      localStorage.setItem("futuresearch_bookmarks", JSON.stringify(updatedBookmarks));
      setIsBookmarked(false);
    } else {
      const newBookmark = {
        id: article.id,
        title: article.title,
        url: article.url,
        source: article.source,
        publishedDate: article.publishedDate,
        summary: summary,
        bookmarkedAt: new Date().toISOString()
      };
      bookmarks.push(newBookmark);
      localStorage.setItem("futuresearch_bookmarks", JSON.stringify(bookmarks));
      setIsBookmarked(true);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${article.title}\n\n${summary}\n\nSource: ${article.url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  const shareArticle = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: summary,
          url: article.url
        });
      } catch (error) {
        console.error("Failed to share:", error);
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={onBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Results</span>
            </Button>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleBookmark}
                className="flex items-center space-x-2"
              >
                {isBookmarked ? (
                  <BookmarkCheck className="w-4 h-4 text-blue-600" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
                <span>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={shareArticle}
                className="flex items-center space-x-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="flex items-center space-x-2"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-8"
        >
          <Card className="p-6">
            {article.imageUrl && (
              <div className="mb-6">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}
            
            <div className="flex items-center space-x-2 mb-4">
              <Badge variant="secondary">{article.source}</Badge>
              {article.category && (
                <Badge variant="outline">{article.category}</Badge>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              {article.author && (
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{article.author}</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(article.publishedDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>~{Math.ceil(article.content.split(' ').length / 200)} min read</span>
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={() => window.open(article.url, '_blank')}
              className="flex items-center space-x-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Read Original Article</span>
            </Button>
          </Card>
        </motion.div>

        {/* AI Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg">
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">AI Summary</h2>
                <p className="text-sm text-gray-600">Generated using advanced AI analysis</p>
              </div>
            </div>
            
            <Separator className="mb-4" />
            
            {isGenerating ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-4 h-4 text-purple-600" />
                  </motion.div>
                  <span className="text-sm text-gray-600">Generating AI summary...</span>
                </div>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0.3 }}
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                      className="h-4 bg-gray-200 rounded animate-pulse"
                      style={{ width: `${Math.random() * 40 + 60}%` }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none text-gray-700">
                <div className="whitespace-pre-line">{summary}</div>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Article Content Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Article Preview</h3>
            <Separator className="mb-4" />
            <div className="prose prose-sm max-w-none text-gray-700">
              <p className="line-clamp-6">{article.content}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => window.open(article.url, '_blank')}
                className="w-full flex items-center justify-center space-x-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Continue Reading on {article.source}</span>
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default NewsArticleSummary; 