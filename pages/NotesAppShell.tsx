
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Note } from '../types';

const NotesAppShell: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async (q = '', tag = '') => {
    try {
      const res = await api.get('/notes', { params: { q, tag } });
      setNotes(res.data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => {
    const timer = setTimeout(() => { fetchNotes(search, selectedTag || ''); }, 300);
    return () => clearTimeout(timer);
  }, [search, selectedTag]);

  const addNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t !== '');
    try {
      const res = await api.post('/notes', { title, content, tags });
      setNotes([res.data, ...notes]);
      setTitle(''); setContent(''); setTagsInput('');
    } catch (e) { console.error(e); }
  };

  const deleteNote = async (id: string) => {
    try {
      await api.delete(`/notes/${id}`);
      setNotes(notes.filter(n => n._id !== id));
    } catch (e) { console.error(e); }
  };

  const allTags = Array.from(new Set(notes.flatMap(n => n.tags)));

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-[#000] reveal-content">
      <aside className="w-72 border-r border-[#2A2112] bg-[#050505] p-8 overflow-y-auto hidden md:block">
        <div className="mb-10 flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></div>
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em]">Repository</h3>
        </div>
        
        <div className="space-y-2 mb-12">
          <button 
            onClick={() => setSelectedTag(null)}
            className={`w-full text-left px-4 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border ${selectedTag === null ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/40 shadow-[0_0_15px_rgba(212,175,55,0.1)]' : 'text-slate-600 border-transparent hover:text-slate-300 hover:bg-[#111]'}`}
          >
            Universal Feed
          </button>
        </div>

        <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.25em] mb-6 px-4">Taxonomy</h3>
        <div className="space-y-1.5">
          {allTags.map(tag => (
            <button 
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-[11px] font-bold transition-all border ${selectedTag === tag ? 'bg-[#D4AF37]/5 text-[#D4AF37] border-[#D4AF37]/20' : 'text-slate-500 border-transparent hover:text-slate-200 hover:bg-[#111]'}`}
            >
              <span className="opacity-40 mr-1">#</span>{tag}
            </button>
          ))}
          {allTags.length === 0 && <p className="text-slate-800 text-[10px] font-bold uppercase tracking-widest italic px-4">No categories</p>}
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 md:p-12 bg-[#000]">
        <div className="max-w-5xl mx-auto">
          <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8">
            <div>
               <h2 className="text-4xl font-black text-white tracking-tighter mb-1">ARCHIVE</h2>
               <p className="text-slate-600 text-sm">Knowledge base synchronization active.</p>
            </div>
            <div className="relative w-full md:w-96 group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-700 group-focus-within:text-[#D4AF37] transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input 
                type="text"
                placeholder="Query database..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-[#0D0D0D] border border-[#2A2112] rounded-3xl outline-none focus:ring-2 focus:ring-[#D4AF37]/20 shadow-2xl text-white placeholder:text-slate-800 transition-all"
              />
            </div>
          </header>

          <form onSubmit={addNote} className="bg-[#121212] rounded-[2.5rem] shadow-2xl border border-[#2A2112] p-10 mb-20 group hover:border-[#D4AF37]/30 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            
            <input 
              type="text"
              placeholder="Insight Designation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-2xl font-black mb-6 bg-transparent outline-none placeholder:text-slate-800 text-white tracking-tight"
            />
            <textarea 
              placeholder="Transcribe findings..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-44 resize-none bg-transparent text-slate-400 outline-none placeholder:text-slate-800 mb-8 leading-relaxed text-lg"
            />
            <div className="flex flex-col md:flex-row gap-6 items-center border-t border-[#2A2112]/50 pt-8">
              <div className="flex-1 relative w-full">
                <input 
                  type="text"
                  placeholder="Classification Tags (comma separated)"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full text-xs font-bold bg-[#0A0A0A] border border-[#2A2112] px-6 py-4 rounded-2xl outline-none focus:border-[#D4AF37] text-slate-300 placeholder:text-slate-800"
                />
              </div>
              <button 
                type="submit"
                className="w-full md:w-auto bg-[#D4AF37] text-black px-12 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-[#F3E5AB] transition-all shadow-xl shadow-[#D4AF37]/20 active:scale-95 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
              >
                Sync Data
              </button>
            </div>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 pb-20">
            {notes.map(note => (
              <div key={note._id} className="bg-[#0D0D0D] p-10 rounded-[2.5rem] border border-[#2A2112] shadow-xl hover:border-[#D4AF37]/50 hover:-translate-y-2 transition-all duration-500 relative group shimmer-hover">
                <button 
                  onClick={() => deleteNote(note._id)}
                  className="absolute top-8 right-8 text-slate-800 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all transform hover:rotate-90"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="mb-4">
                   <h3 className="font-black text-[#D4AF37] text-2xl tracking-tighter mb-4 pr-6">{note.title}</h3>
                </div>
                <p className="text-slate-400 mb-8 line-clamp-5 leading-relaxed tracking-wide font-medium">
                  {note.content}
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {note.tags.map(tag => (
                    <span key={tag} className="text-[9px] font-black text-[#D4AF37]/90 bg-[#1A150B] border border-[#D4AF37]/20 px-3 py-1.5 rounded-xl uppercase tracking-widest">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#2A2112]/30">
                   <span className="text-[10px] text-slate-700 font-black uppercase tracking-[0.2em]">Validated</span>
                   <span className="text-[10px] text-slate-700 font-black uppercase tracking-[0.2em]">
                     {new Date(note.createdAt).toLocaleDateString()}
                   </span>
                </div>
              </div>
            ))}
          </div>

          {!loading && notes.length === 0 && (
            <div className="text-center py-32 bg-[#050505] rounded-[4rem] border border-[#2A2112] border-dashed">
              <div className="text-[#D4AF37]/10 mb-8 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <h3 className="text-slate-700 font-black uppercase tracking-[0.3em] text-sm mb-3">No Intel Records</h3>
              <p className="text-slate-800 text-xs font-bold uppercase tracking-widest">Initialize sequence by saving your first insight.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NotesAppShell;
