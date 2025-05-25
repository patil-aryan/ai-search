"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, ArrowLeft, ArrowRight, Loader2, Image as ImageIcon, VideoIcon, Link as LinkIcon, ThumbsUp, MessageSquare, Clock, ExternalLink, Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";

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

const MOCK_RELATED_SEARCHES = (query: string): string[] => {
  if (!query) return [];
  return [
    `${query} tutorial`,
    `best ${query} practices`,
    `${query} examples`,
    `how to ${query}`,
    `${query} vs alternatives`,
    `latest ${query} trends`,
  ];
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
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [filterType, setFilterType] = useState<'all' | 'webpage' | 'image' | 'video' | 'discussion'>('all');

  useEffect(() => {
    setCurrentQuery(queryParam);
    setInputQuery(queryParam);
    setCurrentPage(pageParam);
    if (queryParam) {
      setLoading(true);
      setError(null);
      setTimeout(() => {
        try {
          const fetchedResults = generateMockResults(queryParam, pageParam);
          setResults(fetchedResults);
          setRelatedSearches(MOCK_RELATED_SEARCHES(queryParam));
        } catch (e) {
          setError("Failed to fetch search results.");
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
    filterType === 'all' || result.type === filterType
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="border-neutral-200/60 bg-white shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 mb-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-5 w-3/4" />
          </CardHeader>
          <CardContent className="pt-0">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
          </CardContent>
        </Card>
      ))}
    </motion.div>
  );

  const renderResultCard = (result: SearchResult, index: number) => (
    <motion.div
      key={result.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="group overflow-hidden border-neutral-200/60 bg-white shadow-sm hover:shadow-lg hover:border-neutral-300/80 transition-all duration-300">
        {(result.type === 'image' && result.imageUrl) && (
          <div className="relative w-full h-48 bg-neutral-100 overflow-hidden">
            <img 
              src={result.imageUrl} 
              alt={result.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
            />
            <Badge className="absolute top-2 right-2 bg-black/80 text-white text-xs">
              <ImageIcon className="w-3 h-3 mr-1" />
              Image
            </Badge>
          </div>
        )}
        
        {(result.type === 'video' && result.videoUrl) && (
          <div className="relative w-full aspect-video bg-black">
            <iframe 
              src={result.videoUrl}
              title={result.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
            <Badge className="absolute top-2 right-2 bg-red-600 text-white text-xs">
              <VideoIcon className="w-3 h-3 mr-1" />
              Video
            </Badge>
          </div>
        )}

        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 mb-2">
            {result.sourceIcon && (
              <Avatar className="h-4 w-4">
                <AvatarImage src={result.sourceIcon} alt={result.source}/>
                <AvatarFallback className="text-[8px] bg-neutral-100">
                  {result.source?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            )}
            <span className="text-xs text-neutral-500 font-medium">
              {result.source}
            </span>
            <span className="text-neutral-300">•</span>
            <span className="text-xs text-neutral-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTimeAgo(result.publishedAt || new Date().toISOString())}
            </span>
            <Badge variant="outline" className="ml-auto text-xs">
              {result.type === 'webpage' && <LinkIcon className="w-3 h-3 mr-1" />}
              {result.type === 'discussion' && <MessageSquare className="w-3 h-3 mr-1" />}
              {result.type === 'image' && <ImageIcon className="w-3 h-3 mr-1" />}
              {result.type === 'video' && <VideoIcon className="w-3 h-3 mr-1" />}
              {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
            </Badge>
          </div>
          
          <a href={result.url} target="_blank" rel="noopener noreferrer" className="group">
            <CardTitle className="text-lg font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
              {result.title}
            </CardTitle>
          </a>
        </CardHeader>

        <CardContent className="pt-0 pb-4">
          <p className="text-sm text-neutral-600 line-clamp-3 leading-relaxed mb-3">
            {result.snippet}
          </p>
          
          <div className="flex items-center justify-between">
            <a 
              href={result.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
            >
              Visit site <ExternalLink className="w-3 h-3" />
            </a>
            
            {result.type === 'discussion' && (result.likes !== undefined || result.comments !== undefined) && (
              <div className="flex items-center gap-3 text-xs text-neutral-500">
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
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-neutral-50/50 text-black">
      {/* Enhanced Search Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/70 shadow-sm">
        <div className="container mx-auto max-w-4xl px-4 py-4">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Search anything..."
                className="pl-10 pr-4 py-2.5 border-neutral-300 focus:border-black focus:ring-1 focus:ring-black rounded-lg text-sm"
              />
            </div>
            <Button type="submit" className="bg-black text-white hover:bg-neutral-800 px-6 py-2.5 rounded-lg">
              Search
            </Button>
          </form>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-6">
        {/* Results Header with Filters */}
        {!loading && results.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-semibold text-neutral-900 mb-1">
                  Search Results
                </h1>
                <p className="text-sm text-neutral-600">
                  Found {filteredResults.length} results for "<span className="font-medium">{currentQuery}</span>" (Page {currentPage})
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="px-3"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="px-3"
                >
                  <Grid className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4 text-neutral-500" />
              <div className="flex gap-1">
                {(['all', 'webpage', 'image', 'video', 'discussion'] as const).map((type) => (
                  <Button
                    key={type}
                    variant={filterType === type ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setFilterType(type)}
                    className="text-xs px-3 py-1.5 h-auto rounded-md"
                  >
                    {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                    {type !== 'all' && (
                      <Badge variant="secondary" className="ml-1.5 text-[10px] px-1">
                        {results.filter(r => r.type === type).length}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && renderSkeleton()}

        {/* Error State */}
        {!loading && error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-red-200 bg-red-50 text-red-700 p-6 text-center">
              <CardTitle className="text-lg mb-2">Something went wrong</CardTitle>
              <CardContent className="pt-0">
                <p>{error}</p>
                <Button 
                  variant="outline" 
                  className="mt-3 border-red-300 text-red-700 hover:bg-red-100"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* No Results */}
        {!loading && !error && filteredResults.length === 0 && currentQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-neutral-200 bg-white p-8 text-center">
              <CardTitle className="text-xl mb-3">No results found</CardTitle>
              <CardContent className="pt-0">
                <p className="text-neutral-600 mb-4">
                  We couldn't find anything for "<span className="font-medium">{currentQuery}</span>".
                </p>
                <p className="text-neutral-500 text-sm mb-4">
                  Try adjusting your search terms or browse our suggestions below.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setFilterType('all')}
                  className="border-neutral-300"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Results Grid/List */}
        {!loading && !error && filteredResults.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div 
              key={`${viewMode}-${filterType}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 gap-6" 
                : "space-y-6"
              }
            >
              {filteredResults.map((result, index) => renderResultCard(result, index))}
            </motion.div>
          </AnimatePresence>
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
              className="border-neutral-300 text-neutral-700 hover:bg-neutral-100"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-600">
                Page <span className="font-medium">{currentPage}</span>
              </span>
            </div>
            
            <Button
              variant="outline"
              onClick={() => handlePagination(currentPage + 1)}
              disabled={filteredResults.length < MOCK_RESULTS_PER_PAGE}
              className="border-neutral-300 text-neutral-700 hover:bg-neutral-100"
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
            className="mt-12 pt-8 border-t border-neutral-200"
          >
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Related Searches</h3>
            <div className="flex flex-wrap gap-2">
              {relatedSearches.map((relatedQuery) => (
                <Button
                  key={relatedQuery}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSearchSubmit(undefined, relatedQuery)}
                  className="text-neutral-700 bg-neutral-50 hover:bg-neutral-100 border-neutral-200 rounded-lg text-sm font-normal px-4 py-2"
                >
                  {relatedQuery}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EnhancedSearchResults; 