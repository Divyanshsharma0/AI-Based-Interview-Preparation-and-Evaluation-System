"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserIcon,
  CogIcon,
  ShieldCheckIcon,
  ArrowUpTrayIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

interface UserSettings {
  name: string;
  email: string;
  profilePicture: string | null;
  defaultRole: string;
  defaultDifficulty: "Easy" | "Medium" | "Hard";
  defaultInterviewType: "Technical" | "Behavioral" | "Mixed";
  feedbackStyle: "Strict" | "Balanced" | "Friendly";
}

const navItems = [
  { id: "profile", label: "Profile", icon: UserIcon },
  { id: "preferences", label: "Preferences", icon: CogIcon },
  { id: "privacy", label: "Privacy", icon: ShieldCheckIcon },
];

const roles = ["Frontend Developer", "Backend Developer", "Full Stack", "Data Scientist", "DevOps Engineer"];
const interviewTypes = ["Technical", "Behavioral", "Mixed"];
const feedbackStyles = ["Strict", "Balanced", "Friendly"];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [settings, setSettings] = useState<UserSettings>({
    name: "Divyansh",
    email: "divyansh@example.com",
    profilePicture: null,
    defaultRole: "Frontend Developer",
    defaultDifficulty: "Medium",
    defaultInterviewType: "Technical",
    feedbackStyle: "Balanced",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<"history" | "account" | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSettingChange = (key: keyof UserSettings, value: any) => {
    setSettings({ ...settings, [key]: value });
    setSaveSuccess(false);
  };

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleSettingChange("profilePicture", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gray-50 lg:ml-64"
    >
      <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600">
            Manage your profile, preferences, and privacy
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Left Navigation */}
          <div className="lg:col-span-1">
            <motion.nav
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl border border-gray-200 bg-white p-4"
            >
              <div className="space-y-2">
                {navItems.map((item) => {
                  const ItemIcon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      whileHover={{ x: 4 }}
                      className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                        isActive
                          ? "bg-indigo-50 text-indigo-600"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <ItemIcon className="h-5 w-5" />
                      {item.label}
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="ml-auto h-2 w-2 rounded-full bg-indigo-600"
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.nav>
          </div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <AnimatePresence mode="wait">
              {/* PROFILE SECTION */}
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="rounded-xl border border-gray-200 bg-white p-8"
                >
                  <h2 className="mb-6 text-2xl font-bold text-gray-900">
                    Profile
                  </h2>

                  <div className="space-y-6">
                    {/* Profile Picture */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Profile Picture
                      </label>
                      <div className="flex items-center gap-6">
                        <div className="relative h-16 w-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-2xl font-bold text-white overflow-hidden">
                          {settings.profilePicture ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={settings.profilePicture}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            "D"
                          )}
                        </div>
                        <div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            aria-label="Upload profile picture"
                            className="hidden"
                          />
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                          >
                            <ArrowUpTrayIcon className="h-4 w-4" />
                            Upload Photo
                          </motion.button>
                          <p className="text-xs text-gray-500 mt-2">
                            JPG, PNG up to 5MB
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Name */}
                    <div>
                      <label htmlFor="full-name" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Full Name
                      </label>
                      <input
                        id="full-name"
                        type="text"
                        value={settings.name}
                        onChange={(e) =>
                          handleSettingChange("name", e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email Address
                      </label>
                      <input
                        id="email-address"
                        type="email"
                        value={settings.email}
                        disabled
                        className="w-full rounded-lg border border-gray-200 px-4 py-2.5 bg-gray-50 text-gray-600 outline-none"
                      />
                      <p className="text-xs text-gray-500 mt-1.5">
                        Contact support to change email address
                      </p>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="mt-8 flex justify-end gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSave}
                      className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
                    >
                      {saveSuccess ? (
                        <>
                          <CheckCircleIcon className="h-4 w-4" />
                          Saved
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* PREFERENCES SECTION */}
              {activeTab === "preferences" && (
                <motion.div
                  key="preferences"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="rounded-xl border border-gray-200 bg-white p-8"
                >
                  <h2 className="mb-6 text-2xl font-bold text-gray-900">
                    Preferences
                  </h2>

                  <div className="space-y-8">
                    {/* Interview Defaults */}
                    <div>
                      <h3 className="mb-4 text-lg font-semibold text-gray-900">
                        Interview Defaults
                      </h3>
                      <div className="space-y-4">
                        {/* Default Role */}
                        <div>htmlFor="default-role" 
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Default Role
                          </label>
                          <select
                            id="default-role"
                            value={settings.defaultRole}
                            onChange={(e) =>
                              handleSettingChange("defaultRole", e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-400"
                          >
                            {roles.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Default Difficulty */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Default Difficulty
                          </label>
                          <div className="flex gap-3">
                            {["Easy", "Medium", "Hard"].map((level) => (
                              <motion.button
                                key={level}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() =>
                                  handleSettingChange(
                                    "defaultDifficulty",
                                    level as "Easy" | "Medium" | "Hard"
                                  )
                                }
                                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                                  settings.defaultDifficulty === level
                                    ? "bg-indigo-600 text-white"
                                    : "border border-gray-200 text-gray-700 hover:border-gray-300"
                                }`}
                              >
                                {level}
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        {/* Default Interview Type */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Default Interview Type
                          </label>
                          <div className="flex gap-3">
                            {interviewTypes.map((type) => (
                              <motion.button
                                key={type}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() =>
                                  handleSettingChange(
                                    "defaultInterviewType",
                                    type as "Technical" | "Behavioral" | "Mixed"
                                  )
                                }
                                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                                  settings.defaultInterviewType === type
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
                    </div>

                    {/* AI Preferences */}
                    <div className="border-t border-gray-200 pt-8">
                      <h3 className="mb-4 text-lg font-semibold text-gray-900">
                        AI Preferences
                      </h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Feedback Style
                        </label>
                        <div className="space-y-2">
                          {feedbackStyles.map((style) => {
                            const radioId = `feedback-${style
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`;
                            return (
                              <motion.label
                                key={style}
                                htmlFor={radioId}
                                whileHover={{ x: 2 }}
                                className={`flex items-center gap-3 rounded-lg px-4 py-3 cursor-pointer transition border ${
                                  settings.feedbackStyle === style
                                    ? "border-indigo-200 bg-indigo-50"
                                    : "border-gray-200 hover:bg-gray-50"
                                }`}
                              >
                                <input
                                  id={radioId}
                                  type="radio"
                                  name="feedbackStyle"
                                  value={style}
                                  checked={settings.feedbackStyle === style}
                                  onChange={(e) =>
                                    handleSettingChange(
                                      "feedbackStyle",
                                      e.target.value as
                                        | "Strict"
                                        | "Balanced"
                                        | "Friendly"
                                    )
                                  }
                                  className="cursor-pointer"
                                />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {style}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {style === "Strict"
                                      ? "Direct feedback focusing on areas to improve"
                                      : style === "Balanced"
                                        ? "Mix of positive feedback and constructive criticism"
                                        : "Encouraging feedback with supportive tone"}
                                  </p>
                                </div>
                              </motion.label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="mt-8 flex justify-end gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSave}
                      className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
                    >
                      {saveSuccess ? (
                        <>
                          <CheckCircleIcon className="h-4 w-4" />
                          Saved
                        </>
                      ) : (
                        "Save Preferences"
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* PRIVACY SECTION */}
              {activeTab === "privacy" && (
                <motion.div
                  key="privacy"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="rounded-xl border border-gray-200 bg-white p-8"
                >
                  <h2 className="mb-6 text-2xl font-bold text-gray-900">
                    Privacy & Data
                  </h2>

                  <div className="space-y-6">
                    {/* Clear History */}
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className="rounded-lg border border-amber-200 bg-amber-50 p-6"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <ExclamationTriangleIcon className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h3 className="font-semibold text-amber-900">
                              Clear Interview History
                            </h3>
                            <p className="text-sm text-amber-800 mt-1">
                              Remove all interview records and feedback. This
                              action cannot be undone.
                            </p>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowConfirmModal("history")}
                          className="flex-shrink-0 rounded-lg border border-amber-300 px-4 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-100"
                        >
                          Clear
                        </motion.button>
                      </div>
                    </motion.div>

                    {/* Delete Account */}
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className="rounded-lg border border-red-200 bg-red-50 p-6"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <TrashIcon className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h3 className="font-semibold text-red-900">
                              Delete Account
                            </h3>
                            <p className="text-sm text-red-800 mt-1">
                              Permanently delete your account and all associated
                              data. This action cannot be undone.
                            </p>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowConfirmModal("account")}
                          className="flex-shrink-0 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
                        >
                          Delete
                        </motion.button>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Confirmation Modals */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
            >
              {showConfirmModal === "history" ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <ExclamationTriangleIcon className="h-6 w-6 text-amber-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Clear History?
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    This will permanently delete all your interview records and
                    feedback. This action cannot be undone.
                  </p>
                  <div className="flex gap-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowConfirmModal(null)}
                      className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setShowConfirmModal(null);
                        // Handle clear history action
                      }}
                      className="flex-1 rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-amber-700"
                    >
                      Clear History
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <TrashIcon className="h-6 w-6 text-red-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Delete Account?
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    This will permanently delete your account and all associated
                    data. This action cannot be undone.
                  </p>
                  <div className="flex gap-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowConfirmModal(null)}
                      className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setShowConfirmModal(null);
                        // Handle delete account action
                      }}
                      className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
                    >
                      Delete Account
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}
