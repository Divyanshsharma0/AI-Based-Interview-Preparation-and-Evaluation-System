"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

interface Question {
  id: string;
  text: string;
  userAnswer: string | null;
  score: number | null;
  feedback: string | null;
}

interface Interview {
  id: string;
  role: string;
  company: string;
  overallScore: number | null;
  overallFeedback: string | null;
  questions: Question[];
}

function InterviewFeedback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("No interview ID provided");
      setLoading(false);
      return;
    }

    const triggerEvaluation = async () => {
      try {
        // Trigger Evaluation first
        const evalRes = await fetch(`/api/interview/${id}/evaluate`, {
          method: "POST",
        });
        const evalData = await evalRes.json();

        if (evalData.success) {
          // Fetch updated interview data
          const res = await fetch(`/api/interview/${id}`);
          const data = await res.json();
          if (data.success) {
            setInterview(data.interview);
          } else {
            setError(data.error || "Failed to load updated interview feedback");
          }
        } else {
          setError(evalData.error || "Evaluation trigger failed");
        }
      } catch (err) {
        setError("Error connecting to server for feedback");
      } finally {
        setLoading(false);
      }
    };

    triggerEvaluation();
  }, [id]);

  if (loading) return <div className="p-12 text-center text-gray-600">Generating Actionable Feedback with local AI...</div>;
  if (error) return <div className="p-12 text-center text-red-600">{error}</div>;
  if (!interview) return <div className="p-12 text-center text-gray-500">Interview details missing.</div>;

  const questions = interview.questions || [];

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12 lg:px-12">
      <div className="mx-auto max-w-4xl space-y-10">
        
        {/* Header / Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-gradient-to-br from-indigo-600 to-blue-700 p-8 text-white shadow-xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-100">Performance Report</span>
              <h1 className="mt-1 text-4xl font-extrabold">{interview.role}</h1>
              <p className="mt-1 text-indigo-100">{interview.company} • Offline Practice</p>
            </div>
            
            <div className="flex flex-col items-center justify-center bg-white/10 p-5 rounded-2xl border border-white/20 shadow-inner">
              <div>
                <span className="text-5xl font-black">{Math.round(interview.overallScore || 0)}</span>
                <span className="text-xl text-indigo-200">/100</span>
              </div>
              <span className="text-xs uppercase tracking-widest text-indigo-200 mt-1 font-semibold">Overall Score</span>
            </div>
          </div>

          <p className="mt-6 text-sm text-indigo-50 leading-relaxed bg-black/10 p-4 rounded-xl border border-white/5">
            {interview.overallFeedback || "Evaluation completed."}
          </p>
        </motion.div>

        {/* Detailed Breakdown */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 px-1">Detailed Question Breakdown</h2>

          <div className="flex flex-col gap-6">
            {questions.map((q, index) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col gap-4"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <span className="text-xs font-bold text-indigo-600">QUESTION {index + 1}</span>
                    <h3 className="mt-1 font-semibold text-gray-900 text-lg leading-snug">{q.text}</h3>
                  </div>
                  {q.score !== null && (
                    <div className="rounded-lg bg-gray-50 border border-gray-100 px-3 py-1 text-sm font-bold text-gray-700">
                      Score: {q.score}/100
                    </div>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {/* Your response */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col">
                    <span className="text-xs font-bold text-gray-500 mb-1">YOUR ANSWER</span>
                    <p className="text-sm text-gray-800 leading-relaxed">
                      {q.userAnswer || <span className="text-gray-400 italic">No answer provided.</span>}
                    </p>
                  </div>

                  {/* AI Feedback */}
                  <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50 flex flex-col">
                    <span className="text-xs font-bold text-indigo-600 mb-1">AI FEEDBACK</span>
                    <p className="text-sm text-gray-800 leading-relaxed">
                      {q.feedback || <span className="text-gray-400 italic">Feedback unavailable or generating fallback.</span>}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 font-semibold text-white shadow-md hover:bg-gray-800 transition"
          >
            Back to Dashboard
            <ArrowRightIcon className="h-4 w-4" />
          </motion.button>
        </div>

      </div>
    </div>
  );
}

export default function InterviewFeedbackPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-600">Loading feedback...</div>}>
      <InterviewFeedback />
    </Suspense>
  );
}
