import { Document } from "@langchain/core/documents";
import { Fragment, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ExternalLink, MoreHorizontal } from "lucide-react";

const MessageSources = ({ sources }: { sources: Document[] }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {sources.slice(0, 3).map((source, i) => (
        <Card key={i} className="group hover:shadow-lg transition-all duration-200 border-border bg-card hover:border-primary/30">
          <CardContent className="p-3">
            <a
              href={source.metadata.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col space-y-2 text-decoration-none"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  <Avatar className="h-4 w-4 flex-shrink-0">
                    <AvatarImage 
                      src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${source.metadata.url}`} 
                      alt="favicon"
                    />
                    <AvatarFallback className="text-[6px] bg-muted text-muted-foreground">
                      {source.metadata.url.replace(/.+\/\/|www.|\..+/g, "").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground font-medium truncate">
                    {source.metadata.url.replace(/.+\/\/|www.|\..+/g, "")}
                  </span>
                </div>
                <Badge variant="secondary" className="ml-1 text-xs h-5 bg-primary/10 text-primary border-0">
                  {i + 1}
                </Badge>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-xs font-medium text-card-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                  {source.metadata.title}
                </h4>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center hover:text-primary transition-colors">
                    <ExternalLink className="w-2.5 h-2.5 mr-1" />
                    Visit
                  </span>
                </div>
              </div>
            </a>
          </CardContent>
        </Card>
      ))}
      
      {sources.length > 3 && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Card className="group hover:shadow-lg transition-all duration-200 border-border bg-accent/30 hover:bg-accent/50 cursor-pointer">
              <CardContent className="p-3 flex flex-col justify-center items-center space-y-2 h-full">
                <div className="flex items-center space-x-1">
                  {sources.slice(3, 6).map((source, i) => (
                    <Avatar key={i} className="h-3 w-3">
                      <AvatarImage 
                        src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${source.metadata.url}`} 
                        alt="favicon"
                      />
                      <AvatarFallback className="text-[5px] bg-muted text-muted-foreground">
                        {source.metadata.url.replace(/.+\/\/|www.|\..+/g, "").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {sources.length > 6 && (
                    <MoreHorizontal className="w-3 h-3 text-muted-foreground" />
                  )}
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    +{sources.length - 3} more
                  </p>
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-foreground">
                All Sources ({sources.length})
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-auto max-h-[500px] pr-2">
              {sources.map((source, i) => (
                <Card key={i} className="group hover:shadow-lg transition-all duration-200 border-border bg-card hover:border-primary/30">
                  <CardContent className="p-3">
                    <a
                      href={source.metadata.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col space-y-2 text-decoration-none"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2 min-w-0 flex-1">
                          <Avatar className="h-4 w-4 flex-shrink-0">
                            <AvatarImage 
                              src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${source.metadata.url}`} 
                              alt="favicon"
                            />
                            <AvatarFallback className="text-[6px] bg-muted text-muted-foreground">
                              {source.metadata.url.replace(/.+\/\/|www.|\..+/g, "").charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground font-medium truncate">
                            {source.metadata.url.replace(/.+\/\/|www.|\..+/g, "")}
                          </span>
                        </div>
                        <Badge variant="secondary" className="ml-2 text-xs h-5 bg-primary/10 text-primary border-0">
                          {i + 1}
                        </Badge>
                      </div>
                      
                      <h4 className="text-sm font-medium text-card-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                        {source.metadata.title}
                      </h4>
                      
                      <div className="flex items-center">
                        <span className="text-xs text-muted-foreground flex items-center hover:text-primary transition-colors">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Visit source
                        </span>
                      </div>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MessageSources;
