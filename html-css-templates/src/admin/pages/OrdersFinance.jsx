import { useState, useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";
import axiosInstance from "../../user/utils/axiosInstance";
import { FaDollarSign, FaFileInvoice, FaChartLine } from "react-icons/fa";

const OrdersFinance = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get("/admin/orders");
        setOrders(res.data || []);
      } catch (err) {
        console.error("Failed to load admin orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const totalVolume = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const platformFees = orders.reduce((sum, o) => sum + (o.platformFee || 0), 0);
  const sellerPayouts = orders.reduce((sum, o) => sum + (o.sellerEarnings || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <AdminNavbar />

      <div className="bg-slate-900 border-b border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-1">
          <h1 className="text-2xl font-black text-white">Orders & Platform Financial Ledger</h1>
          <p className="text-xs text-slate-400">
            Track gross GMV sales volume, 80% seller earnings distribution, and 20% net platform commission.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total GMV Sales</span>
            <div className="font-black text-2xl text-white">${totalVolume.toFixed(2)}</div>
          </div>
          <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Net Platform Commission (20%)</span>
            <div className="font-black text-2xl text-indigo-400">${platformFees.toFixed(2)}</div>
          </div>
          <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Developer Payouts (80%)</span>
            <div className="font-black text-2xl text-emerald-400">${sellerPayouts.toFixed(2)}</div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent" />
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-2">
              <FaFileInvoice className="text-4xl text-slate-700 mx-auto" />
              <p className="text-sm font-semibold">No order transactions found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-4">Transaction ID</th>
                    <th className="p-4">Buyer</th>
                    <th className="p-4">Total Amount</th>
                    <th className="p-4">Platform Fee (20%)</th>
                    <th className="p-4">Developer (80%)</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {orders.map((o) => (
                    <tr key={o._id} className="hover:bg-slate-800/30 transition">
                      <td className="p-4 font-mono font-bold text-white">{o.paymentId}</td>
                      <td className="p-4 text-slate-300">
                        {o.buyer?.name || "Customer"} ({o.buyer?.email})
                      </td>
                      <td className="p-4 font-black text-white">${o.totalAmount}</td>
                      <td className="p-4 font-bold text-indigo-400">${o.platformFee}</td>
                      <td className="p-4 font-bold text-emerald-400">${o.sellerEarnings}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] uppercase font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {o.paymentStatus}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OrdersFinance;
