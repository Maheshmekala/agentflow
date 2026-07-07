import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function AgentsPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role:string;content:string}[]>([
    {role:'assistant', content:"🤖 Welcome to AgentFlow! I'm an AI agent powered by Groq Llama 3.3. Ask me anything!"}
  ]);
  const [loading, setLoading] = useState(false);
  const [tools, setTools] = useState<any[]>([]);
  const chatEnd = useRef<HTMLDivElement>(null);

  useEffect(() => { chatEnd.current?.scrollIntoView({behavior:'smooth'}); }, [messages]);

  useEffect(() => {
    axios.get('/api/agents/tools').then(r => setTools(r.data)).catch(() => {});
  }, []);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput('');
    setMessages(prev => [...prev, {role:'user', content:msg}]);
    setLoading(true);
    try {
      const res = await axios.post('/api/agents/run', {agent:'default', input:msg});
      setMessages(prev => [...prev, {role:'assistant', content:res.data.output}]);
    } catch {
      setMessages(prev => [...prev, {role:'assistant', content:'❌ Error connecting to agent backend'}]);
    }
    setLoading(false);
  };

  const suggestions = ["Hello! What can you do?", "What is 15 + 27?", "Tell me about AgentFlow", "What tools do you have?"];

  return <div className="flex gap-4 h-[calc(100vh-100px)]">
    <div className="flex-1 flex flex-col bg-gray-900 rounded-2xl border border-white/10 overflow-hidden">
      <div className="p-4 border-b border-white/10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-lg">🧠</div>
        <div>
          <h2 className="font-semibold text-white">Agent Runner</h2>
          <p className="text-xs text-gray-400">Powered by Groq Llama 3.3</p>
        </div>
        <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
            <div className={`max-w-2xl rounded-2xl p-4 ${m.role === 'user' ? 'bg-purple-600 text-white rounded-br-sm' : 'bg-gray-800/50 text-gray-100 rounded-bl-sm border border-white/5'}`}>
              <div className="flex items-start gap-3">
                <span>{m.role === 'user' ? '👤' : '🧠'}</span>
                <p className="text-sm">{m.content}</p>
              </div>
            </div>
          </div>
        ))}
        {loading && <div className="flex justify-start">
          <div className="bg-gray-800/50 rounded-2xl p-4 border border-white/5">
            <div className="flex gap-1.5">
              <span className="typing-dot w-2.5 h-2.5 bg-purple-400 rounded-full inline-block"></span>
              <span className="typing-dot w-2.5 h-2.5 bg-purple-400 rounded-full inline-block"></span>
              <span className="typing-dot w-2.5 h-2.5 bg-purple-400 rounded-full inline-block"></span>
            </div>
          </div>
        </div>}
        {messages.length === 1 && <div className="flex flex-wrap gap-2 mt-4">
          {suggestions.map(s => <button key={s} onClick={() => setInput(s)}
            className="text-xs bg-white/5 hover:bg-white/10 text-gray-400 px-3 py-1.5 rounded-full border border-white/10 hover:border-purple-500/50 transition">{s}</button>)}
        </div>}
        <div ref={chatEnd} />
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="flex gap-3">
          <input type="text" value={input} onChange={e => setInput(e.target.value)}
            placeholder="Ask the agent..." className="flex-1 bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            onKeyDown={e => e.key === 'Enter' && handleSend()} disabled={loading} />
          <button onClick={handleSend} disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 font-medium shadow-lg shadow-purple-500/25">Send</button>
        </div>
      </div>
    </div>

    <div className="w-72 bg-gray-900/50 rounded-2xl border border-white/10 p-4 hidden lg:block">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">🔧 Tool Registry</h3>
      {tools.map(t => <div key={t.name} className="p-3 bg-white/5 rounded-lg mb-2">
        <p className="font-medium text-sm text-white">{t.name}</p>
        <p className="text-xs text-gray-400 mt-0.5">{t.description}</p>
      </div>)}
      {tools.length === 0 && <p className="text-xs text-gray-600">No tools registered yet</p>}
    </div>
  </div>;
}
