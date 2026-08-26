import React from "react";

const SalesTable = ({ items, type = "sales" }) => {
  if (!items || items.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
        No {type === "sales" ? "sales transactions" : "payout history"} recorded yet.
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">{type === "sales" ? "Template" : "Method"}</th>
              <th className="px-4 py-3">{type === "sales" ? "Buyer / Order" : "Account"}</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {items.map((item, idx) => (
              <tr key={item._id || idx} className="hover:bg-slate-800/50 transition">
                <td className="px-4 py-3 font-medium text-slate-300">
                  {new Date(item.createdAt || item.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 font-semibold text-white">
                  {item.templateTitle || item.storeName || item.payoutMethod || "Standard Purchase"}
                </td>
                <td className="px-4 py-3 text-slate-400">
                  {item.buyerEmail || item.accountDetails || item._id?.slice(-8) || "Direct Purchase"}
                </td>
                <td className="px-4 py-3 font-bold text-emerald-400">
                  ${(item.amount || item.price || 0).toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      item.status === "completed" || item.status === "processed"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : item.status === "pending"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    }`}
                  >
                    {item.status || "completed"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesTable;
