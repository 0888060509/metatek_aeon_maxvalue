'use client';

import { useState, useEffect } from 'react';
import { 
  useGetTaskItems, 
  useCreateTaskItem, 
  useUpdateTaskItem,
  useSubmitTaskItem,
  useApproveTaskItem,
  useDenyTaskItem,
  TASK_STATES,
  TASK_PRIORITIES,
  getPriorityLabel,
  getStateLabel,
  getStateColor,
  formatDateTime,
  canSubmitTask,
  canApproveTask,
  canDenyTask
} from '@/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export function TaskItemExample() {
  const { toast } = useToast();
  const { data: tasks, loading, error, execute: fetchTasks } = useGetTaskItems();
  const { execute: createTask } = useCreateTaskItem();
  const { execute: submitTask } = useSubmitTaskItem();
  const { execute: approveTask } = useApproveTaskItem();
  const { execute: denyTask } = useDenyTaskItem();

  useEffect(() => {
    fetchTasks({
      status: "1", // Only show active (non-deleted) tasks
      page: 1,
      size: 10
    });
  }, [fetchTasks]);

  const handleCreateTask = async () => {
    try {
      await createTask({
        name: 'Test Task',
        description: 'This is a test task',
        assigneeId: 'some-uuid', // Replace with actual assignee ID
        priority: TASK_PRIORITIES.MEDIUM,
        startAt: Math.floor(Date.now() / 1000),
        endAt: Math.floor(Date.now() / 1000) + 86400 * 7, // 7 days from now
        listGoal: [
          {
            type: 1, // IMAGE_UPLOAD
            detail: 'Upload completion photo',
            point: 10
          }
        ]
      });
      
      toast({
        title: 'Thành công',
        description: 'Tạo task mới thành công!'
      });
      
      // Refresh list
      fetchTasks({ page: 1, size: 10 });
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tạo task mới',
        variant: 'destructive'
      });
    }
  };

  const handleTaskAction = async (taskId: string, action: 'submit' | 'approve' | 'deny') => {
    try {
      switch (action) {
        case 'submit':
          await submitTask(taskId);
          break;
        case 'approve':
          await approveTask(taskId);
          break;
        case 'deny':
          await denyTask(taskId);
          break;
      }
      
      toast({
        title: 'Thành công',
        description: `${action === 'submit' ? 'Đăng' : action === 'approve' ? 'Duyệt' : 'Từ chối'} task thành công!`
      });
      
      // Refresh list
      fetchTasks({ page: 1, size: 10 });
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể thực hiện hành động',
        variant: 'destructive'
      });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Task Management</h2>
        <Button onClick={handleCreateTask}>
          Tạo Task Mới
        </Button>
      </div>

      <div className="grid gap-4">
        {tasks?.map((task) => (
          <Card key={task.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span>{task.name}</span>
                <Badge variant={getStateColor(task.state) as any}>
                  {getStateLabel(task.state)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{task.description}</p>
                
                <div className="flex gap-4 text-sm">
                  <span>Ưu tiên: <Badge variant="outline">{getPriorityLabel(task.priority)}</Badge></span>
                  <span>Người nhận: {task.assigneeName || 'Chưa xác định'}</span>
                </div>

                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>Bắt đầu: {formatDateTime(task.startAt)}</span>
                  <span>Kết thúc: {formatDateTime(task.endAt)}</span>
                </div>

                <div className="flex gap-2 pt-2">
                  {canSubmitTask(task.state) && (
                    <Button 
                      size="sm" 
                      onClick={() => handleTaskAction(task.id, 'submit')}
                    >
                      Đăng Task
                    </Button>
                  )}
                  
                  {canApproveTask(task.state) && (
                    <Button 
                      size="sm" 
                      variant="default"
                      onClick={() => handleTaskAction(task.id, 'approve')}
                    >
                      Duyệt
                    </Button>
                  )}
                  
                  {canDenyTask(task.state) && (
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleTaskAction(task.id, 'deny')}
                    >
                      Từ chối
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!tasks || tasks.length === 0) && (
        <div className="text-center py-8 text-muted-foreground">
          Chưa có task nào
        </div>
      )}
    </div>
  );
}