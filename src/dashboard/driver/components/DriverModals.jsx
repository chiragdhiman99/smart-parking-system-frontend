import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";

const CancelModal = ({ cancelModal, setCancelModal, handleCancelBooking }) => (
  <AnimatePresence>
    {cancelModal && (
      <>
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setCancelModal(null)}
        />
        <motion.div
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm px-4"
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: "spring", stiffness: 320, damping: 25 },
          }}
          exit={{
            opacity: 0,
            scale: 0.9,
            y: 10,
            transition: { duration: 0.18 },
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-red-400 via-red-500 to-rose-500" />
            <div className="p-6">
              <motion.div
                className="w-14 h-14 rounded-full bg-red-50 border-2 border-red-100 flex items-center justify-center mx-auto mb-4"
                initial={{ scale: 0, rotate: -20 }}
                animate={{
                  scale: 1,
                  rotate: 0,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 20,
                    delay: 0.1,
                  },
                }}
              >
                <svg
                  className="w-7 h-7 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              </motion.div>

              <motion.div
                className="text-center mb-5"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }}
              >
                <h2 className="text-lg font-bold text-gray-800 mb-1">
                  Cancel Booking?
                </h2>
                <p className="text-sm text-gray-500">
                  Are you sure you want to cancel?
                </p>
              </motion.div>

              <motion.div
                className="flex gap-3"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.22 } }}
              >
                <button
                  onClick={() => setCancelModal(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 cursor-pointer text-sm font-semibold hover:bg-gray-50 active:scale-95 transition-all duration-150"
                >
                  No
                </button>
                <motion.button
                  onClick={() => {
                    handleCancelBooking(cancelModal._id);
                    setCancelModal(null);
                  }}
                  className="flex-1 cursor-pointer py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold shadow-md shadow-red-200 hover:bg-red-600 active:scale-95 transition-all duration-150"
                  whileTap={{ scale: 0.96 }}
                >
                  Yes, Cancel
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const ReportModal = ({
  reportModal,
  setReportModal,
  reportText,
  setReportText,
  handleReportSubmit,
  reportSubmitting,
}) => (
  <AnimatePresence>
    {reportModal && (
      <>
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            setReportModal(null);
            setReportText("");
          }}
        />
        <motion.div
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm px-4"
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: "spring", stiffness: 320, damping: 25 },
          }}
          exit={{
            opacity: 0,
            scale: 0.9,
            y: 10,
            transition: { duration: 0.18 },
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-orange-400 via-orange-500 to-red-400" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🚨</span>
                  <h2 className="text-base font-black text-gray-800">
                    Report an Issue
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setReportModal(null);
                    setReportText("");
                  }}
                  className="text-gray-400 hover:text-gray-600 text-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-gray-400 mb-4">
                Slot {reportModal.slot} · {reportModal.date} ·{" "}
                {reportModal.fromTime} – {reportModal.toTime}
              </p>

              <textarea
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                placeholder="Describe the issue you faced..."
                rows={4}
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-orange-400 resize-none transition-all"
              />

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    setReportModal(null);
                    setReportText("");
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 cursor-pointer text-sm font-semibold hover:bg-gray-50 active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <motion.button
                  onClick={handleReportSubmit}
                  disabled={!reportText.trim() || reportSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-bold shadow-md shadow-orange-200 hover:bg-orange-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  whileTap={{ scale: 0.96 }}
                >
                  {reportSubmitting ? "Sending..." : "Submit Report"}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const ReviewModal = ({
  reviewModal,
  setReviewModal,
  reviewRating,
  setReviewRating,
  reviewComment,
  setReviewComment,
  handlereviewsubmit,
}) => {
  if (!reviewModal) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-base font-black text-gray-900">
            Rate Your Experience
          </p>
          <button
            onClick={() => setReviewModal(null)}
            className="text-gray-400 hover:text-gray-600 text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-gray-400 mb-4">
          Slot {reviewModal.slot} · {reviewModal.date}
        </p>

        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setReviewRating(star)}
              className="text-2xl cursor-pointer transition-transform hover:scale-110"
            >
              {star <= reviewRating ? "⭐" : "☆"}
            </button>
          ))}
        </div>

        <textarea
          value={reviewComment}
          onChange={(e) => setReviewComment(e.target.value)}
          placeholder="Share your experience..."
          rows={3}
          className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-green-400 resize-none"
        />

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setReviewModal(null)}
            className="flex-1 bg-gray-100 text-gray-600 font-bold py-3 rounded-xl text-sm cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handlereviewsubmit}
            className="flex-1 bg-[#22C55E] text-white font-bold py-3 rounded-xl text-sm cursor-pointer hover:bg-[#16A34A]"
          >
            Submit Review
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export { CancelModal, ReportModal, ReviewModal };
