"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  VideoCameraIcon,
  MicrophoneIcon,
  ChevronRightIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

interface Question {
  id: string;
  text: string;
  userAnswer: string | null;
}

interface Interview {
  id: string;
  role: string;
  company: string;
  difficulty: string;
  questions: Question[];
}

// Support SpeechRecognition for TypeScript
declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

function InterviewSession() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [interview, setInterview] = useState<Interview | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [answer, setAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [speechError, setSpeechError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const recognitionRef = useRef<any>(null);

  // 1. Fetch Interview and setup stream
  useEffect(() => {
    if (!id) {
      setError("No interview ID provided");
      setLoading(false);
      return;
    }

    const fetchInterview = async () => {
      try {
        const res = await fetch(`/api/interview/${id}`);
        const data = await res.json();
        if (data.success) {
          setInterview(data.interview);
        } else {
          setError(data.error || "Failed to load interview");
        }
      } catch (err) {
        setError("Error connecting to server");
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();

    // Start Webcam
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
        }
      })
      .catch((err) => {
        console.error("Camera access denied", err);
        setCameraActive(false);
      });

    // Setup Speech Recognition
    if (typeof window !== "undefined" && window.webkitSpeechRecognition) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setAnswer(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event);
        if (event.error === "not-allowed") {
          setSpeechError("Microphone blocked. Please allow it in browser settings.");
        } else if (event.error === "no-speech") {
          setSpeechError("No speech detected. Try speaking closer to mic.");
        } else {
          setSpeechError(`Microphone error: ${event.error}`);
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }

    // Cleanup video
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [id]);

  // 2. Microphone toggle
  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      setAnswer(""); // Clear previous answer
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  // 3. Save current answer & Next
  const handleSaveAndNext = async () => {
    if (!interview) return;

    setSubmitting(true);
    const currentQuestion = interview.questions[currentQuestionIndex];

    try {
      // Save Answer to Database
      await fetch(`/api/question/${currentQuestion.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userAnswer: answer }),
      });

      // Move to next question or complete
      if (currentQuestionIndex < interview.questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setAnswer(""); // Clear for next question
      } else {
        // Complete interview - Redirect to Feedback
        router.push(`/interview/feedback?id=${id}`);
      }
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-gray-600">Loading interview...</div>;
  if (error) return <div className="p-12 text-center text-red-600">{error}</div>;
  if (!interview || interview.questions.length === 0) return <div className="p-12 text-center text-gray-500">No questions generated for this interview.</div>;

  const currentQuestion = interview.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-12">
      <div className="mx-auto max-w-6xl grid gap-8 lg:grid-cols-3">
        
        {/* Left Column: Visual & Guidance */}
        <div className="lg:col-span-1 space-y-6">
          {/* Camera View */}
          <div className="rounded-2xl border border-gray-200 overflow-hidden bg-black shadow-lg aspect-video relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
            />
            {!cameraActive && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-900">
                <VideoCameraIcon className="h-12 w-12 mr-2" />
                <span>Camera Offline</span>
              </div>
            )}
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              Live Practice
            </div>
          </div>

          {/* Interview Details */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 border-bottom pb-2 mb-4">Focus Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Role</span>
                <span className="font-medium text-gray-900">{interview.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Company</span>
                <span className="font-medium text-gray-900">{interview.company}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Difficulty</span>
                <span className="font-medium text-gray-900">{interview.difficulty}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Room */}
        <div className="lg:col-span-2 space-y-6 flex flex-col justify-center">
          
          {/* Question Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border border-gray-200 bg-white p-8 shadow-md"
            >
              <span className="text-xs font-bold text-indigo-600 tracking-wider">
                QUESTION {currentQuestionIndex + 1} OF {interview.questions.length}
              </span>
              <h2 className="mt-2 text-2xl font-bold text-gray-900 leading-snug">
                {currentQuestion.text}
              </h2>
            </motion.div>
          </AnimatePresence>

          {/* Answer Area */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md flex flex-col gap-4">
            <div className="relative">
              <textarea
                value={answer}
                onChange={(e) => {
                  setAnswer(e.target.value);
                  if (speechError) setSpeechError("");
                }}
                placeholder="Type your answer here, or click the mic to speak..."
                rows={5}
                className="w-full rounded-xl border border-gray-100 bg-gray-50 px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800 transition"
              />
              {speechError && (
                <p className="absolute bottom-3 left-5 text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded-md border border-red-100">
                  {speechError}
                </p>
              )}
            </div>

            <div className="flex justify-between items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleRecording}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 font-medium text-sm transition ${
                  isRecording 
                    ? "bg-red-50 text-red-600 border border-red-200" 
                    : "bg-indigo-50 text-indigo-600 border border-indigo-200"
                }`}
              >
                <MicrophoneIcon className={`h-5 w-5 ${isRecording ? "animate-pulse" : ""}`} />
                {isRecording ? "Stop Recording" : "Speak Answer"}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={handleSaveAndNext}
                disabled={submitting || !answer.trim()}
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-2.5 font-semibold text-white transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-md"
              >
                {submitting ? "Saving..." : currentQuestionIndex < interview.questions.length - 1 ? "Next Question" : "Submit Interview"}
                <ChevronRightIcon className="h-4 w-4" />
              </motion.button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function InterviewSessionPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-600">Loading interview session...</div>}>
      <InterviewSession />
    </Suspense>
  );
}
