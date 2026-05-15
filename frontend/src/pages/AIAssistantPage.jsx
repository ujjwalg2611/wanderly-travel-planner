import React, { useState, useRef, useEffect } from 'react';
import Layout from '../components/ui/Layout';
import { Send, Sparkles, PlaneTakeoff, MapPin, Wallet, Calendar, Mic, RefreshCw, Copy, ThumbsUp, Bot, User } from 'lucide-react';
import toast from 'react-hot-toast';

const QUICK_PROMPTS = [
  { icon: '✈️', text: 'Plan a 7-day trip to Japan under $2000' },
  { icon: '🌴', text: 'Best beaches in Southeast Asia for December' },
  { icon: '🎒', text: 'Ultimate packing list for a 2-week Europe trip' },
  { icon: '💰', text: 'Budget travel tips for Bali' },
  { icon: '🍜', text: 'Must-try street food in Bangkok' },
  { icon: '🗺️', text: 'Hidden gems in Morocco most tourists miss' },
];

const SYSTEM_PROMPT = `You are Wanderly AI, an expert travel assistant built into the Wanderly travel planning app. You help users plan amazing trips with personalized itineraries, budget tips, destination insights, packing advice, visa information, and local recommendations.

Be concise but detailed. Use emojis tastefully. Format your responses with clear sections when helpful. Always be enthusiastic about travel while being practical about budgets and logistics.

When suggesting itineraries, structure them by day with morning/afternoon/evening activities. When giving budget estimates, use approximate USD amounts. Always mention key practical tips like best time to visit, local customs, and must-know phrases.`;

function MessageBubble({ msg }) {
  const isAI = msg.role === 'assistant';
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    toast.success('Copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex gap-3 ${isAI ? '' : 'flex-row-reverse'} mb-4 animate-fade-in`}>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${isAI ? 'bg-gradient-to-br from-sand-400 to-sand-600' : 'bg-gradient-to-br from-ocean-400 to-ocean-600'}`}>
        {isAI ? <Bot size={18} className="text-white"/> : <User size={18} className="text-white"/>}
      </div>
      <div className={`max-w-[75%] ${isAI ? '' : 'items-end flex flex-col'}`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
          isAI ? 'bg-white dark:bg-[#1a2535] text-gray-800 dark:text-gray-200 shadow-card border border-gray-100 dark:border-[#2a3a50] rounded-tl-sm' :
                 'bg-gradient-to-br from-ocean-500 to-ocean-600 text-white rounded-tr-sm'
        }`}>
          {msg.content}
        </div>
        {isAI && (
          <div className="flex items-center gap-2 mt-1.5 ml-1">
            <button onClick={copy} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors">
              <Copy size={11}/> {copied ? 'Copied!' : 'Copy'}
            </button>
            <button onClick={() => setLiked(!liked)} className={`flex items-center gap-1 text-xs transition-colors ${liked ? 'text-sand-500' : 'text-gray-400 hover:text-gray-600'}`}>
              <ThumbsUp size={11}/> {liked ? 'Liked' : 'Like'}
            </button>
          </div>
        )}
        <div className="text-[10px] text-gray-400 mt-1 mx-1">
          {msg.time}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 mb-4">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sand-400 to-sand-600 flex items-center justify-center shadow-sm">
        <Bot size={18} className="text-white"/>
      </div>
      <div className="bg-white dark:bg-[#1a2535] border border-gray-100 dark:border-[#2a3a50] rounded-2xl rounded-tl-sm px-4 py-3 shadow-card">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-sand-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }}/>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `✈️ Hey there, explorer! I'm **Wanderly AI**, your personal travel planning assistant.\n\nI can help you:\n• 🗺️ Plan detailed day-by-day itineraries\n• 💰 Find budget-friendly travel options\n• 🎒 Create perfect packing lists\n• 🌏 Discover hidden gems worldwide\n• 📋 Navigate visa requirements\n• 🍜 Find the best local food spots\n\nWhere are we heading today? 🌍`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    const userMsg = { role: 'user', content: msg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: newMessages
            .filter(m => m.role === 'user' || m.role === 'assistant')
            .map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await response.json();
      const aiText = data.content?.[0]?.text || "I'm having trouble connecting right now. Please try again!";

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: aiText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "🔌 I'm having trouble connecting to the AI service right now. Make sure the Anthropic API is configured, or try again shortly!\n\nIn the meantime, feel free to explore the Wanderly features like trip planning, flight search, hotel finder and visa checker.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: '✨ Chat cleared! Ready for a new adventure. Where shall we go? 🌍',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  return (
    <Layout title="AI Travel Assistant">
      <div className="max-w-4xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 8rem)' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sand-400 to-sand-600 flex items-center justify-center shadow-glow-sand">
              <Sparkles size={22} className="text-white"/>
            </div>
            <div>
              <h2 className="font-display font-bold text-gray-800 dark:text-white">Wanderly AI</h2>
              <div className="flex items-center gap-1.5 text-xs text-green-500">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
                Online · Powered by Claude
              </div>
            </div>
          </div>
          <button onClick={clearChat}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-[#2a3a50] text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1a2535] transition-colors">
            <RefreshCw size={14}/> Clear
          </button>
        </div>

        {/* Quick prompts */}
        {messages.length <= 1 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
            {QUICK_PROMPTS.map(({ icon, text }) => (
              <button key={text} onClick={() => sendMessage(text)}
                className="flex items-center gap-2 p-3 rounded-2xl text-left border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#1a2535] hover:border-sand-300 hover:bg-sand-50 dark:hover:bg-sand-900/20 transition-all group text-sm text-gray-600 dark:text-gray-400">
                <span className="text-lg flex-shrink-0">{icon}</span>
                <span className="text-xs leading-snug line-clamp-2">{text}</span>
              </button>
            ))}
          </div>
        )}

        {/* Chat */}
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-[#0a1420] rounded-2xl p-4 mb-4 border border-gray-100 dark:border-[#2a3a50]">
          {messages.map((msg, i) => <MessageBubble key={i} msg={msg}/>)}
          {loading && <TypingIndicator/>}
          <div ref={bottomRef}/>
        </div>

        {/* Input */}
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={e => { setInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'; }}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Ask me anything about travel... (Enter to send, Shift+Enter for new line)"
              className="w-full px-4 py-3 pr-12 rounded-2xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#1a2535] text-gray-800 dark:text-gray-200 text-sm placeholder-gray-400 focus:border-sand-400 resize-none transition-colors"
              style={{ minHeight: '48px' }}
              disabled={loading}
            />
          </div>
          <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
            className="w-12 h-12 bg-gradient-to-br from-sand-500 to-sand-600 text-white rounded-2xl flex items-center justify-center shadow-md hover:from-sand-600 hover:to-sand-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Send size={18}/>}
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-2">Powered by Claude AI · Responses may not always be accurate. Verify important travel info officially.</p>
      </div>
    </Layout>
  );
}
