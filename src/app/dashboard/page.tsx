"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  SparklesIcon,
  DocumentMagnifyingGlassIcon,
  ChartBarSquareIcon,
  BoltIcon,
  ClockIcon,
  CheckCircleIcon,
  HandRaisedIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    id: 1,
    title: "Interview Practice",
    description: "Practice with AI-powered mock interviews",
    icon: BoltIcon,
    color: "from-purple-500 to-indigo-500",
  },
  {
    id: 2,
    title: "Document Analysis",
    description: "Get instant feedback on your resume",
    icon: DocumentMagnifyingGlassIcon,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 3,
    title: "Feedback Reports",
    description: "Track your improvement over time",
    icon: ChartBarSquareIcon,
    color: "from-orange-400 to-pink-500",
  },
];

const recentActivity = [
  {
    id: 1,
    title: "Completed DSA Interview",
    time: "2 hours ago",
    icon: CheckCircleIcon,
  },
  {
    id: 2,
    title: "Uploaded Resume for Analysis",
    time: "5 hours ago",
    icon: DocumentMagnifyingGlassIcon,
  },
  {
    id: 3,
    title: "Practiced HR Questions",
    time: "1 day ago",
    icon: BoltIcon,
  },
];

const motivations = [
  "Consistency beats intensity.",
  "Small improvements lead to big outcomes.",
  "Clarity comes from practice.",
  "Progress, not perfection.",
];

export default function Dashboard() {
  // Use date-based index for consistent motivation (no hydration mismatch)
  const motivationIndex = new Date().getDate() % motivations.length;
  const todaysMotivation = motivations[motivationIndex];

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

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-white"
    >
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10">
        {/* Welcome Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-12 space-y-2"
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-3"
          >
            <h1 className="text-4xl font-bold text-gray-900">
              Welcome back, Divyansh
            </h1>
            <motion.div
              animate={{ rotate: [0, 20, 0] }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="h-9 w-9 text-indigo-600"
            >
              <HandRaisedIcon className="h-full w-full" />
            </motion.div>
          </motion.div>
          <motion.p variants={itemVariants} className="text-lg text-gray-600">
            {todaysMotivation}
          </motion.p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-12 grid gap-6 sm:grid-cols-1 lg:grid-cols-3"
        >
          {features.map((feature) => {
            const FeatureIcon = feature.icon;
            const href =
              feature.id === 1
                ? "/interview/setup"
                : feature.id === 2
                  ? "/documents"
                  : "/dashboard/reports";

            return (
              <motion.div
                key={feature.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="group rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <Link href={href} className="flex flex-col h-full">
                  {/* Header with gradient + pattern overlay */}
                  <div
                    className={`relative h-32 bg-gradient-to-br ${feature.color} overflow-visible`}
                  >
                    {/* Subtle radial light overlay */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.15),transparent_50%)] pointer-events-none" />

                    {/* Subtle diagonal pattern - very low opacity */}
                    <div className="absolute inset-0 opacity-[0.08] bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(0,0,0,0.3)_2px,rgba(0,0,0,0.3)_4px)]" />

                    {/* Icon in glass circle */}
                    <motion.div
                      whileHover={{ scale: 1.15, y: -4 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="absolute left-6 top-12 backdrop-blur-xl bg-white/20 hover:bg-white/30 border border-white/50 rounded-full p-4 text-white shadow-xl transition-colors z-10"
                    >
                      <FeatureIcon className="h-6 w-6" />
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="mb-1 text-lg font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="mb-6 text-sm text-gray-600 flex-1">
                      {feature.description}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-fit text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
                    >
                      Start →
                    </motion.button>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Divider */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          className="mb-12 h-px bg-gray-200"
        />

        {/* Recent Activity */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          transition={{ delayChildren: 0.5 }}
          className="space-y-6"
        >
          <motion.h2
            variants={itemVariants}
            className="text-2xl font-bold text-gray-900"
          >
            Recent Activity
          </motion.h2>

          <motion.div className="space-y-4">
            {recentActivity.map((activity, index) => {
              const ActivityIcon = activity.icon;
              return (
                <motion.div
                  key={activity.id}
                  variants={itemVariants}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gradient-to-r from-slate-50 to-white p-4 transition hover:bg-gray-50"
                >
                  <div className="rounded-full bg-indigo-100 p-2.5">
                    <ActivityIcon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <ClockIcon className="h-4 w-4 text-gray-400" />
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </motion.main>
  );
}
