"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, ArrowLeft, ArrowRight, Loader2, Image as ImageIcon, VideoIcon, Link as LinkIcon, ThumbsUp, MessageSquare, Clock, ExternalLink, Filter, Grid, List, Sparkles, TrendingUp, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { getSuggestions } from '@/lib/actions';
import { Message } from "@/components/ChatWindow";

interface SearchResult {
  id: string;
  title: string;
  url: string;
  snippet: string;
  type: 'webpage' | 'image' | 'video' | 'discussion';
  imageUrl?: string;
  videoUrl?: string; 
  source?: string;
  sourceIcon?: string;
  likes?: number;
  comments?: number;
  timestamp?: string;
  publishedAt?: string;
}

const MOCK_RESULTS_PER_PAGE = 8;

const generateMockResults = (query: string, page: number): SearchResult[] => {
  if (!query) return [];
  const startId = (page - 1) * MOCK_RESULTS_PER_PAGE;
  return Array.from({ length: MOCK_RESULTS_PER_PAGE }, (_, i) => {
    const id = startId + i;
    const typeSample = Math.random();
    let type: SearchResult['type'] = 'webpage';
    if (typeSample < 0.25) type = 'image';
    else if (typeSample < 0.5) type = 'video';
    else if (typeSample < 0.75) type = 'discussion'; 

    const sources = ['Wikipedia', 'Stack Overflow', 'GitHub', 'Medium', 'Reddit', 'YouTube', 'Twitter', 'LinkedIn'];
    const randomSource = sources[Math.floor(Math.random() * sources.length)];

    return {
      id: `result-${id}-${query.replace(/\s+/g, '-')}`,
      title: `${query} - ${type === 'webpage' ? 'Complete Guide' : type === 'image' ? 'Visual Reference' : type === 'video' ? 'Tutorial' : 'Discussion'} ${id + 1}`,
      url: `https://example.com/search?q=${query}&id=${id}`,
      snippet: `This comprehensive ${type} result provides detailed information about "${query}". ${type === 'webpage' ? 'Learn everything you need to know with step-by-step instructions and expert insights.' : type === 'image' ? 'High-quality visual content that illustrates key concepts and examples.' : type === 'video' ? 'Watch detailed tutorials and demonstrations from industry experts.' : 'Join the community discussion with valuable insights and real-world experiences.'} Updated recently with the latest information and best practices.`,
      type,
      imageUrl: type === 'image' || type === 'video' ? `https://picsum.photos/seed/${id}/600/400` : undefined,
      videoUrl: type === 'video' ? `https://www.youtube.com/embed/dQw4w9WgXcQ` : undefined,
      source: randomSource,
      sourceIcon: `https://www.google.com/s2/favicons?domain=${randomSource.toLowerCase().replace(' ', '')}.com&sz=32`,
      likes: type === 'discussion' ? Math.floor(Math.random() * 1000) + 50 : undefined,
      comments: type === 'discussion' ? Math.floor(Math.random() * 200) + 10 : undefined,
      timestamp: type === 'discussion' ? `${Math.floor(Math.random() * 23) + 1}h ago` : undefined,
      publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
  });
};

const EnhancedSearchResults: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [currentQuery, setCurrentQuery] = useState<string>(queryParam);
  const [inputQuery, setInputQuery] = useState<string>(queryParam);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [relatedSearches, setRelatedSearches] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(pageParam);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'webpage' | 'image' | 'video' | 'discussion'>('all');

  useEffect(() => {
    setCurrentQuery(queryParam);
    setInputQuery(queryParam);
    setCurrentPage(pageParam);
    if (queryParam) {
      setLoading(true);
      setError(null);
      setTimeout(async () => {
        try {
          const fetchedResults = generateMockResults(queryParam, pageParam);
          setResults(fetchedResults);
          // Fetch real suggestions
          if (queryParam) {
            // Ensure Message type is compatible with getSuggestions
            const messages: Message[] = [{ role: 'user', content: queryParam, id: '1' }];
            const suggestions = await getSuggestions(messages);
            setRelatedSearches(suggestions.slice(0, 6)); // Take top 6
          } else {
            setRelatedSearches([]);
          }
        } catch (e) {
          setError("Failed to fetch search results or suggestions.");
          console.error(e);
        }
        setLoading(false);
      }, 800); 
    } else {
      setResults([]);
      setRelatedSearches([]);
      setLoading(false);
    }
  }, [queryParam, pageParam]);

  const handleSearchSubmit = (e?: FormEvent<HTMLFormElement>, newQuery?: string) => {
    if (e) e.preventDefault();
    const queryToSearch = newQuery || inputQuery;
    if (queryToSearch.trim()) {
      router.push(`/search?q=${encodeURIComponent(queryToSearch.trim())}&page=1`);
    }
  };

  const handlePagination = (newPage: number) => {
    router.push(`/search?q=${encodeURIComponent(currentQuery)}&page=${newPage}`);
  };

  const filteredResults = results.filter(result => 
    activeTab === 'all' || result.type === activeTab
  );

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const days = Math.floor(diffInHours / 24);
    if (days < 7) return `${days}d ago`;
    return `${Math.floor(days / 7)}w ago`;
  };

  const renderSkeleton = () => (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="border-0 shadow-none bg-transparent">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-4 h-4" />;
      case 'video': return <VideoIcon className="w-4 h-4" />;
      case 'discussion': return <MessageSquare className="w-4 h-4" />;
      default: return <LinkIcon className="w-4 h-4" />;
    }
  };

  const renderResultCard = (result: SearchResult, index: number) => (
    <motion.div
      key={result.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="group py-6 border-b border-gray-100 last:border-b-0"
    >
      <div className="space-y-3">
        {/* Source and metadata */}
        <div className="flex items-center gap-2 text-sm">
          {result.sourceIcon && (
            <Avatar className="h-4 w-4">
              <AvatarImage src={result.sourceIcon} alt={result.source}/>
              <AvatarFallback className="text-[8px] bg-gray-100">
                {result.source?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          )}
          <span className="text-gray-600">{result.source}</span>
          <span className="text-gray-300">•</span>
          <div className="flex items-center gap-1 text-gray-500">
            <Clock className="w-3 h-3" />
            <span className="text-xs">{formatTimeAgo(result.publishedAt || new Date().toISOString())}</span>
          </div>
          <Badge variant="secondary" className="text-xs h-5">
            {getTypeIcon(result.type)}
            <span className="ml-1">{result.type.charAt(0).toUpperCase() + result.type.slice(1)}</span>
          </Badge>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <a 
            href={result.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group-hover:underline"
          >
            <h3 className="text-xl font-medium text-blue-600 hover:text-blue-800 transition-colors line-clamp-2 leading-tight">
              {result.title}
            </h3>
          </a>
          <div className="text-sm text-gray-600">
            {result.url}
          </div>
        </div>

        {/* Image preview for image/video results */}
        {(result.type === 'image' || result.type === 'video') && result.imageUrl && (
          <div className="relative w-full max-w-xs">
            <img 
              src={result.imageUrl} 
              alt={result.title} 
              className="w-full h-32 object-cover rounded-lg border" 
            />
            {result.type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                <VideoIcon className="w-8 h-8 text-white" />
              </div>
            )}
          </div>
        )}

        {/* Snippet */}
        <p className="text-gray-700 leading-relaxed line-clamp-3">
          {result.snippet}
        </p>

        {/* Actions and engagement */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a 
              href={result.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
            >
              Visit <ExternalLink className="w-3 h-3" />
            </a>
            
            {result.type === 'discussion' && (result.likes !== undefined || result.comments !== undefined) && (
              <div className="flex items-center gap-3 text-sm text-gray-500">
                {result.likes !== undefined && (
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3" /> 
                    {result.likes.toLocaleString()}
                  </span>
                )}
                {result.comments !== undefined && (
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" /> 
                    {result.comments.toLocaleString()}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Clean Header with Search */}
      <div className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            
            <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Search anything..."
                  className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-gray-50/50"
                />
              </div>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Search
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Results Summary */}
        {!loading && results.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="text-sm text-gray-600 mb-4">
                             About {(Math.random() * 1000000 + 100000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} results 
               for <span className="font-medium text-gray-900">&ldquo;{currentQuery}&rdquo;</span> 
               <span className="text-gray-400"> ({(Math.random() * 0.5 + 0.2).toFixed(2)} seconds)</span>
            </div>

            {/* Filter Tabs */}
            <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="w-full">
              <TabsList className="h-auto p-1 bg-gray-50 rounded-lg">
                <TabsTrigger value="all" className="data-[state=active]:bg-white text-sm">
                  <Globe className="w-4 h-4 mr-1" />
                  All
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {results.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="webpage" className="data-[state=active]:bg-white text-sm">
                  <LinkIcon className="w-4 h-4 mr-1" />
                  Web
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {results.filter(r => r.type === 'webpage').length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="image" className="data-[state=active]:bg-white text-sm">
                  <ImageIcon className="w-4 h-4 mr-1" />
                  Images
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {results.filter(r => r.type === 'image').length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="video" className="data-[state=active]:bg-white text-sm">
                  <VideoIcon className="w-4 h-4 mr-1" />
                  Videos
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {results.filter(r => r.type === 'video').length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="discussion" className="data-[state=active]:bg-white text-sm">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Discussions
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {results.filter(r => r.type === 'discussion').length}
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && renderSkeleton()}

        {/* Error State */}
        {!loading && error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-medium text-red-900 mb-2">Something went wrong</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <Button 
                variant="outline" 
                className="border-red-300 text-red-700 hover:bg-red-100"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          </motion.div>
        )}

        {/* No Results */}
        {!loading && !error && filteredResults.length === 0 && currentQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No results found</h3>
                             <p className="text-gray-600 mb-4">
                 We couldn&apos;t find anything for &ldquo;{currentQuery}&rdquo;. Try different keywords or check your spelling.
               </p>
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('all')}
                className="border-gray-300"
              >
                View All Results
              </Button>
            </div>
          </motion.div>
        )}

        {/* Results */}
        {!loading && !error && filteredResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {filteredResults.map((result, index) => renderResultCard(result, index))}
          </motion.div>
        )}

        {/* Pagination */}
        {!loading && filteredResults.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 flex justify-center items-center gap-4"
          >
            <Button
              variant="outline"
              onClick={() => handlePagination(currentPage - 1)}
              disabled={currentPage <= 1}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Page <span className="font-medium">{currentPage}</span>
              </span>
            </div>
            
            <Button
              variant="outline"
              onClick={() => handlePagination(currentPage + 1)}
              disabled={filteredResults.length < MOCK_RESULTS_PER_PAGE}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        )}

        {/* Related Searches */}
        {!loading && relatedSearches.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 pt-8 border-t border-gray-200"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-gray-600" />
              <h3 className="text-lg font-medium text-gray-900">Related Searches</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {relatedSearches.map((relatedQuery) => (
                <Button
                  key={relatedQuery}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSearchSubmit(undefined, relatedQuery)}
                  className="text-gray-700 bg-gray-50 hover:bg-gray-100 border-gray-200 rounded-full text-sm font-normal"
                >
                  {relatedQuery}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Floating Search Bar at Bottom */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-full shadow-lg backdrop-blur-md"
        >
          <form onSubmit={handleSearchSubmit} className="flex items-center p-2">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Search again..."
                className="pl-10 pr-4 py-2 border-0 bg-transparent focus:ring-0 focus:border-0 rounded-full"
              />
            </div>
            <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 rounded-full px-4">
              <Search className="w-4 h-4" />
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EnhancedSearchResults;