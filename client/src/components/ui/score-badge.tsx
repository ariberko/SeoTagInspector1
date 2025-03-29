import { cn } from "@/lib/utils";

type ScoreStatus = 'good' | 'warning' | 'error';

interface ScoreBadgeProps {
  score: number;
  className?: string;
}

export function ScoreBadge({ score, className }: ScoreBadgeProps) {
  let status: ScoreStatus = 'error';
  let bgColor: string = 'bg-error';
  let textColor: string = 'text-white';
  let label: string = 'Poor';
  
  if (score >= 80) {
    status = 'good';
    bgColor = 'bg-success';
    label = 'Good';
  } else if (score >= 50) {
    status = 'warning';
    bgColor = 'bg-warning';
    label = 'Needs Improvement';
  }

  return (
    <div className={cn("flex items-center bg-gray-100 rounded-full px-4 py-1", className)}>
      <div className="mr-2">
        <div className={cn("h-8 w-8 rounded-full flex items-center justify-center", bgColor)}>
          <span className="text-white font-medium text-sm">{score}</span>
        </div>
      </div>
      <div>
        <div className="text-xs text-gray-500">SEO Score</div>
        <div className="text-sm font-medium">{label}</div>
      </div>
    </div>
  );
}

interface StatusBadgeProps {
  status: ScoreStatus;
  children: React.ReactNode;
  className?: string;
}

export function StatusBadge({ status, children, className }: StatusBadgeProps) {
  let bgColor = 'bg-green-100 text-green-800';
  
  if (status === 'warning') {
    bgColor = 'bg-yellow-100 text-yellow-800';
  } else if (status === 'error') {
    bgColor = 'bg-red-100 text-red-800';
  }
  
  return (
    <span className={cn("px-2 py-1 text-xs rounded-full", bgColor, className)}>
      {children}
    </span>
  );
}

interface ProgressBarProps {
  percentage: number;
  status?: ScoreStatus;
  className?: string;
}

export function ProgressBar({ percentage, status = 'good', className }: ProgressBarProps) {
  let barColor = 'bg-success';
  
  if (status === 'warning') {
    barColor = 'bg-warning';
  } else if (status === 'error') {
    barColor = 'bg-error';
  }
  
  // Ensure percentage is between 0 and 100
  const safePercentage = Math.max(0, Math.min(100, percentage));
  
  return (
    <div className={cn("w-full bg-gray-200 rounded-full h-1.5", className)}>
      <div 
        className={cn("rounded-full h-1.5", barColor)} 
        style={{ width: `${safePercentage}%` }}
      />
    </div>
  );
}
