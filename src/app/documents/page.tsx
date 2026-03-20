"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CloudArrowUpIcon,
  DocumentIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  CheckCircleIcon,
  LightBulbIcon,
  QuestionMarkCircleIcon,
  ClipboardDocumentListIcon,
  HandThumbUpIcon,
  DocumentMagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import NavigationPanel from "../components/NavigationPanel";
import ReactMarkdown from "react-markdown";

interface UploadedFile {
  name: string;
  type: "pdf" | "docx";
  uploadedAt: Date;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const mockSkills = ["Python", "React", "SQL", "Node.js", "TypeScript"];
const mockMissingSkills = ["System Design", "Docker", "AWS", "GraphQL"];
const mockSuggestions = [
  "Add measurable achievements with concrete metrics",
  "Improve project descriptions with technical impact",
  "Include 3-5 quantified results for each role",
  "Highlight leadership and mentorship experiences",
];
const mockQuestions = [
  "Walk me through your most challenging React project.",
  "How do you optimize database queries?",
  "Describe a time you debugged a production issue.",
  "Explain your approach to system design.",
];

export default function DocumentsPage() {
  const [mode, setMode] = useState<"resume" | "chat">("resume");
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [documentText, setDocumentText] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const analyzeFile = async (text: string, currentRole = role, currentCompany = company) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/documents/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentText: text, role: currentRole, company: currentCompany }),
      });
      const data = await res.json();
      if (data.success) {
        setAnalysisData(data);
      }
    } catch (err) {
      console.error("Analysis error", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const parseFile = async (file: File) => {
    setIsParsing(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setDocumentText(data.text);
        // Trigger Dynamic Analysis on the extracted text
        analyzeFile(data.text);
      } else {
        console.error("Parse failed", data.error);
      }
    } catch (err) {
      console.error("Error uploading file", err);
    } finally {
      setIsParsing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === "application/pdf") {
        setUploadedFile({
          name: file.name,
          type: "pdf",
          uploadedAt: new Date(),
        });
        parseFile(file);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === "application/pdf") {
        setUploadedFile({
          name: file.name,
          type: "pdf",
          uploadedAt: new Date(),
        });
        parseFile(file);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !uploadedFile || !documentText) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: chatInput,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsLoadingChat(true);

    try {
      const res = await fetch("/api/documents/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          documentText,
          previousMessages: chatMessages,
        }),
      });

      const data = await res.json();

      const aiMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: data.success ? data.content : "Error querying local AI model.",
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Chat error", err);
    } finally {
      setIsLoadingChat(false);
    }
  };

  const tabVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen bg-gray-50 lg:ml-64">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        {/* Navigation Panel */}
        <NavigationPanel />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">
            Document Analysis
          </h1>
          <p className="mt-2 text-gray-600">
            Upload and analyze your resume or chat with your documents
          </p>
        </motion.div>

        {/* Mode Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8 flex gap-2 border-b border-gray-200"
        >
          {["resume", "chat"].map((tabMode) => (
            <motion.button
              key={tabMode}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMode(tabMode as "resume" | "chat")}
              className={`px-6 py-3 font-medium transition border-b-2 ${
                mode === tabMode
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-700 hover:text-gray-900"
              }`}
            >
              {tabMode === "resume" ? "Resume Analysis" : "Document Q&A"}
            </motion.button>
          ))}
        </motion.div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Panel - Upload & Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Upload Area */}
            <motion.div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`rounded-xl border-2 border-dashed p-8 text-center transition ${
                isDragging
                  ? "border-indigo-400 bg-indigo-50"
                  : "border-gray-300 bg-white hover:border-gray-400"
              }`}
            >
              <CloudArrowUpIcon
                className={`mx-auto h-10 w-10 mb-3 transition ${
                  isDragging ? "text-indigo-600" : "text-gray-400"
                }`}
              />
              <p className="text-sm font-medium text-gray-900 mb-1">
                {uploadedFile ? "File uploaded" : "Drop your file here"}
              </p>
              <p className="text-xs text-gray-500 mb-4">
                PDF or DOCX (Max 10MB)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileSelect}
                aria-label="Upload resume or document"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                {uploadedFile ? "Change file" : "Browse files"}
              </button>
            </motion.div>

            {/* Uploaded File Info */}
            {uploadedFile && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-green-200 bg-green-50 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <DocumentIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {uploadedFile.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {uploadedFile.uploadedAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setUploadedFile(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {isParsing && (
              <div className="flex items-center gap-2 text-indigo-600 animate-pulse text-xs font-medium px-1">
                <SparklesIcon className="h-4 w-4" />
                Analyzing document text offline...
              </div>
            )}

            {/* Role Selection (Resume Mode) */}
            {mode === "resume" && uploadedFile && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Role (Optional)
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g., Senior Frontend Engineer"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                />
              </motion.div>
            )}

            {/* Company Selection (Resume Mode) */}
            {mode === "resume" && uploadedFile && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <label htmlFor="company-select" className="block text-sm font-medium text-gray-700 mb-2">
                  Company (Optional)
                </label>
                <select
                  id="company-select"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                >
                  <option value="">Select company</option>
                  <option value="Google">Google</option>
                  <option value="Amazon">Amazon</option>
                  <option value="Microsoft">Microsoft</option>
                  <option value="Startup">Startup</option>
                  <option value="Custom">Custom</option>
                </select>
              </motion.div>
            )}

            {mode === "resume" && uploadedFile && documentText && (
              <motion.button
                type="button"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => analyzeFile(documentText)}
                disabled={isAnalyzing || isParsing}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isAnalyzing ? "Re-analyzing…" : "Re-run analysis with targets"}
              </motion.button>
            )}
          </motion.div>

          {/* Right Panel - Dynamic Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <AnimatePresence mode="wait">
              {/* Resume Analysis Mode */}
              {mode === "resume" && (
                <motion.div
                  key="resume-mode"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  {!uploadedFile ? (
                    <motion.div
                      variants={cardVariants}
                      className="rounded-xl border-2 border-dashed border-gray-300 p-12 text-center"
                    >
                      <p className="text-gray-600">
                        Upload a file to get started with resume analysis
                      </p>
                    </motion.div>
                  ) : (
                    <>
                      {isAnalyzing && (
                        <div className="rounded-xl border border-indigo-100 bg-indigo-50/80 px-4 py-3 text-sm text-indigo-900 flex items-center gap-2">
                          <SparklesIcon className="h-5 w-5 shrink-0 animate-pulse" />
                          Generating a detailed resume review (this may take a moment)…
                        </div>
                      )}

                      {/* Overview */}
                      {analysisData?.summary && (
                        <motion.div
                          variants={cardVariants}
                          className="rounded-xl border border-gray-200 bg-white p-6"
                        >
                          <div className="mb-3 flex items-center gap-2">
                            <SparklesIcon className="h-5 w-5 text-indigo-600" />
                            <h3 className="font-semibold text-gray-900">
                              Overview
                            </h3>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {analysisData.summary}
                          </p>
                        </motion.div>
                      )}

                      {/* Strengths */}
                      {(analysisData?.strengths || []).length > 0 && (
                        <motion.div
                          variants={cardVariants}
                          className="rounded-xl border border-gray-200 bg-white p-6"
                        >
                          <div className="mb-4 flex items-center gap-2">
                            <CheckCircleIcon className="h-5 w-5 text-emerald-600" />
                            <h3 className="font-semibold text-gray-900">
                              Standout strengths
                            </h3>
                          </div>
                          <ul className="space-y-4">
                            {(analysisData.strengths as string[]).map((line: string, idx: number) => (
                              <motion.li
                                key={idx}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="text-sm text-gray-700 border-l-2 border-emerald-200 pl-4 leading-relaxed"
                              >
                                {line}
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      )}

                      {/* Extracted Skills */}
                      <motion.div
                        variants={cardVariants}
                        className="rounded-xl border border-gray-200 bg-white p-6"
                      >
                        <div className="mb-4 flex items-center gap-2">
                          <CheckCircleIcon className="h-5 w-5 text-green-600" />
                          <h3 className="font-semibold text-gray-900">
                            Extracted Skills
                          </h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(analysisData?.skills || []).map((skill: string, idx: number) => (
                            <motion.span
                              key={`${skill}-${idx}`}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: idx * 0.1 }}
                              className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800"
                            >
                              {skill}
                            </motion.span>
                          ))}
                        </div>
                      </motion.div>

                      {/* Gaps / missing skills */}
                      {(analysisData?.missingSkills || []).length > 0 && (
                        <motion.div
                          variants={cardVariants}
                          className="rounded-xl border border-gray-200 bg-white p-6"
                        >
                          <div className="mb-4 flex items-center gap-2">
                            <LightBulbIcon className="h-5 w-5 text-amber-600" />
                            <h3 className="font-semibold text-gray-900">
                              Gaps &amp; role fit
                            </h3>
                          </div>
                          <ul className="space-y-3">
                            {(analysisData.missingSkills as string[]).map((line: string, idx: number) => (
                              <motion.li
                                key={idx}
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="text-sm text-gray-700 border border-amber-100 bg-amber-50/80 rounded-lg px-3 py-2 leading-relaxed"
                              >
                                {line}
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      )}

                      {/* Formatting & ATS */}
                      {(analysisData?.formattingAndAts || []).length > 0 && (
                        <motion.div
                          variants={cardVariants}
                          className="rounded-xl border border-gray-200 bg-white p-6"
                        >
                          <div className="mb-4 flex items-center gap-2">
                            <DocumentIcon className="h-5 w-5 text-slate-600" />
                            <h3 className="font-semibold text-gray-900">
                              Format &amp; ATS
                            </h3>
                          </div>
                          <ul className="space-y-2">
                            {(analysisData.formattingAndAts as string[]).map((line: string, idx: number) => (
                              <motion.li
                                key={idx}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="text-sm text-gray-700 flex gap-2"
                              >
                                <span className="text-slate-400 flex-shrink-0">•</span>
                                <span>{line}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      )}

                      {/* Suggestions */}
                      <motion.div
                        variants={cardVariants}
                        className="rounded-xl border border-gray-200 bg-white p-6"
                      >
                        <div className="mb-4 flex items-center gap-2">
                          <SparklesIcon className="h-5 w-5 text-blue-600" />
                          <h3 className="font-semibold text-gray-900">
                            Suggestions
                          </h3>
                        </div>
                        <ul className="space-y-3">
                          {(analysisData?.suggestions || []).map((suggestion: string, idx: number) => (
                            <motion.li
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="flex gap-3 text-sm text-gray-700"
                            >
                              <span className="flex-shrink-0 rounded-full bg-blue-100 w-6 h-6 flex items-center justify-center font-medium text-blue-700">
                                {idx + 1}
                              </span>
                              <span>{suggestion}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>

                      {/* Interview Questions */}
                      <motion.div
                        variants={cardVariants}
                        className="rounded-xl border border-gray-200 bg-white p-6"
                      >
                        <div className="mb-4 flex items-center gap-2">
                          <QuestionMarkCircleIcon className="h-5 w-5 text-purple-600" />
                          <h3 className="font-semibold text-gray-900">
                            Generated Interview Questions
                          </h3>
                        </div>
                        <ul className="space-y-3">
                          {(analysisData?.questions || []).map((question: string, idx: number) => (
                            <motion.li
                              key={idx}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700"
                            >
                              {idx + 1}. {question}
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    </>
                  )}
                </motion.div>
              )}

              {/* Document Q&A Mode */}
              {mode === "chat" && (
                <motion.div
                  key="chat-mode"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-col h-[600px] rounded-xl border border-gray-200 bg-white overflow-hidden"
                >
                  {!uploadedFile ? (
                    <motion.div
                      variants={cardVariants}
                      className="flex-1 flex items-center justify-center"
                    >
                      <p className="text-gray-600">
                        Upload a file to start chatting about your document
                      </p>
                    </motion.div>
                  ) : (
                    <>
                      {/* Chat Messages */}
                      <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {chatMessages.length === 0 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-full flex items-center justify-center text-center"
                          >
                            <p className="text-gray-500">
                              Ask a question about your document...
                            </p>
                          </motion.div>
                        )}

                        {chatMessages.map((msg, idx) => (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`flex ${
                              msg.role === "user"
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <div
                              className={`rounded-lg px-4 py-2 max-w-xl text-sm ${
                                msg.role === "user"
                                  ? "bg-indigo-600 text-white"
                                  : "bg-gray-100 text-gray-900 prore-markdown"
                              }`}
                            >
                              <ReactMarkdown>
                                {msg.content}
                              </ReactMarkdown>
                            </div>
                          </motion.div>
                        ))}

                        {isLoadingChat && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-start"
                          >
                            <div className="bg-gray-100 rounded-lg px-4 py-2">
                              <div className="flex gap-1">
                                <motion.div
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{
                                    repeat: Infinity,
                                    duration: 0.6,
                                  }}
                                  className="w-2 h-2 bg-gray-400 rounded-full"
                                />
                                <motion.div
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{
                                    repeat: Infinity,
                                    duration: 0.6,
                                    delay: 0.2,
                                  }}
                                  className="w-2 h-2 bg-gray-400 rounded-full"
                                />
                                <motion.div
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{
                                    repeat: Infinity,
                                    duration: 0.6,
                                    delay: 0.4,
                                  }}
                                  className="w-2 h-2 bg-gray-400 rounded-full"
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}

                        <div ref={chatEndRef} />
                      </div>

                      {/* Chat Input */}
                      <div className="border-t border-gray-200 p-4 bg-gray-50">
                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                              }
                            }}
                            placeholder="Ask anything about your document..."
                            disabled={isLoadingChat}
                            className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-400 text-sm disabled:bg-gray-100"
                          />
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSendMessage}
                            disabled={!chatInput.trim() || isLoadingChat}
                            className="rounded-lg bg-indigo-600 p-2.5 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <PaperAirplaneIcon className="h-5 w-5" />
                          </motion.button>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
