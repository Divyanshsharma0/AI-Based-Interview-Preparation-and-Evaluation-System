"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  ArrowPathIcon,
  DocumentIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface HistoryItem {
  id: string;
  type: "interview" | "document";
  role?: string;
  company?: string;
  difficulty?: string;
  score?: number;
  duration?: number;
  file?: string;
  docType?: string;
  insights?: string;
  date: string;
  timestamp: number;
}

// Mock history data
const mockHistoryData: HistoryItem[] = [
  {
    id: "1",
    type: "interview",
    role: "Frontend Engineer",
    company: "Google",
    difficulty: "Medium",
    score: 7.5,
    duration: 18,
    date: "2026-03-19",
    timestamp: Date.now(),
  },
  {
    id: "2",
    type: "document",
    file: "resume_v2.pdf",
    docType: "resume",
    insights: "3 missing skills detected",
    date: "2026-03-18",
    timestamp: Date.now() - 86400000,
  },
  {
    id: "3",
    type: "interview",
    role: "Backend Engineer",
    company: "Amazon",
    difficulty: "Hard",
    score: 6.8,
    duration: 22,
    date: "2026-03-17",
    timestamp: Date.now() - 172800000,
  },
  {
    id: "4",
    type: "document",
    file: "cover_letter.pdf",
    docType: "qa",
    insights: "5 questions answered",
    date: "2026-03-16",
    timestamp: Date.now() - 259200000,
  },
  {
    id: "5",
    type: "interview",
    role: "Full Stack Developer",
    company: "Microsoft",
    difficulty: "Medium",
    score: 8.2,
    duration: 20,
    date: "2026-03-15",
    timestamp: Date.now() - 345600000,
  },
];

// Chart data
const scoreData = [
  { date: "Mar 11", score: 6.2 },
  { date: "Mar 13", score: 6.8 },
  { date: "Mar 15", score: 8.2 },
  { date: "Mar 17", score: 6.8 },
  { date: "Mar 19", score: 7.5 },
];

const weeklyData = [
  { week: "Week 1", interviews: 2 },
  { week: "Week 2", interviews: 3 },
  { week: "Week 3", interviews: 2 },
  { week: "Week 4", interviews: 1 },
];

const usageData = [
  { name: "Interviews", value: 4 },
  { name: "Documents", value: 2 },
];

const COLORS = ["#4f46e5", "#8b5cf6"];

const getRelativeDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<"interviews" | "documents">(
    "interviews"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("");

  const filteredHistory = useMemo(() => {
    return mockHistoryData.filter((item) => {
      if (activeTab === "interviews" && item.type !== "interview")
        return false;
      if (activeTab === "documents" && item.type !== "document") return false;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (item.type === "interview") {
          return (
            item.role?.toLowerCase().includes(query) ||
            item.company?.toLowerCase().includes(query)
          );
        } else {
          return item.file?.toLowerCase().includes(query);
        }
      }

      if (filterDifficulty && item.difficulty !== filterDifficulty)
        return false;

      return true;
    });
  }, [activeTab, searchQuery, filterDifficulty]);

  const stats = {
    totalInterviews: mockHistoryData.filter((i) => i.type === "interview")
      .length,
    avgScore:
      mockHistoryData
        .filter((i) => i.type === "interview" && i.score)
        .reduce((acc, i) => acc + (i.score || 0), 0) /
      mockHistoryData.filter((i) => i.type === "interview" && i.score).length,
    improvement: 2.3,
  };

  return (
    <div className="min-h-screen bg-gray-50 lg:ml-64">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-3xl font-bold text-gray-900">History</h1>
          <p className="mt-2 text-gray-600">
            Track your interview practice and document analysis progress
          </p>
        </motion.div>
      </div>

      {/* Centered Stats & Charts Container (Separate Entity) */}
      <div className="flex justify-center mb-12">
        <div className="w-full max-w-5xl px-6 sm:px-8">
            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-12 grid gap-6 sm:grid-cols-3"
            >
          {/* Total Interviews */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-sm font-medium text-gray-600">
              Total Interviews
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {stats.totalInterviews}
            </p>
            <p className="mt-2 text-xs text-gray-500">completed</p>
          </div>

          {/* Average Score */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-sm font-medium text-gray-600">Average Score</p>
            <p className="mt-2 text-3xl font-bold text-indigo-600">
              {stats.avgScore.toFixed(1)}
            </p>
            <p className="mt-2 text-xs text-gray-500">out of 10</p>
          </div>

          {/* Improvement */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-sm font-medium text-gray-600">Improvement</p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              +{stats.improvement}%
            </p>
            <p className="mt-2 text-xs text-gray-500">last 7 days</p>
          </div>
        </motion.div>

        {/* Charts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12 grid gap-6 lg:grid-cols-3"
        >
          {/* Score Trend */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              Score Trend
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={scoreData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: 12 }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#4f46e5"
                  dot={{ fill: "#4f46e5", r: 4 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Weekly Activity */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              Weekly Activity
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="week" stroke="#9ca3af" style={{ fontSize: 12 }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="interviews" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Usage Distribution */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              Usage Distribution
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={usageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {usageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        </div>
      </div>

      {/* Main Content Container (Tabs, Search, History) */}
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8 flex gap-6 border-b border-gray-200"
        >
          {["interviews", "documents"].map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab as "interviews" | "documents")}
              className={`px-4 py-3 font-medium transition border-b-2 ${
                activeTab === tab
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-700 hover:text-gray-900"
              }`}
            >
              {tab === "interviews" ? "Interviews" : "Documents"}
              <span className="ml-2 text-xs bg-gray-100 rounded-full px-2 py-0.5">
                {mockHistoryData.filter((i) => i.type === tab.slice(0, -1)).length}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8 flex gap-4"
        >
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={
                activeTab === "interviews"
                  ? "Search by role or company..."
                  : "Search by file name..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
            />
          </div>

          {activeTab === "interviews" && (
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              aria-label="Filter by difficulty"
              className="rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
            >
              <option value="">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          )}
        </motion.div>

        {/* History List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <AnimatePresence mode="wait">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  className="rounded-xl border border-gray-200 bg-white p-6 transition hover:shadow-md"
                >
                  {item.type === "interview" ? (
                    // Interview Card
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 gap-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.role} Interview
                          </h3>
                          <span className="text-sm font-medium text-gray-600">
                            ({item.company})
                          </span>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              item.difficulty === "Easy"
                                ? "bg-green-100 text-green-800"
                                : item.difficulty === "Medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.difficulty}
                          </span>
                          <span className="text-indigo-600 font-semibold">
                            Score: {item.score}
                          </span>
                          <span>Duration: {item.duration} min</span>
                          <span className="text-gray-500">
                            {getRelativeDate(item.date)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                          <EyeIcon className="h-4 w-4" />
                          View
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                        >
                          <ArrowPathIcon className="h-4 w-4" />
                          Retry
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    // Document Card
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <DocumentIcon className="h-5 w-5 text-blue-600" />
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.file}
                          </h3>
                          <span className="text-xs font-medium text-gray-600">
                            ({item.docType === "resume"
                              ? "Resume Analysis"
                              : "Document Q&A"}
                            )
                          </span>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                            <CheckCircleIcon className="h-3 w-3" />
                            {item.insights}
                          </span>
                          <span className="text-gray-500">
                            {getRelativeDate(item.date)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                          <EyeIcon className="h-4 w-4" />
                          View
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                        >
                          <ArrowPathIcon className="h-4 w-4" />
                          Again
                        </motion.button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl border-2 border-dashed border-gray-300 p-12 text-center"
              >
                <p className="text-gray-600">
                  No {activeTab} found matching your search
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
