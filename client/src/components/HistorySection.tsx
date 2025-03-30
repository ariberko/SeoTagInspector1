import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSEOHistory } from '@/hooks/useSEOHistory';
import { ScoreBadge } from './ui/score-badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';
import { Skeleton } from './ui/skeleton';
import { HistoryIcon, TrendingUpIcon, InfoIcon } from 'lucide-react';

interface HistorySectionProps {
  url: string;
}

export default function HistorySection({ url }: HistorySectionProps) {
  const { data: history, isLoading, error } = useSEOHistory(url);

  if (isLoading) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <HistoryIcon className="mr-2 h-5 w-5 text-primary" />
            SEO History
          </CardTitle>
          <CardDescription>Loading history data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-[200px] w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <HistoryIcon className="mr-2 h-5 w-5 text-primary" />
            SEO History
          </CardTitle>
          <CardDescription>Error loading history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <InfoIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Failed to load history data</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>Please try refreshing the page or analyzing the URL again.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort history by timestamp (newest first)
  const sortedHistory = [...(history || [])].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Prepare data for chart (oldest first for proper visualization)
  const chartData = [...sortedHistory]
    .reverse()
    .map(item => ({
      date: format(new Date(item.timestamp), 'MM/dd/yy'),
      score: item.score,
      fullDate: item.timestamp,
    }));

  const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-md border bg-background p-2 shadow-sm">
          <p className="font-medium">{format(new Date(data.fullDate), 'MMM dd, yyyy')}</p>
          <p className="text-sm text-muted-foreground">
            Score: <span className="font-medium text-primary">{data.score}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <HistoryIcon className="mr-2 h-5 w-5 text-primary" />
          SEO History
        </CardTitle>
        <CardDescription>Track improvements in your SEO performance over time</CardDescription>
      </CardHeader>
      <CardContent>
        {sortedHistory.length === 0 ? (
          <div className="rounded-md bg-primary-foreground p-4 text-center">
            <p className="text-sm text-muted-foreground">No history data available yet. Analyze this URL multiple times to track changes.</p>
          </div>
        ) : (
          <Tabs defaultValue="chart">
            <TabsList className="mb-4">
              <TabsTrigger value="chart">
                <TrendingUpIcon className="mr-2 h-4 w-4" />
                Chart
              </TabsTrigger>
              <TabsTrigger value="list">
                <HistoryIcon className="mr-2 h-4 w-4" />
                History List
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="chart">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{
                      top: 5,
                      right: 20,
                      left: 0,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }} 
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      tick={{ fontSize: 12 }}
                      label={{ 
                        value: 'Score', 
                        angle: -90, 
                        position: 'insideLeft',
                        style: { textAnchor: 'middle' }
                      }} 
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="hsl(var(--primary))" 
                      activeDot={{ r: 8 }} 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="list">
              <div className="max-h-[400px] overflow-auto rounded-md border">
                <table className="w-full">
                  <thead className="sticky top-0 bg-muted/50 backdrop-blur-sm">
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Score</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedHistory.map((item, index) => (
                      <tr key={item.id} className={index !== sortedHistory.length - 1 ? "border-b" : ""}>
                        <td className="px-4 py-3 text-sm">
                          {format(new Date(item.timestamp), 'MMM dd, yyyy hh:mm a')}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <ScoreBadge score={item.score} />
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {index > 0 && (
                            <div className="text-xs text-muted-foreground">
                              {item.score > sortedHistory[index - 1].score ? (
                                <span className="text-success">+{(item.score - sortedHistory[index - 1].score).toFixed(1)} improvement</span>
                              ) : item.score < sortedHistory[index - 1].score ? (
                                <span className="text-error">-{(sortedHistory[index - 1].score - item.score).toFixed(1)} decrease</span>
                              ) : (
                                <span>No change</span>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}