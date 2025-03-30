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
    <div className={cn("flex items-center bg-gray-50 rounded-lg px-4 py-1", className)}>
      <div className="mr-2">
        <div className={cn("h-9 w-9 rounded-full flex items-center justify-center shadow-sm", bgColor)}>
          <span className="text-white font-bold text-sm">{score}</span>
        </div>
      </div>
      <div>
        <div className="text-xs text-gray-500 uppercase tracking-wide">SEO Score</div>
        <div className="text-sm font-semibold">{label}</div>
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
  const bgColorMap = {
    good: 'bg-success-light text-success border border-success border-opacity-30',
    warning: 'bg-warning-light text-warning border border-warning border-opacity-30',
    error: 'bg-error-light text-error border border-error border-opacity-30'
  };
  
  return (
    <span className={cn("px-2 py-1 text-xs rounded-full font-medium", bgColorMap[status], className)}>
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
    <div className={cn("w-full bg-gray-200 rounded-full h-2 overflow-hidden", className)}>
      <div 
        className={cn("rounded-full h-2 transition-all duration-500", barColor)} 
        style={{ width: `${safePercentage}%` }}
      />
    </div>
  );
}
