"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  VideoCameraIcon,
  MicrophoneIcon,
  CheckCircleIcon,
  DocumentArrowUpIcon,
} from "@heroicons/react/24/outline";
import NavigationPanel from "../../components/NavigationPanel";

interface InterviewSetup {
  template: string;
  role: string;
  company: string;
  interviewType: string;
  difficulty: string;
  questionCount: number;
  aiInstructions: string;
  resumeFile: File | null;
}

const templates = [
  {
    id: "frontend",
    name: "Frontend Interview",
    role: "Frontend Developer",
    difficulty: "Medium",
    questions: 5,
  },
  {
    id: "dsa",
    name: "DSA Practice",
    role: "Software Engineer",
    difficulty: "Hard",
    questions: 8,
  },
  {
    id: "hr",
    name: "HR Round",
    role: "General",
    difficulty: "Easy",
    questions: 5,
  },
  {
    id: "custom",
    name: "Custom",
    role: "",
    difficulty: "Medium",
    questions: 5,
  },
];

const companies = [
  "Google",
  "Amazon",
  "Microsoft",
  "Meta",
  "Apple",
  "Startup",
  "Custom",
];

export default function InterviewSetup() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  const [setup, setSetup] = useState<InterviewSetup>({
    template: "",
    role: "",
    company: "",
    interviewType: "",
    difficulty: "Medium",
    questionCount: 5,
    aiInstructions: "",
    resumeFile: null,
  });

  const [isStarting, setIsStarting] = useState(false);

  const handleStartInterview = async () => {
    setIsStarting(true);
    try {
      const res = await fetch("/api/interview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: setup.role,
          company: setup.company || "General",
          difficulty: setup.difficulty,
          interviewType: setup.interviewType || "Technical",
          questionCount: setup.questionCount,
        }),
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/interview/session?id=${data.interviewId}`);
      } else {
        alert(data.error || "Failed to start interview");
      }
    } catch (err) {
      console.error("Start failed", err);
    } finally {
      setIsStarting(false);
    }
  };

  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [micStatus, setMicStatus] = useState<"idle" | "connected" | "error">(
    "idle"
  );

  // Start webcam
  useEffect(() => {
    if (currentStep === 4 && !cameraActive) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setCameraActive(true);
            setMicStatus("connected");
          }
        })
        .catch(() => {
          setCameraActive(false);
          setMicStatus("error");
        });
    }
  }, [currentStep]);

  // Stop webcam on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (
          videoRef.current.srcObject as MediaStream
        ).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setSetup({
        ...setup,
        template: templateId,
        role: template.role,
        difficulty: template.difficulty,
        questionCount: template.questions,
      });
    }
  };

  const estimatedTime = setup.questionCount * 5; // 5 min per question

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-gray-50 lg:ml-64">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8">
        {/* Navigation Panel */}
        <NavigationPanel />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-3xl font-bold text-gray-900">Interview Setup</h1>
          <p className="mt-2 text-gray-600">
            Step {currentStep + 1} of 5 — Configure your interview
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div className="mb-8 h-1.5 overflow-hidden rounded-full bg-gray-200">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / 5) * 100}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-indigo-600 to-blue-600"
          />
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <motion.div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 0: Template Selection */}
              {currentStep === 0 && (
                <motion.div
                  key="step-0"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <div>
                    <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                      Choose a Template
                    </h2>
                    <p className="text-gray-600">
                      Select a template to get started quickly
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {templates.map((template) => (
                      <motion.button
                        key={template.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleTemplateSelect(template.id)}
                        className={`rounded-xl border-2 p-6 text-left transition ${
                          setup.template === template.id
                            ? "border-indigo-600 bg-indigo-50"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <h3 className="font-semibold text-gray-900">
                          {template.name}
                        </h3>
                        <p className="mt-2 text-sm text-gray-600">
                          Role: {template.role || "Custom"}
                        </p>
                        <p className="text-sm text-gray-600">
                          Difficulty: {template.difficulty}
                        </p>
                        {setup.template === template.id && (
                          <div className="mt-4 inline-flex rounded-full bg-indigo-600 px-3 py-1 text-xs font-medium text-white">
                            Selected
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 1: Basics */}
              {currentStep === 1 && (
                <motion.div
                  key="step-1"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <div>
                    <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                      Basic Information
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {/* Role */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Role
                      </label>
                      <input
                        type="text"
                        value={setup.role}
                        onChange={(e) =>
                          setSetup({ ...setup, role: e.target.value })
                        }
                        placeholder="e.g., Full Stack Engineer"
                        className="w-full rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                    </div>

                    {/* Company */}
                    <div>
                      <label htmlFor="setup-company" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Company
                      </label>
                      <select
                        id="setup-company"
                        value={setup.company}
                        onChange={(e) =>
                          setSetup({ ...setup, company: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-400"
                      >
                        <option value="">Select company</option>
                        {companies.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Interview Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Interview Type
                      </label>
                      <div className="flex gap-3">
                        {["Technical", "Behavioral", "Mixed"].map((type) => (
                          <motion.button
                            key={type}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              setSetup({
                                ...setup,
                                interviewType: type,
                              })
                            }
                            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
                              setup.interviewType === type
                                ? "bg-indigo-600 text-white"
                                : "border border-gray-200 text-gray-700 hover:border-gray-300"
                            }`}
                          >
                            {type}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Difficulty & Questions */}
              {currentStep === 2 && (
                <motion.div
                  key="step-2"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <div>
                    <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                      Difficulty & Questions
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {/* Difficulty */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Difficulty Level
                      </label>
                      <div className="flex gap-3">
                        {["Easy", "Medium", "Hard"].map((level) => (
                          <motion.button
                            key={level}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              setSetup({
                                ...setup,
                                difficulty: level,
                              })
                            }
                            className={`flex-1 rounded-lg px-4 py-3 text-sm font-medium transition ${
                              setup.difficulty === level
                                ? "bg-indigo-600 text-white"
                                : "border border-gray-200 text-gray-700 hover:border-gray-300"
                            }`}
                          >
                            {level}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Question Count with +/- Buttons */}
                    <div>
                      <label className="mb-4 block text-sm font-medium text-gray-700">
                        Number of Questions
                      </label>
                      <div className="flex items-center justify-center gap-4">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            setSetup({
                              ...setup,
                              questionCount: Math.max(5, setup.questionCount - 1),
                            })
                          }
                          disabled={setup.questionCount <= 5}
                          className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-gray-200 text-xl font-bold text-gray-700 transition hover:border-indigo-400 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          −
                        </motion.button>

                        <div className="flex flex-col items-center gap-2">
                          <span className="text-5xl font-bold text-indigo-600">
                            {setup.questionCount}
                          </span>
                          <span className="text-xs text-gray-500">questions</span>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            setSetup({
                              ...setup,
                              questionCount: Math.min(15, setup.questionCount + 1),
                            })
                          }
                          disabled={setup.questionCount >= 15}
                          className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-gray-200 text-xl font-bold text-gray-700 transition hover:border-indigo-400 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          +
                        </motion.button>
                      </div>
                      <div className="mt-4 text-center text-xs text-gray-500">
                        Min: 5 | Max: 15
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Customization */}
              {currentStep === 3 && (
                <motion.div
                  key="step-3"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <div>
                    <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                      Customization
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {/* AI Instructions */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        AI Instructions
                      </label>
                      <textarea
                        value={setup.aiInstructions}
                        onChange={(e) =>
                          setSetup({
                            ...setup,
                            aiInstructions: e.target.value,
                          })
                        }
                        placeholder="Ask real-world questions and provide follow-ups..."
                        rows={4}
                        className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                      <p className="mt-2 text-xs text-gray-500">
                        Guide the AI to ask more specific or realistic questions
                      </p>
                    </div>

                    {/* Resume Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Upload Resume (Optional)
                      </label>
                      <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
                        <DocumentArrowUpIcon className="mx-auto h-8 w-8 text-gray-400" />
                        <p className="mt-2 text-sm font-medium text-gray-700">
                          {setup.resumeFile
                            ? setup.resumeFile.name
                            : "Click or drag to upload PDF"}
                        </p>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) =>
                            setSetup({
                              ...setup,
                              resumeFile: e.target.files?.[0] || null,
                            })
                          }
                          className="hidden"
                          id="resume-upload"
                        />
                        <label
                          htmlFor="resume-upload"
                          className="mt-3 inline-block cursor-pointer text-sm font-medium text-indigo-600 hover:text-indigo-700"
                        >
                          Choose file
                        </label>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Setup Check */}
              {currentStep === 4 && (
                <motion.div
                  key="step-4"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <div>
                    <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                      Setup Check
                    </h2>
                    <p className="text-gray-600">Verify your camera and mic</p>
                  </div>

                  {/* Camera Preview */}
                  <div className="rounded-lg border border-gray-200 overflow-hidden bg-black">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="h-64 w-full object-cover"
                    />
                  </div>

                  {/* Status Indicators */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                      <div className="flex items-center gap-3">
                        <VideoCameraIcon className="h-6 w-6 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Camera
                          </p>
                          <p
                            className={`text-xs ${
                              cameraActive
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {cameraActive ? "Connected" : "Not found"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                      <div className="flex items-center gap-3">
                        <MicrophoneIcon className="h-6 w-6 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Microphone
                          </p>
                          <p
                            className={`text-xs ${
                              micStatus === "connected"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {micStatus === "connected"
                              ? "Connected"
                              : "Not available"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Summary Card */}
            {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl border border-gray-200 bg-white p-6"
              >
                <h3 className="mb-4 font-semibold text-gray-900">
                  Interview Summary
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Role</span>
                    <span className="font-medium text-gray-900">
                      {setup.role || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Company</span>
                    <span className="font-medium text-gray-900">
                      {setup.company || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type</span>
                    <span className="font-medium text-gray-900">
                      {setup.interviewType || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Difficulty</span>
                    <span className="font-medium text-gray-900">
                      {setup.difficulty}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Questions</span>
                    <span className="font-medium text-gray-900">
                      {setup.questionCount}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <span className="text-gray-600 font-medium">
                      Est. Time
                    </span>
                    <span className="font-semibold text-indigo-600">
                      ~{estimatedTime} min
                    </span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStartInterview}
                  disabled={isStarting}
                  className="mt-6 w-full rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
                >
                  {isStarting ? "Initializing..." : "Start Interview"}
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Navigation Buttons */}
        <motion.div className="mt-12 flex justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-6 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeftIcon className="h-5 w-5" />
            Previous
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
            disabled={currentStep === 4}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-2.5 font-medium text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
            <ChevronRightIcon className="h-5 w-5" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
