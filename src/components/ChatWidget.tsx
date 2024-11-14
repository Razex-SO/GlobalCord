import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Loader2 } from 'lucide-react';
import useSound from 'use-sound';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: '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',
  dangerouslyAllowBrowser: true // Enable browser usage
});

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  type?: 'text' | 'code' | 'file';
  language?: string;
  fileName?: string;
}

interface SuggestedQuestion {
  text: string;
  icon: string;
  category?: string;
}

const CATEGORIES = {
  FEATURES: 'Platform Features',
  SECURITY: 'Security',
  INTEGRATION: 'Integrations',
  SUPPORT: 'Support'
};

const SUGGESTED_QUESTIONS: SuggestedQuestion[] = [
  { text: "What are GlobalCord's key features?", icon: "✨", category: CATEGORIES.FEATURES },
  { text: "How secure is the platform?", icon: "🔒", category: CATEGORIES.SECURITY },
  { text: "Tell me about voice & video calls", icon: "📞", category: CATEGORIES.FEATURES },
  { text: "How does file sharing work?", icon: "📁", category: CATEGORIES.FEATURES },
  { text: "What integrations are available?", icon: "🔌", category: CATEGORIES.INTEGRATION },
  { text: "How to contact support?", icon: "🆘", category: CATEGORIES.SUPPORT },
];

const EMOJI_SHORTCUTS = {
  ':)': '😊',
  ':(': '😢',
  ':D': '😃',
  ';)': '😉',
  '<3': '❤️',
  'ok': '👍',
  'ng': '👎',
};

const AI_CONTEXT = `You are GlobalCord's friendly and knowledgeable AI assistant. Your purpose is to help users understand and utilize GlobalCord's features effectively.

Key features to know about GlobalCord:
- Real-time communication platform for global teams
- Advanced AI-powered chat and collaboration tools
- Secure end-to-end encrypted messaging
- Voice and video calling capabilities
- File sharing and document collaboration
- Custom integrations and workflow automation
- Team management and organization features
- Smart threading and message organization
- Custom emoji and reaction support
- Role-based access control
- Advanced search capabilities
- Integration with popular development tools

Please be helpful, concise, and friendly in your responses. If you're not sure about specific feature details, be honest and suggest contacting our support team.`;

const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content: "👋 Hi! I'm GlobalCord's AI assistant. I can help you with our platform's features, from real-time communication to team collaboration. Try one of the suggested questions below or ask me anything!",
  timestamp: Date.now()
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sound effects
  const [playMessageSent] = useSound('/sounds/message-sent.mp3', { volume: 0.5 });
  const [playMessageReceived] = useSound('/sounds/message-received.mp3', { volume: 0.5 });
  const [playReset] = useSound('/sounds/message-received.mp3', { volume: 0.3 });
  const [playOpen] = useSound('/sounds/pop-up.mp3', { volume: 0.3 });

  // Load chat history from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatHistory');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 1) { // Don't save if only initial message
      localStorage.setItem('chatHistory', JSON.stringify(messages.slice(-50))); // Keep last 50 messages
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const resetChat = () => {
    setMessages([INITIAL_MESSAGE]);
    playReset();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp: Date.now() }]);
    playMessageSent();
    setIsLoading(true);

    try {
      const stream = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: AI_CONTEXT },
          ...messages.map(msg => ({ role: msg.role, content: msg.content })),
          { role: 'user', content: userMessage }
        ],
        model: 'mixtral-8x7b-32768',
        temperature: 0.7,
        max_tokens: 2048,
        stream: true,
      });

      let fullResponse = '';
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        fullResponse += content;
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage?.role === 'assistant') {
            lastMessage.content = fullResponse;
          } else {
            newMessages.push({ role: 'assistant', content: fullResponse, timestamp: Date.now() });
          }
          return newMessages;
        });
      }
      playMessageReceived();
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again later! 🙇‍♂️', 
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setMessages(prev => [...prev, {
          role: 'user',
          content: `Shared file: ${file.name}\n${content.slice(0, 500)}${content.length > 500 ? '...' : ''}`,
          timestamp: Date.now(),
          type: 'file',
          fileName: file.name
        }]);
      };
      reader.readAsText(file);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    if (inputRef.current) {
      const start = inputRef.current.selectionStart || 0;
      const end = inputRef.current.selectionEnd || 0;
      const newValue = input.substring(0, start) + emoji + input.substring(end);
      setInput(newValue);
      setShowEmojiPicker(false);
      
      // Set cursor position after emoji
      setTimeout(() => {
        if (inputRef.current) {
          const newPosition = start + emoji.length;
          inputRef.current.selectionStart = newPosition;
          inputRef.current.selectionEnd = newPosition;
          inputRef.current.focus();
        }
      }, 0);
    }
  };

  const replaceEmojis = (text: string): string => {
    let result = text;
    Object.entries(EMOJI_SHORTCUTS).forEach(([shortcut, emoji]) => {
      result = result.replace(new RegExp(shortcut, 'g'), emoji);
    });
    return result;
  };

  const askSuggestedQuestion = (question: string) => {
    setInput(question);
    handleSubmit({ preventDefault: () => {} } as React.FormEvent);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    playOpen();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat button */}
      <button
        onClick={() => {
          setIsOpen(prev => !prev);
          playOpen();
        }}
        className="bg-blue-600 hover:bg-blue-700 transition-all p-4 rounded-full shadow-lg hover:shadow-xl"
      >
        <MessageSquare className="w-6 h-6 text-white" />
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className={`absolute bottom-16 right-0 w-96 h-[600px] ${theme === 'dark' ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4`}>
          {/* Chat header */}
          <div className={`flex items-center justify-between p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center space-x-2">
              <MessageSquare className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>GlobalCord AI Assistant</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className={`p-1.5 hover:bg-opacity-20 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? '🌙' : '☀️'}
              </button>
              <button
                onClick={resetChat}
                className={`p-1.5 hover:bg-opacity-20 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                title="Reset Chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                </svg>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className={`p-1.5 hover:bg-opacity-20 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.role === 'user'
                      ? theme === 'dark' 
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-500 text-white'
                      : theme === 'dark'
                        ? 'bg-gray-800 text-white'
                        : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.type === 'code' ? (
                    <pre className="whitespace-pre-wrap font-mono text-sm bg-black/20 p-2 rounded">
                      <code>{message.content}</code>
                    </pre>
                  ) : message.type === 'file' ? (
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>{message.fileName}</span>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                  <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-1 block`}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100" />
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested questions */}
          {messages.length === 1 && (
            <div className={`p-4 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100/50'}`}>
              <div className="flex space-x-2 mb-2 overflow-x-auto pb-2">
                {Object.values(CATEGORIES).map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                    className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                      category === selectedCategory
                        ? theme === 'dark'
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-500 text-white'
                        : theme === 'dark'
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {SUGGESTED_QUESTIONS
                  .filter(q => !selectedCategory || q.category === selectedCategory)
                  .map((question, index) => (
                    <button
                      key={index}
                      onClick={() => askSuggestedQuestion(question.text)}
                      className={`p-2 text-sm rounded-lg text-left transition-colors flex items-center space-x-2 ${
                        theme === 'dark'
                          ? 'hover:bg-gray-700/50 text-gray-300'
                          : 'hover:bg-gray-200/50 text-gray-700'
                      }`}
                    >
                      <span>{question.icon}</span>
                      <span>{question.text}</span>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Input area */}
          <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <form onSubmit={handleSubmit} className="flex items-end space-x-2">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(replaceEmojis(e.target.value))}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className={`w-full p-3 rounded-xl resize-none ${
                    theme === 'dark'
                      ? 'bg-gray-800 text-white placeholder-gray-400 border-gray-700'
                      : 'bg-gray-100 text-gray-900 placeholder-gray-500 border-gray-200'
                  } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  rows={1}
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                />
                <div className="absolute right-2 bottom-2 flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'hover:bg-gray-700 text-gray-400'
                        : 'hover:bg-gray-200 text-gray-600'
                    }`}
                  >
                    😊
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-1.5 rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'hover:bg-gray-700 text-gray-400'
                        : 'hover:bg-gray-200 text-gray-600'
                    }`}
                  >
                    📎
                  </button>
                </div>
                {showEmojiPicker && (
                  <div className={`absolute bottom-full mb-2 right-0 p-2 rounded-lg grid grid-cols-4 gap-1 ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-700'
                      : 'bg-white border-gray-200'
                  } border shadow-lg`}>
                    {Object.values(EMOJI_SHORTCUTS).map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => handleEmojiSelect(emoji)}
                        className="p-2 hover:bg-gray-700/20 rounded transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept=".txt,.md,.json,.js,.ts,.jsx,.tsx,.css,.html"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className={`p-3 rounded-xl transition-colors flex items-center justify-center ${
                  isLoading
                    ? 'bg-gray-600 cursor-not-allowed'
                    : input.trim()
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : theme === 'dark'
                        ? 'bg-gray-700 cursor-not-allowed'
                        : 'bg-gray-200 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                ) : (
                  <Send className="w-5 h-5 text-white" />
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}