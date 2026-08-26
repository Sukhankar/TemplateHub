import React from "react";
import { FaWallet, FaArrowUp, FaClock } from "react-icons/fa";

const EarningsCard = ({ totalEarnings, pendingPayouts, availableBalance, onRequestPayout }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <FaWallet className="text-9xl text-indigo-400" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
          Financial Overview
        </span>
        <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full">
          80% Seller Share
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-4">
        <div>
          <p className="text-xs text-slate-400">Total Lifetime Earnings</p>
          <h3 className="text-3xl font-extrabold text-white mt-1">${totalEarnings?.toFixed(2) || "0.00"}</h3>
        </div>

        <div>
          <p className="text-xs text-slate-400">Pending Payout Processing</p>
          <h3 className="text-3xl font-extrabold text-amber-400 mt-1 flex items-center gap-2">
            <FaClock className="text-lg" /> ${pendingPayouts?.toFixed(2) || "0.00"}
          </h3>
        </div>

        <div>
          <p className="text-xs text-slate-400">Available Balance for Withdrawal</p>
          <h3 className="text-3xl font-extrabold text-emerald-400 mt-1">${availableBalance?.toFixed(2) || "0.00"}</h3>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
        <p className="text-xs text-slate-400">
          Minimum withdrawal threshold: <span className="font-semibold text-slate-200">$50.00</span>
        </p>

        <button
          onClick={onRequestPayout}
          disabled={!availableBalance || availableBalance < 50}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
            !availableBalance || availableBalance < 50
              ? "bg-slate-800 text-slate-500 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-950/40"
          }`}
        >
          <FaArrowUp /> Request Payout
        </button>
      </div>
    </div>
  );
};

export default EarningsCard;
