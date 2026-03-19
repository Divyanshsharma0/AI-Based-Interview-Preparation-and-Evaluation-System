"use client";

import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import {
  SparklesIcon,
  ArrowTrendingUpIcon,
  LightBulbIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

// Mock data
const performanceData = [
  { date: "Jan 15", score: 72 },
  { date: "Jan 22", score: 75 },
  { date: "Jan 29", score: 78 },
  { date: "Feb 5", score: 81 },
  { date: "Feb 12", score: 85 },
  { date: "Feb 19", score: 88 },
];

const sessionPerformance = [
  { session: "Interview 1", score: 72, feedback: 8 },
  { session: "Interview 2", score: 75, feedback: 7 },
  { session: "Interview 3", score: 78, feedback: 8 },
  { session: "Interview 4", score: 81, feedback: 9 },
  { session: "Interview 5", score: 85, feedback: 8 },
  { session: "Interview 6", score: 88, feedback: 9 },
];

const skillAnalysis = [
  { skill: "Communication", value: 82 },
  { skill: "Technical", value: 75 },
  { skill: "Problem Solving", value: 88 },
  { skill: "Confidence", value: 80 },
  { skill: "Clarity", value: 85 },
];

const aiInsights = [
  {
    id: 1,
    title: "Strong Problem-Solving Skills",
    description:
      "Your approach to DSA problems shows structured thinking and good optimization.",
    type: "positive",
    icon: "✓",
  },
  {
    id: 2,
    title: "Improve Answer Structure",
    description:
      "Focus on using the STAR method more consistently in behavioral questions.",
    type: "suggestion",
    icon: "→",
  },
  {
    id: 3,
    title: "Technical Depth Needed",
    description:
      "When explaining technical concepts, provide more real-world examples.",
    type: "improvement",
    icon: "↑",
  },
];

const recentFeedback = [
  {
    id: 1,
    role: "Full Stack Developer",
    company: "Google",
    score: 88,
    feedback: "Great technical explanations. Work on time management.",
    date: "2 days ago",
  },
  {
    id: 2,
    role: "Frontend Developer",
    company: "Meta",
    score: 85,
    feedback: "Solid React knowledge. Practice more system design.",
    date: "1 week ago",
  },
  {
    id: 3,
    role: "Backend Engineer",
    company: "Amazon",
    score: 81,
    feedback:
      "Good database design. Improve concurrency knowledge. review system design patterns.",
    date: "2 weeks ago",
  },
];

const suggestions = [
  {
    id: 1,
    title: "Practice System Design",
    description: "Complete 5 system design mock interviews",
    priority: "high",
    progress: 2,
    total: 5,
  },
  {
    id: 2,
    title: "Master Data Structures",
    description: "Review advanced tree and graph problems",
    priority: "medium",
    progress: 8,
    total: 10,
  },
  {
    id: 3,
    title: "Behavioral Interview Training",
    description: "Practice STAR method responses",
    priority: "medium",
    progress: 4,
    total: 6,
  },
];

export default function FeedbackReports() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, delay: 0.2 },
    },
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-white lg:ml-64"
    >
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900">Feedback Reports</h1>
          <p className="mt-2 text-gray-600">
            Analyze your performance and track your improvement over time
          </p>
        </motion.div>

        {/* Overall Performance Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-12 grid gap-6 sm:grid-cols-3"
        >
          <motion.div
            variants={itemVariants}
            className="rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-white p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Interviews
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">6</p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <ArrowTrendingUpIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="rounded-xl border border-gray-200 bg-gradient-to-br from-indigo-50 to-white p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Average Score
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">82%</p>
              </div>
              <div className="rounded-full bg-indigo-100 p-3">
                <SparklesIcon className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="rounded-xl border border-gray-200 bg-gradient-to-br from-green-50 to-white p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Improvement
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">+16%</p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Charts Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-12 grid gap-6 lg:grid-cols-2"
        >
          {/* Score Trend */}
          <motion.div
            variants={chartVariants}
            className="rounded-xl border border-gray-200 bg-white p-6"
          >
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Score Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} domain={[0, 100]} />
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
                  strokeWidth={3}
                  dot={{ fill: "#4f46e5", r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Session Performance */}
          <motion.div
            variants={chartVariants}
            className="rounded-xl border border-gray-200 bg-white p-6"
          >
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Session Performance
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sessionPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="session" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="score" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>

        {/* Skill-wise Analysis */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="mb-12 rounded-xl border border-gray-200 bg-white p-6"
        >
          <h2 className="mb-6 text-xl font-semibold text-gray-900">
            Skill-wise Analysis
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={skillAnalysis}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="skill" stroke="#6b7280" fontSize={12} />
              <PolarRadiusAxis stroke="#9ca3af" fontSize={12} domain={[0, 100]} />
              <Radar
                name="Performance"
                dataKey="value"
                stroke="#4f46e5"
                fill="#4f46e5"
                fillOpacity={0.3}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* AI Insights */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            AI Feedback Insights
          </h2>
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
            {aiInsights.map((insight, idx) => {
              const bgColor =
                insight.type === "positive"
                  ? "bg-green-50 border-green-200"
                  : insight.type === "suggestion"
                    ? "bg-blue-50 border-blue-200"
                    : "bg-amber-50 border-amber-200";

              const textColor =
                insight.type === "positive"
                  ? "text-green-900"
                  : insight.type === "suggestion"
                    ? "text-blue-900"
                    : "text-amber-900";

              const iconBg =
                insight.type === "positive"
                  ? "bg-green-100"
                  : insight.type === "suggestion"
                    ? "bg-blue-100"
                    : "bg-amber-100";

              const iconColor =
                insight.type === "positive"
                  ? "text-green-600"
                  : insight.type === "suggestion"
                    ? "text-blue-600"
                    : "text-amber-600";

              return (
                <motion.div
                  key={insight.id}
                  variants={itemVariants}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`rounded-xl border p-6 ${bgColor}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`rounded-full ${iconBg} p-3 flex-shrink-0`}>
                      <LightBulbIcon className={`h-5 w-5 ${iconColor}`} />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${textColor}`}>
                        {insight.title}
                      </h3>
                      <p className={`text-sm mt-1 ${textColor} opacity-80`}>
                        {insight.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Interview Feedback */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Recent Interview Feedback
          </h2>
          <div className="space-y-4">
            {recentFeedback.map((item, idx) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                transition={{ delay: 0.5 + idx * 0.1 }}
                whileHover={{ scale: 1.01 }}
                className="rounded-xl border border-gray-200 bg-white p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {item.role} @ {item.company}
                      </h3>
                      <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">
                        {item.score}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{item.feedback}</p>
                    <p className="text-xs text-gray-500">{item.date}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      View Details
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-medium text-indigo-600 transition hover:bg-indigo-100"
                    >
                      Retry
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Actionable Suggestions */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Actionable Suggestions
          </h2>
          <div className="space-y-4">
            {suggestions.map((suggestion, idx) => (
              <motion.div
                key={suggestion.id}
                variants={itemVariants}
                transition={{ delay: 0.6 + idx * 0.1 }}
                whileHover={{ scale: 1.01 }}
                className="rounded-xl border border-gray-200 bg-white p-6"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {suggestion.title}
                      </h3>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          suggestion.priority === "high"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {suggestion.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {suggestion.description}
                    </p>
                  </div>
                  <ArrowPathIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Progress</span>
                    <span>
                      {suggestion.progress}/{suggestion.total}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(suggestion.progress / suggestion.total) * 100}%`,
                      }}
                      transition={{ duration: 0.6, delay: 0.6 + idx * 0.1 }}
                      className="h-full bg-gradient-to-r from-indigo-500 to-blue-500"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.main>
  );
}
