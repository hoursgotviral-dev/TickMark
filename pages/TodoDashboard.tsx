
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Todo, Priority } from '../types';

const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => {
  const styles = {
    low: 'bg-[#0F172A] text-blue-400 border border-blue-900/50',
    medium: 'bg-[#1C1917] text-[#D4AF37] border border-[#D4AF37]/30',
    high: 'bg-[#1C1111] text-rose-400 border border-rose-900/50',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-[0.15em] ${styles[priority]}`}>
      {priority}
    </span>
  );
};

const TodoDashboard: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [animatingId, setAnimatingId] = useState<string | null>(null);

  const fetchTodos = async () => {
    try {
      const res = await api.get('/todos');
      setTodos(res.data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchTodos(); }, []);

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const res = await api.post('/todos', { title, priority });
      setTodos([res.data, ...todos]);
      setTitle('');
    } catch (e) { console.error(e); }
  };

  const toggleTodo = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'pending' ? 'done' : 'pending';
    if (newStatus === 'done') {
      setAnimatingId(id);
      setTimeout(() => setAnimatingId(null), 600);
    }
    try {
      const res = await api.patch(`/todos/${id}`, { status: newStatus });
      setTodos(todos.map(t => t._id === id ? res.data : t));
    } catch (e) { console.error(e); }
  };

  const deleteTodo = async (id: string) => {
    try {
      await api.delete(`/todos/${id}`);
      setTodos(todos.filter(t => t._id !== id));
    } catch (e) { console.error(e); }
  };

  const filteredTodos = todos.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));
  const pending = filteredTodos.filter(t => t.status === 'pending');
  const done = filteredTodos.filter(t => t.status === 'done');

  const TodoCard = ({ todo }: { todo: Todo }) => (
    <div className={`bg-[#121212] p-5 rounded-2xl border border-[#2A2112] shadow-lg group hover:border-[#D4AF37]/50 transition-all card-enter ${animatingId === todo._id ? 'animate-success-pop' : ''}`}>
      <div className="flex justify-between items-start mb-3">
        <PriorityBadge priority={todo.priority} />
        <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{new Date(todo.createdAt).toLocaleDateString()}</span>
      </div>
      <h3 className={`text-slate-100 font-semibold text-lg mb-6 leading-tight transition-all duration-500 ${todo.status === 'done' ? 'line-through text-slate-600 grayscale' : ''}`}>
        {todo.title}
      </h3>
      <div className="flex space-x-3">
        <button 
          onClick={() => toggleTodo(todo._id, todo.status)}
          className={`flex-1 text-[10px] font-black uppercase tracking-widest py-2.5 rounded-xl border transition-all ${todo.status === 'done' ? 'bg-[#1A1A1A] border-[#2A2A2A] text-slate-500 hover:text-[#D4AF37]' : 'bg-[#D4AF37]/5 border-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]'}`}
        >
          {todo.status === 'pending' ? 'Mark Complete' : 'Restore'}
        </button>
        <button 
          onClick={() => deleteTodo(todo._id)}
          className="px-4 text-[10px] font-black uppercase tracking-widest py-2.5 rounded-xl border border-rose-900/30 text-rose-500 hover:bg-rose-600 hover:text-white transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 reveal-content">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h2 className="text-3xl font-black text-white tracking-tighter">SUPER JIRA</h2>
            <div className="px-2 py-0.5 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded text-[9px] text-[#D4AF37] font-bold animate-pulse">PRO VERSION</div>
          </div>
          <p className="text-slate-500 text-sm font-medium">Precision task tracking for premium workflows.</p>
        </div>
        <div className="relative group">
          <input 
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 px-5 py-3 bg-[#0D0D0D] border border-[#2A2112] rounded-2xl outline-none focus:ring-2 focus:ring-[#D4AF37]/30 text-white placeholder:text-slate-700 transition-all focus:bg-[#121212]"
          />
        </div>
      </header>

      <form onSubmit={addTodo} className="bg-[#121212] p-6 rounded-3xl shadow-2xl border border-[#2A2112] flex flex-wrap gap-4 items-center mb-16 backdrop-blur-xl bg-opacity-80">
        <input 
          type="text"
          placeholder="What is your next objective?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 min-w-[200px] px-6 py-4 bg-[#0A0A0A] border border-[#2A2112] rounded-2xl outline-none focus:border-[#D4AF37] text-white placeholder:text-slate-800 transition-colors"
        />
        <select 
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="px-6 py-4 bg-[#0A0A0A] border border-[#2A2112] rounded-2xl outline-none focus:border-[#D4AF37] text-slate-400 font-bold text-sm uppercase tracking-widest cursor-pointer appearance-none"
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        <button type="submit" className="bg-[#D4AF37] text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-[#F3E5AB] transition-all shadow-xl shadow-[#D4AF37]/10 active:scale-95 hover:-translate-y-1">
          Add Objective
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="flex items-center space-x-3 pb-3 border-b border-[#2A2112]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping"></div>
            <h3 className="font-black text-[#D4AF37] uppercase tracking-[0.2em] text-[11px]">Active Sprints</h3>
            <span className="bg-[#2A2112] text-slate-400 px-2 py-0.5 rounded-md text-[9px] font-bold">{pending.length}</span>
          </div>
          <div className="grid gap-5">
            {pending.map(todo => <TodoCard key={todo._id} todo={todo} />)}
            {!loading && pending.length === 0 && (
              <div className="py-20 text-center border-2 border-dashed border-[#1A1A1A] rounded-[2rem] bg-[#0A0A0A]">
                <p className="text-slate-700 text-sm font-bold uppercase tracking-widest italic">All systems clear.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center space-x-3 pb-3 border-b border-[#2A2112]">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-50"></div>
            <h3 className="font-black text-slate-500 uppercase tracking-[0.2em] text-[11px]">Completed</h3>
            <span className="bg-[#0A2A1A] text-emerald-500/70 px-2 py-0.5 rounded-md text-[9px] font-bold">{done.length}</span>
          </div>
          <div className="grid gap-5 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
            {done.map(todo => <TodoCard key={todo._id} todo={todo} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoDashboard;
