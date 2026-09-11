import React from "react";

const TemplateStatusBadge = ({ status, rejectionReason }) => {
  const configs = {
    pending: {
      label: "Pending Review",
      bg: "bg-amber-500/10 text-amber-500 border-amber-500/30",
      dot: "bg-amber-500",
    },
    approved: {
      label: "Approved & Live",
      bg: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
      dot: "bg-emerald-500",
    },
    rejected: {
      label: "Rejected",
      bg: "bg-rose-500/10 text-rose-500 border-rose-500/30",
      dot: "bg-rose-500",
    },
    archived: {
      label: "Archived",
      bg: "bg-slate-500/10 text-slate-400 border-slate-500/30",
      dot: "bg-slate-500",
    },
  };

  const config = configs[status] || configs.pending;

  return (
    <div className="relative group inline-block">
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        {config.label}
      </span>

      {status === "rejected" && rejectionReason && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-slate-900 text-white text-[11px] rounded-lg shadow-xl border border-slate-700 text-center z-20">
          <span className="font-bold text-rose-400 block mb-0.5">Rejection Reason:</span>
          {rejectionReason}
        </div>
      )}
    </div>
  );
};

export default TemplateStatusBadge;
