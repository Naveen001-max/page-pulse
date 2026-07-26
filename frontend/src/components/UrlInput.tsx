// Developed by Naveen Choudhary
// Project: Page Pulse
// Built for Digital Heroes Training Task

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, ArrowRight, AlertCircle } from "lucide-react";
import { validateUrl } from "../lib/api";

interface UrlInputProps {
  onAnalyze: (url: string) => void;
  loading: boolean;
}

export default function UrlInput({ onAnalyze, loading }: UrlInputProps) {
  const [value, setValue] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const err = validateUrl(value);
    if (err) {
      setValidationError(err);
      inputRef.current?.focus();
      return;
    }
    setValidationError(null);
    const url = value.trim().startsWith("http") ? value.trim() : `https://${value.trim()}`;
    onAnalyze(url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`
          relative flex items-center rounded-2xl overflow-hidden
          glass gradient-border
          transition-all duration-300
          ${validationError ? "ring-1 ring-red-500/40" : ""}
          ${loading ? "opacity-80 pointer-events-none" : ""}
        `}
      >
        <div className="pl-5 pr-3 flex-shrink-0">
          <Globe
            size={18}
            className="text-indigo-400"
            aria-hidden="true"
          />
        </div>

        <input
          ref={inputRef}
          type="url"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (validationError) setValidationError(null);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Enter any website URL (e.g. stripe.com)"
          disabled={loading}
          aria-label="Website URL to audit"
          aria-describedby={validationError ? "url-error" : undefined}
          className="
            flex-1 bg-transparent py-4 pr-2 text-sm
            text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
            outline-none border-none
            disabled:cursor-not-allowed
          "
        />

        <div className="pr-2">
          <motion.button
            onClick={handleSubmit}
            disabled={loading || !value.trim()}
            aria-label="Analyze website"
            whileTap={{ scale: 0.95 }}
            className="
              flex items-center gap-2 px-5 py-2.5 rounded-xl
              bg-indigo-600 hover:bg-indigo-500
              disabled:opacity-50 disabled:cursor-not-allowed
              text-white text-sm font-medium
              transition-colors duration-200
              cursor-pointer
            "
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
                Scanning
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Analyze
                <ArrowRight size={14} />
              </span>
            )}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {validationError && (
          <motion.p
            id="url-error"
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2 flex items-center gap-1.5 text-xs text-red-400 pl-1"
          >
            <AlertCircle size={12} />
            {validationError}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
