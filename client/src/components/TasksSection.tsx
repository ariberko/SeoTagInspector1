import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSEOTasks } from '@/hooks/useSEOHistory';
import { 
  CheckCircleIcon, 
  ClipboardListIcon, 
  PlusIcon, 
  AlertTriangleIcon,
  CheckIcon,
  TimerIcon,
  XIcon,
  InfoIcon
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from './ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { SEOMetaTag } from '@shared/schema';

interface TasksSectionProps {
  url: string;
  seoData: SEOMetaTag;
}

export default function TasksSection({ url, seoData }: TasksSectionProps) {
  const { tasks, createTask } = useSEOTasks(url);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleCreateTask = async () => {
    try {
      await createTask.mutateAsync({
        url,
        title: taskTitle,
        description: taskDescription,
        priority: taskPriority,
        status: 'todo'
      });
      
      setIsDialogOpen(false);
      setTaskTitle('');
      setTaskDescription('');
      setTaskPriority('medium');
      
      toast({
        title: "Task Created",
        description: "Your SEO task was created successfully",
      });
    } catch (error) {
      toast({
        title: "Error Creating Task",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreateFromRecommendation = (rec: { title: string, description: string, type: string }) => {
    setTaskTitle(rec.title);
    setTaskDescription(rec.description);
    setTaskPriority(rec.type === 'error' ? 'high' : rec.type === 'warning' ? 'medium' : 'low');
    setIsDialogOpen(true);
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="capitalize">High</Badge>;
      case 'medium':
        return <Badge variant="default" className="bg-warning text-white capitalize">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="capitalize">Low</Badge>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'done':
        return (
          <Badge variant="default" className="bg-success text-white capitalize">
            <CheckIcon className="mr-1 h-3 w-3" /> Done
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge variant="default" className="bg-blue-500 text-white capitalize">
            <TimerIcon className="mr-1 h-3 w-3" /> In Progress
          </Badge>
        );
      case 'todo':
      default:
        return (
          <Badge variant="secondary" className="capitalize">
            Todo
          </Badge>
        );
    }
  };

  if (tasks.isLoading) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ClipboardListIcon className="mr-2 h-5 w-5 text-primary" />
            SEO Tasks
          </CardTitle>
          <CardDescription>Loading tasks...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (tasks.error) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ClipboardListIcon className="mr-2 h-5 w-5 text-primary" />
            SEO Tasks
          </CardTitle>
          <CardDescription>Error loading tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <InfoIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Failed to load task data</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>Please try refreshing the page.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <ClipboardListIcon className="mr-2 h-5 w-5 text-primary" />
              SEO Tasks
            </CardTitle>
            <CardDescription>Track and manage your SEO improvement tasks</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New SEO Task</DialogTitle>
                <DialogDescription>
                  Add a task to improve your website's SEO performance
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="task-title">Task Title</Label>
                  <Input 
                    id="task-title" 
                    value={taskTitle} 
                    onChange={(e) => setTaskTitle(e.target.value)} 
                    placeholder="e.g., Add meta description"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="task-description">Description</Label>
                  <Textarea 
                    id="task-description" 
                    value={taskDescription} 
                    onChange={(e) => setTaskDescription(e.target.value)} 
                    placeholder="Detail what needs to be done"
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="task-priority">Priority</Label>
                  <Select 
                    value={taskPriority} 
                    onValueChange={(value: 'low' | 'medium' | 'high') => setTaskPriority(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button 
                  onClick={handleCreateTask} 
                  disabled={!taskTitle || !taskDescription || createTask.isPending}
                >
                  {createTask.isPending ? "Creating..." : "Create Task"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {(!tasks.data || tasks.data.length === 0) ? (
          <div className="rounded-md border p-6 text-center">
            <ClipboardListIcon className="mx-auto h-10 w-10 text-muted-foreground/60" />
            <h3 className="mt-2 text-sm font-medium">No tasks yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Get started by creating a task or adding one from recommendations
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <div className="divide-y">
              {tasks.data.map((task) => (
                <div key={task.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-medium">{task.title}</h4>
                      <p className="mt-1 text-xs text-muted-foreground">{task.description}</p>
                      <div className="mt-2 flex gap-2">
                        {getPriorityBadge(task.priority)}
                        {getStatusBadge(task.status)}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      {seoData.recommendations && seoData.recommendations.length > 0 && (
        <CardFooter className="flex flex-col border-t px-6 py-4">
          <h4 className="mb-3 text-sm font-medium">Recommended Tasks</h4>
          <div className="space-y-2 w-full">
            {seoData.recommendations.map((rec, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-start space-x-3">
                  {rec.type === 'error' ? (
                    <XIcon className="mt-0.5 h-5 w-5 text-error" />
                  ) : rec.type === 'warning' ? (
                    <AlertTriangleIcon className="mt-0.5 h-5 w-5 text-warning" />
                  ) : (
                    <InfoIcon className="mt-0.5 h-5 w-5 text-primary" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{rec.title}</p>
                    <p className="text-xs text-muted-foreground">{rec.description}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleCreateFromRecommendation(rec)}
                >
                  <PlusIcon className="mr-1 h-3 w-3" />
                  Add Task
                </Button>
              </div>
            ))}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}