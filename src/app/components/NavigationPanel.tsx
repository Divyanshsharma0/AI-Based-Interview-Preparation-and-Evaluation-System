"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  VideoCameraIcon,
  DocumentMagnifyingGlassIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

interface NavStep {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const steps: NavStep[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: HomeIcon,
  },
  {
    label: "Interview Setup",
    href: "/interview/setup",
    icon: VideoCameraIcon,
  },
  {
    label: "Document Analysis",
    href: "/documents",
    icon: DocumentMagnifyingGlassIcon,
  },
];

export default function NavigationPanel() {
  const pathname = usePathname();

  const getCurrentStepIndex = () => {
    return steps.findIndex((step) => step.href === pathname);
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12 flex items-center justify-center gap-4"
    >
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = pathname === step.href;
        const isCompleted = index < currentStepIndex;

        return (
          <motion.div
            key={step.href}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={step.href}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 rounded-full px-6 py-3 font-semibold transition ${
                  isActive
                    ? "bg-blue-500 text-white shadow-lg"
                    : isCompleted
                      ? "bg-green-500 text-white shadow-md"
                      : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                }`}
              >
                {isCompleted ? (
                  <CheckIcon className="h-5 w-5" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
                <span>{step.label}</span>
              </motion.button>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
