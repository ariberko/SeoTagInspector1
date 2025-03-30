import { useState } from 'react';
import { useSearchHistory } from '@/context/SearchHistoryContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  HistoryIcon, 
  ClockIcon, 
  TrashIcon, 
  ChevronDownIcon, 
  ChevronUpIcon,
  BarChart3Icon
} from 'lucide-react';
import { format } from 'date-fns';
import { ScoreBadge } from '@/components/ui/score-badge';

interface SearchHistoryProps {
  onSelectUrl: (url: string) => void;
}

export default function SearchHistory({ onSelectUrl }: SearchHistoryProps) {
  const { searchHistory, clearHistory } = useSearchHistory();
  const [isOpen, setIsOpen] = useState(false);

  if (searchHistory.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 w-full">
      <Button 
        variant="outline" 
        className="w-full flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <HistoryIcon className="mr-2 h-4 w-4" />
          <span>Search History</span>
        </div>
        {isOpen ? (
          <ChevronUpIcon className="h-4 w-4" />
        ) : (
          <ChevronDownIcon className="h-4 w-4" />
        )}
      </Button>
      
      {isOpen && (
        <Card className="mt-2 w-full border border-border">
          <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Recent Searches</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearHistory}
              className="h-8 px-2 text-muted-foreground hover:text-destructive"
            >
              <TrashIcon className="h-4 w-4 mr-1" />
              <span className="text-xs">Clear</span>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[200px] w-full">
              <ul className="divide-y divide-border">
                {searchHistory.map((item, index) => (
                  <li key={index} className="p-3 hover:bg-accent/50 transition-colors">
                    <button 
                      className="w-full text-left flex flex-col space-y-1"
                      onClick={() => onSelectUrl(item.url)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium truncate max-w-[70%]">
                          {item.title || item.url}
                        </span>
                        {item.score !== undefined && (
                          <ScoreBadge score={item.score} className="h-6 w-6 text-xs" />
                        )}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span className="truncate max-w-[90%]">{item.url}</span>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        <span>{format(item.timestamp, 'MMM d, yyyy h:mm a')}</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}