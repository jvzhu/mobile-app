import { configureStore } from '@reduxjs/toolkit';
import taskReducer, {
  fetchTasksThunk,
  createTaskThunk,
  updateTaskThunk,
  deleteTaskThunk,
  setFilters,
  clearTasks,
} from '@store/slices/taskSlice';
import type { TaskState } from '@app-types/task';

jest.mock('@services/task.service', () => ({
  taskService: {
    getTasks: jest.fn(),
    getTask: jest.fn(),
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
    searchTasks: jest.fn(),
  },
}));

const { taskService } = require('@services/task.service');

const createTestStore = () => configureStore({ reducer: { tasks: taskReducer } });

const mockTask = {
  id: 'task-1',
  title: 'Test Task',
  description: 'Test description',
  status: 'todo' as const,
  priority: 'medium' as const,
  category: 'work' as const,
  tags: [],
  attachments: [],
  subtasks: [],
  createdBy: 'user-1',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const mockPaginatedResponse = {
  data: [mockTask],
  pagination: {
    page: 1,
    limit: 20,
    total: 1,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  },
  message: 'Success',
  success: true,
};

describe('taskSlice', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
    jest.clearAllMocks();
  });

  it('should have correct initial state', () => {
    const state = store.getState().tasks as TaskState;
    expect(state.tasks).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.selectedTask).toBeNull();
  });

  it('should fetch tasks successfully', async () => {
    taskService.getTasks.mockResolvedValue(mockPaginatedResponse);
    await store.dispatch(fetchTasksThunk({ page: 1 }));
    const state = store.getState().tasks as TaskState;
    expect(state.tasks).toHaveLength(1);
    expect(state.tasks[0].id).toBe('task-1');
    expect(state.isLoading).toBe(false);
  });

  it('should set error when fetch fails', async () => {
    taskService.getTasks.mockRejectedValue(new Error('Network error'));
    await store.dispatch(fetchTasksThunk(undefined));
    const state = store.getState().tasks as TaskState;
    expect(state.error).toBe('Network error');
    expect(state.tasks).toHaveLength(0);
  });

  it('should create task and add to list', async () => {
    taskService.createTask.mockResolvedValue(mockTask);
    await store.dispatch(
      createTaskThunk({ title: 'Test Task', priority: 'medium', category: 'work' })
    );
    const state = store.getState().tasks as TaskState;
    expect(state.tasks).toHaveLength(1);
    expect(state.tasks[0]).toEqual(mockTask);
  });

  it('should update task in list', async () => {
    taskService.getTasks.mockResolvedValue(mockPaginatedResponse);
    await store.dispatch(fetchTasksThunk({ page: 1 }));

    const updatedTask = { ...mockTask, title: 'Updated Task' };
    taskService.updateTask.mockResolvedValue(updatedTask);
    await store.dispatch(updateTaskThunk({ id: 'task-1', data: { title: 'Updated Task' } }));

    const state = store.getState().tasks as TaskState;
    expect(state.tasks[0].title).toBe('Updated Task');
  });

  it('should remove task on delete', async () => {
    taskService.getTasks.mockResolvedValue(mockPaginatedResponse);
    await store.dispatch(fetchTasksThunk({ page: 1 }));
    taskService.deleteTask.mockResolvedValue(undefined);
    await store.dispatch(deleteTaskThunk('task-1'));
    const state = store.getState().tasks as TaskState;
    expect(state.tasks).toHaveLength(0);
  });

  it('should set filters', () => {
    store.dispatch(setFilters({ status: 'done', priority: 'high' }));
    const state = store.getState().tasks as TaskState;
    expect(state.filters.status).toBe('done');
    expect(state.filters.priority).toBe('high');
  });

  it('should clear tasks', async () => {
    taskService.getTasks.mockResolvedValue(mockPaginatedResponse);
    await store.dispatch(fetchTasksThunk({ page: 1 }));
    store.dispatch(clearTasks());
    const state = store.getState().tasks as TaskState;
    expect(state.tasks).toHaveLength(0);
  });
});
