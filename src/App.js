import React, { useState, useEffect, useRef } from 'react';


import { 
  MessageCircle, 
  ShoppingCart, 
  TrendingUp, 
  FileText, 
  Calculator,
  User,
  Bot,
  Send,
  Mic,
  MicOff,
  Settings,
  Database,
  Zap,
  Brain
} from 'lucide-react';

import { knowledgeBase} from '../Constants';
import { agents } from './Agents';

const RetailAIAgent = () => {
  const [currentAgent, setCurrentAgent] = useState('customer');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [ragResults, setRagResults] = useState([]);
  const messagesEndRef = useRef(null);



  // RAG simulation function
  const performRAG = (query, domain) => {
    const relevantData = knowledgeBase[domain] || [];
    const results = relevantData.filter(item => 
      JSON.stringify(item).toLowerCase().includes(query.toLowerCase())
    );
    return results.slice(0, 3); // Top 3 relevant results
  };

  // LLM API Integration (Real Implementation)
  const callLLMAPI = async (prompt, context) => {
    // In production, this would call Claude, OpenAI, or your chosen LLM
    try {
      // Example API call structure:
      /*
      const response = await fetch('/api/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514', // or your preferred model
          messages: [
            { role: 'system', content: context },
            { role: 'user', content: prompt }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });
      return await response.json();
      */
      
      // For PoC, simulate API delay and return mock response
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { content: "This would be the actual LLM response based on the prompt and context." };
    } catch (error) {
      console.error('LLM API Error:', error);
      return { content: "I apologize, but I'm experiencing technical difficulties. Please try again." };
    }
  };

  // Agent response with LLM integration
  const generateAgentResponse = async (message, agentType) => {
    setIsProcessing(true);
    
    // Step 1: RAG - Retrieve relevant knowledge
    const ragData = performRAG(message, getRelevantDomain(agentType, message));
    setRagResults(ragData);

    // Step 2: Build context prompt for LLM
    const agentContext = getAgentSystemPrompt(agentType);
    const ragContext = ragData.length > 0 ? 
      `\n\nRelevant Knowledge Base Information:\n${JSON.stringify(ragData, null, 2)}` : '';
    
    const fullPrompt = `${agentContext}${ragContext}\n\nUser Query: ${message}`;

    // Step 3: Get LLM response (currently simulated)
    const llmResponse = await callLLMAPI(message, fullPrompt);
    
    // Step 4: For PoC, fall back to simulation if needed
    const response = llmResponse.content || getSimulatedResponse(message, agentType);

    setIsProcessing(false);
    return response;
  };


  // Fallback simulation for PoC demonstration
  const getSimulatedResponse = (message, agentType) => {
    const responses = {
      customer: "Hi! I'm your customer support agent. I can help with account setup, returns, shipping questions, and our loyalty program. How can I assist you today?",
      automation: "I handle order processing, inventory management, and workflow automation. I can track orders, manage stock levels, and automate routine processes. What would you like me to automate?",
      marketing: "I analyze customer behavior and create targeted marketing campaigns. I can generate personalized recommendations, design promotional campaigns, and provide sales analytics. What marketing task can I help with?",
      legal: "I manage legal documents, compliance checks, and policy queries. I can draft contracts, check regulatory compliance, and provide legal risk assessments. What legal matter can I assist with?",
      accounting: "I handle invoicing, expense tracking, and financial reporting. I can generate payment reminders, categorize expenses, and ensure tax compliance. What financial task needs attention?"
    };
    
    return responses[agentType] || "I'm ready to assist you with retail operations. Please select a specific agent or ask me a question!";
  };

  const getRelevantDomain = (agentType, message) => {
    switch (agentType) {
      case 'customer': return message.toLowerCase().includes('product') ? 'products' : 'policies';
      case 'automation': return 'products';
      case 'marketing': return 'products';
      case 'legal': return 'legal';
      case 'accounting': return 'accounting';
      default: return 'products';
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    const response = await generateAgentResponse(inputMessage, currentAgent);

    const agentMessage = {
      type: 'agent',
      agent: currentAgent,
      content: response,
      timestamp: new Date().toLocaleTimeString(),
      ragData: ragResults
    };

    setMessages(prev => [...prev, agentMessage]);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // In a real implementation, this would integrate with Web Speech API
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const demoScenarios = [
    { agent: 'customer', text: "I want to create a new account and join the loyalty program" },
    { agent: 'automation', text: "Check my recent orders and set up tracking notifications" },
    { agent: 'marketing', text: "Create a promotional campaign for fitness products" },
    { agent: 'legal', text: "What's our policy on GDPR compliance for EU customers?" },
    { agent: 'accounting', text: "Generate a financial summary for this month" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Retail Operations Agent</h1>
                <p className="text-gray-600">Multi-Agent RAG-based Retail Automation Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
                <Database className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-800">RAG Active</span>
              </div>
              <div className="flex items-center space-x-2 bg-blue-100 px-3 py-1 rounded-full">
                <Settings className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800">MCP Orchestration</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Agent Selection Panel */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">AI Agents</h3>
            <div className="space-y-3">
              {Object.entries(agents).map(([key, agent]) => (
                <button
                  key={key}
                  onClick={() => setCurrentAgent(key)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    currentAgent === key 
                      ? `${agent.color} text-white shadow-lg transform scale-105` 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {agent.icon}
                    <div>
                      <div className="font-medium">{agent.name}</div>
                      <div className={`text-xs ${currentAgent === key ? 'text-white opacity-90' : 'text-gray-500'}`}>
                        {agent.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Demo Scenarios</h4>
              <div className="space-y-2">
                {demoScenarios.map((scenario, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentAgent(scenario.agent);
                      setInputMessage(scenario.text);
                    }}
                    className="w-full text-left p-2 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded border border-indigo-200 transition-colors"
                  >
                    {scenario.text}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow flex flex-col h-[600px]">
            {/* Chat Header */}
            <div className={`${agents[currentAgent].color} text-white p-4 rounded-t-lg`}>
              <div className="flex items-center space-x-3">
                {agents[currentAgent].icon}
                <div>
                  <h3 className="font-semibold">{agents[currentAgent].name}</h3>
                  <p className="text-sm opacity-90">{agents[currentAgent].description}</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                  <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Start a conversation with the {agents[currentAgent].name}</p>
                  <p className="text-sm">Try asking about products, policies, or specific tasks</p>
                </div>
              )}

              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p>{message.content}</p>
                    <p className={`text-xs mt-1 ${message.type === 'user' ? 'text-indigo-200' : 'text-gray-500'}`}>
                      {message.timestamp}
                    </p>
                    {message.ragData && message.ragData.length > 0 && (
                      <div className="mt-2 text-xs">
                        <div className="bg-green-100 text-green-800 px-2 py-1 rounded">
                          RAG: Found {message.ragData.length} relevant results
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
                      <span className="text-gray-600">
                        Processing: RAG → LLM → Response Generation...
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      🔍 Retrieving knowledge → 🤖 Calling LLM API → 📝 Formatting response
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={`Ask the ${agents[currentAgent].name}...`}
                  className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={toggleListening}
                  className={`p-2 rounded-lg transition-colors ${
                    isListening ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isProcessing}
                  className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* RAG Knowledge Panel */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Database className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold">Knowledge Base</h3>
            </div>

            {ragResults.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Recent RAG Results</h4>
                <div className="space-y-2">
                  {ragResults.map((result, index) => (
                    <div key={index} className="bg-green-50 border border-green-200 rounded p-2 text-xs">
                      <div className="font-medium text-green-800">
                        {result.name || result.topic || `Result ${index + 1}`}
                      </div>
                      <div className="text-green-700 mt-1">
                        {result.description || result.content || JSON.stringify(result).substring(0, 100)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Products</h4>
                <div className="text-xs text-gray-600">
                  {knowledgeBase.products.length} items in catalog
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Policies</h4>
                <div className="text-xs text-gray-600">
                  {knowledgeBase.policies.length} policies available
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Legal Documents</h4>
                <div className="text-xs text-gray-600">
                  {knowledgeBase.legal.length} legal templates
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Financial Data</h4>
                <div className="text-xs text-gray-600">
                  {knowledgeBase.accounting.length} accounting templates
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Customers</h4>
                <div className="text-xs text-gray-600">
                  {knowledgeBase.customers.length} customer profiles
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Architecture Overview */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">System Architecture Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-lg mb-3">
                <Brain className="w-8 h-8 text-purple-600 mx-auto" />
              </div>
              <h4 className="font-semibold">MCP Orchestration</h4>
              <p className="text-sm text-gray-600">Multi-agent coordination and task routing</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-lg mb-3">
                <Database className="w-8 h-8 text-green-600 mx-auto" />
              </div>
              <h4 className="font-semibold">RAG Knowledge Base</h4>
              <p className="text-sm text-gray-600">Vector database with retail domain knowledge</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-lg mb-3">
                <Zap className="w-8 h-8 text-blue-600 mx-auto" />
              </div>
              <h4 className="font-semibold">Process Automation</h4>
              <p className="text-sm text-gray-600">Workflow orchestration and system integrations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetailAIAgent;


