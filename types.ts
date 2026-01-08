
export interface User {
  email: string;
}

export type Priority = 'low' | 'medium' | 'high';
export type TodoStatus = 'pending' | 'done';

export interface Todo {
  _id: string;
  title: string;
  status: TodoStatus;
  priority: Priority;
  createdAt: string;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
}
