import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { taskService } from '@services/task.service';
import type { Task, TaskState, TaskFilters, CreateTaskData, UpdateTaskData } from '@app-types/task';

const initialState: TaskState = {
  tasks: [],
  selectedTask: null,
  isLoading: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    hasMore: false,
  },
};

export const fetchTasksThunk = createAsyncThunk(
  'tasks/fetchAll',
  async (params: TaskFilters & { page?: number } | undefined, { rejectWithValue }) => {
    try {
      return await taskService.getTasks(params);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch tasks');
    }
  }
);

export const fetchTaskThunk = createAsyncThunk(
  'tasks/fetchOne',
  async (id: string, { rejectWithValue }) => {
    try {
      return await taskService.getTask(id);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch task');
    }
  }
);

export const createTaskThunk = createAsyncThunk(
  'tasks/create',
  async (data: CreateTaskData, { rejectWithValue }) => {
    try {
      return await taskService.createTask(data);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create task');
    }
  }
);

export const updateTaskThunk = createAsyncThunk(
  'tasks/update',
  async ({ id, data }: { id: string; data: UpdateTaskData }, { rejectWithValue }) => {
    try {
      return await taskService.updateTask(id, data);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update task');
    }
  }
);

export const deleteTaskThunk = createAsyncThunk(
  'tasks/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await taskService.deleteTask(id);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete task');
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setSelectedTask(state, action: PayloadAction<Task | null>) {
      state.selectedTask = action.payload;
    },
    setFilters(state, action: PayloadAction<TaskFilters>) {
      state.filters = action.payload;
      state.pagination.page = 1;
    },
    clearError(state) {
      state.error = null;
    },
    clearTasks(state) {
      state.tasks = [];
      state.pagination = initialState.pagination;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTasksThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasksThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const { data, pagination } = action.payload;
        if (pagination.page === 1) {
          state.tasks = data;
        } else {
          state.tasks = [...state.tasks, ...data];
        }
        state.pagination = {
          page: pagination.page,
          limit: pagination.limit,
          total: pagination.total,
          hasMore: pagination.hasNext,
        };
      })
      .addCase(fetchTasksThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchTaskThunk.fulfilled, (state, action) => {
        state.selectedTask = action.payload;
      });

    builder
      .addCase(createTaskThunk.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload);
        state.pagination.total += 1;
      });

    builder
      .addCase(updateTaskThunk.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        if (state.selectedTask?.id === action.payload.id) {
          state.selectedTask = action.payload;
        }
      });

    builder
      .addCase(deleteTaskThunk.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(t => t.id !== action.payload);
        state.pagination.total -= 1;
        if (state.selectedTask?.id === action.payload) {
          state.selectedTask = null;
        }
      });
  },
});

export const { setSelectedTask, setFilters, clearError, clearTasks } = taskSlice.actions;
export default taskSlice.reducer;
