import React, { useEffect, useState } from "react";
import DeveloperNavbar from "../components/DeveloperNavbar";
import EarningsCard from "../components/EarningsCard";
import SalesTable from "../components/SalesTable";
import { useDeveloper } from "../context/DeveloperContext";
import * as devApi from "../api/developerApi";
import { FaTimes, FaCheckCircle } from "react-icons/fa";

const Earnings = () => {
  const { earnings, isLoading, fetchEarnings } = useDeveloper();

  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState(50);
  const [payoutMethod, setPayoutMethod] = useState("bank_transfer");
  const [accountDetails, setAccountDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchEarnings();
  }, [fetchEarnings]);

  const handleRequestPayout = async (e) => {
    e.preventDefault();
    setModalError("");
    setSuccessMsg("");
    setSubmitting(true);

    try {
      const res = await devApi.requestPayout({
        amount: Number(amount),
        payoutMethod,
        accountDetails,
      });

      setSuccessMsg(res.message || "Payout requested successfully!");
      fetchEarnings();

      setTimeout(() => {
        setShowModal(false);
        setSuccessMsg("");
      }, 1500);
    } catch (err) {
      setModalError(err.response?.data?.message || "Payout request failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <DeveloperNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-black text-white">Financial Earnings & Payouts</h1>
          <p className="text-xs text-slate-400 mt-1">
            Track net developer revenue payouts, pending withdrawals, and payment history logs.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent" />
          </div>
        ) : (
          <>
            {/* Balance Card */}
            <EarningsCard
              totalEarnings={earnings?.totalEarnings || 0}
              pendingPayouts={earnings?.pendingPayouts || 0}
              availableBalance={earnings?.availableBalance || 0}
              onRequestPayout={() => {
                setAmount(Math.max(50, Math.min(earnings?.availableBalance || 50, 100)));
                setShowModal(true);
              }}
            />

            {/* Payout History */}
            <div className="space-y-4">
              <h3 className="font-bold text-base text-white">Payout History Log</h3>
              <SalesTable items={earnings?.payoutHistory || []} type="payouts" />
            </div>
          </>
        )}
      </main>

      {/* Request Payout Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 relative space-y-4">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <FaTimes />
            </button>

            <h3 className="text-xl font-bold text-white">Request Earnings Payout</h3>
            <p className="text-xs text-slate-400">
              Available for withdrawal:{" "}
              <span className="font-bold text-emerald-400">${earnings?.availableBalance?.toFixed(2)}</span>
            </p>

            {modalError && (
              <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl">
                {modalError}
              </div>
            )}

            {successMsg && (
              <div className="p-3 text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl font-medium flex items-center gap-2">
                <FaCheckCircle /> {successMsg}
              </div>
            )}

            <form onSubmit={handleRequestPayout} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Withdrawal Amount ($ USD, min $50)
                </label>
                <input
                  type="number"
                  min={50}
                  max={earnings?.availableBalance || 50}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Payout Method</label>
                <select
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
                >
                  <option value="bank_transfer">Direct Bank Transfer</option>
                  <option value="stripe">Stripe Connect</option>
                  <option value="razorpay">Razorpay Direct</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Account Details / Bank IBAN / Email
                </label>
                <textarea
                  rows={2}
                  value={accountDetails}
                  onChange={(e) => setAccountDetails(e.target.value)}
                  placeholder="Bank Account Number, Routing Number, or Account Email..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || amount < 50}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-md"
                >
                  {submitting ? "Submitting..." : "Submit Payout Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Earnings;
