import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Mail,
  Send,
  Loader2,
  AlertCircle,
  Store,
  User,
  ArrowLeft,
  MessageSquare,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useToastContext } from "@/components/ToastProvider";
import { sendEmail } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import type { Buyer } from "@/types";

export default function EmailCampaigns() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToastContext();

  const buyerFromState = (location.state as { buyer: Buyer } | null)?.buyer;

  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailNotConfigured, setEmailNotConfigured] = useState(false);

  useEffect(() => {
    if (buyerFromState) {
      setBuyerName(buyerFromState.name);
      setRecipient(
        buyerFromState.email && buyerFromState.email !== "Email not available"
          ? buyerFromState.email
          : ""
      );
      setSubject(`Home Decor Wholesale Inquiry — Partnership Opportunity`);
      setMessage(
        `Dear ${buyerFromState.name} Team,\n\nI hope this message finds you well. I am reaching out to introduce our home decor product line, which I believe would be a great fit for your store.\n\nWe offer a curated selection of high-quality home decor items at competitive wholesale prices. I would love to discuss potential partnership opportunities and share our product catalog with you.\n\nWould you be open to a brief conversation this week?\n\nBest regards,\n[Your Name]\n[Your Company]\n[Your Phone]`
      );
    }
  }, [buyerFromState]);

  async function handleSend() {
    if (!recipient.trim() || !subject.trim() || !message.trim()) {
      showToast("Please fill in all fields before sending.", "error");
      return;
    }

    setLoading(true);
    setEmailNotConfigured(false);

    try {
      const result = await sendEmail(recipient, subject, message, buyerName);

      // Log to email history
      await supabase.from("email_history").insert({
        buyer_name: buyerName,
        recipient: recipient,
        subject: subject,
        message: message,
        status: result.success ? "sent" : "failed",
        error_detail: result.error || null,
      });

      if (result.notConfigured) {
        setEmailNotConfigured(true);
        showToast("Email provider not configured.", "error");
      } else if (result.success) {
        showToast("Email sent successfully!", "success");
        setRecipient("");
        setSubject("");
        setMessage("");
        setBuyerName("");
      } else {
        showToast(result.error || "Failed to send email.", "error");
      }
    } catch {
      showToast("Failed to send email. Please try again.", "error");
      await supabase.from("email_history").insert({
        buyer_name: buyerName,
        recipient: recipient,
        subject: subject,
        message: message,
        status: "failed",
        error_detail: "Network error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="border-b border-slate-200 bg-white px-8 py-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-3 flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500">
            <Mail className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Email Campaigns
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">
              Compose and send outreach emails to potential buyers
            </p>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="mx-auto max-w-3xl">
          {/* Recipient info card */}
          {buyerName && (
            <div className="mb-6 flex items-center gap-4 rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
                <Store className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  Sending to
                </p>
                <p className="text-sm font-bold text-slate-900">{buyerName}</p>
              </div>
            </div>
          )}

          {/* Email not configured warning */}
          {emailNotConfigured && (
            <div className="mb-6 flex items-start gap-4 rounded-xl border border-amber-200 bg-amber-50 p-5 animate-fade-in">
              <AlertCircle className="h-6 w-6 flex-shrink-0 text-amber-600" />
              <div>
                <h3 className="text-sm font-semibold text-amber-900">
                  Email Provider Not Configured
                </h3>
                <p className="mt-1 text-sm text-amber-800">
                  To send emails, configure an email provider (Resend
                  recommended) using environment variables.
                </p>
              </div>
            </div>
          )}

          {/* Composer */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-slate-900">
              <MessageSquare className="h-5 w-5 text-slate-400" />
              Email Composer
            </h2>

            <div className="space-y-5">
              {/* Buyer name */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Business Name
                </label>
                <div className="relative">
                  <Store className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="Business name"
                    className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Recipient */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Recipient Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="recipient@example.com"
                    className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  />
                </div>
                {buyerFromState &&
                  buyerFromState.email === "Email not available" && (
                    <p className="mt-1.5 text-xs text-amber-600">
                      This business doesn't have an email on file. Enter a known
                      email address manually.
                    </p>
                  )}
              </div>

              {/* Subject */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Email subject"
                  className="w-full rounded-lg border border-slate-200 py-2.5 px-4 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                />
              </div>

              {/* Message */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={12}
                  placeholder="Write your message here..."
                  className="w-full resize-none rounded-lg border border-slate-200 py-3 px-4 text-sm leading-relaxed focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                />
              </div>

              {/* Send button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSend}
                  disabled={loading}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                  {loading ? "Sending..." : "Send Email"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
