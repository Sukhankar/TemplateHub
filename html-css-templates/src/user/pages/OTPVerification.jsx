import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const OTPVerification = () => {
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get("email") || "";
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  const inputRefs = useRef([]);
  const { verifyEmail, resendOTP } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleDigitChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-advance focus
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await verifyEmail(email, fullOtp);
      setSuccessMsg(res.message || "Email verified successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed. Please check your OTP.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setError("");
    setSuccessMsg("");

    try {
      const res = await resendOTP(email);
      setSuccessMsg(res.message || "New OTP sent to your email.");
      setResendTimer(60);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-2xl">
            ✉️
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Verify Your Email</h2>
          <p className="text-sm text-gray-500 mt-1">
            We sent a 6-digit OTP code to <br />
            <span className="font-semibold text-gray-700">{email || "your registered email"}</span>
          </p>
        </div>

        {!initialEmail && (
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email"
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between gap-2" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-xl font-bold border-2 rounded-xl outline-none transition-all border-gray-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 text-gray-800"
              />
            ))}
          </div>

          {error && (
            <div className="p-3 text-xs bg-red-50 text-red-600 rounded-lg border border-red-200 text-center">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="p-3 text-xs bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-200 text-center font-medium">
              {successMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || otp.join("").length !== 6}
            className={`w-full py-3 rounded-xl text-sm font-semibold transition-all shadow-md ${
              submitting || otp.join("").length !== 6
                ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200"
            }`}
          >
            {submitting ? "Verifying..." : "Verify Code"}
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-gray-500 space-y-2">
          <p>
            Didn't receive code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={resendTimer > 0}
              className={`font-semibold ${
                resendTimer > 0 ? "text-gray-400 cursor-not-allowed" : "text-indigo-600 hover:underline"
              }`}
            >
              Resend OTP {resendTimer > 0 && `(${resendTimer}s)`}
            </button>
          </p>

          <p>
            Wrong email?{" "}
            <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
              Register again
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
