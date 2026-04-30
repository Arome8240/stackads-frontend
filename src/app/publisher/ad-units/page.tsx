"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AddCircle,
  Eye,
  Edit2,
  PauseCircle,
  PlayCircle,
  CloseCircle,
  Monitor,
} from "iconsax-react";
import Toast from "@/components/dashboard/Toast";
import EmptyState from "@/components/ui/EmptyState";
import type { ToastType } from "@/components/dashboard/Toast";
import { adUnits as initialUnits } from "@/lib/mock-data";
import type { AdUnit } from "@/types";

const formats = ["Banner", "Native", "Video"] as const;
const sizes = ["728x90", "300x250", "320x50", "N/A"] as const;

export default function AdUnitsPage() {
  const [units, setUnits] = useState<AdUnit[]>(initialUnits);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    format: "Banner" as AdUnit["format"],
    size: "728x90" as AdUnit["size"],
    placement: "",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const toggleStatus = (id: string) => {
    setUnits((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "Active" ? "Paused" : "Active" }
          : u,
      ),
    );
    const unit = units.find((u) => u.id === id);
    setToast({
      message: `"${unit?.name}" ${unit?.status === "Active" ? "paused" : "resumed"}.`,
      type: "info",
    });
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.placement) {
      setToast({ message: "Fill in all fields.", type: "error" });
      return;
    }
    const newUnit: AdUnit = {
      id: `au${Date.now()}`,
      name: form.name,
      format: form.format,
      size: form.size,
      placement: form.placement,
      status: "Active",
      impressions: 0,
      clicks: 0,
      ctr: 0,
      earnings: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setUnits((prev) => [newUnit, ...prev]);
    setShowForm(false);
    setForm({ name: "", format: "Banner", size: "728x90", placement: "" });
    setToast({
      message: `Ad unit "${newUnit.name}" created!`,
      type: "success",
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-xl font-bold text-white">Ad Units</h2>
          <p className="text-sm text-white/40 mt-0.5">
            {units.length} ad units registered
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-[#4ade80] to-[#22d3ee] text-black text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <AddCircle size={18} color="#000" variant="Bold" />
          Add Ad Unit
        </button>
      </motion.div>

      {/* Add form modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="glass rounded-2xl border border-white/10 p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-white">
                  New Ad Unit
                </h3>
                <button onClick={() => setShowForm(false)}>
                  <CloseCircle size={20} color="#f87171" />
                </button>
              </div>
              <form onSubmit={handleAdd} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-white/60">
                    Unit Name <span className="text-[#4ade80]">*</span>
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="e.g. Homepage Hero"
                    className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#4ade80]/50 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-white/60">
                    Placement <span className="text-[#4ade80]">*</span>
                  </label>
                  <input
                    value={form.placement}
                    onChange={(e) => set("placement", e.target.value)}
                    placeholder="e.g. Homepage — above fold"
                    className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#4ade80]/50 transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-white/60">Format</label>
                    <select
                      value={form.format}
                      onChange={(e) => set("format", e.target.value)}
                      className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#4ade80]/50 transition-colors appearance-none"
                    >
                      {formats.map((f) => (
                        <option key={f} value={f} className="bg-[#0d0d1a]">
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-white/60">Size</label>
                    <select
                      value={form.size}
                      onChange={(e) => set("size", e.target.value)}
                      className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#4ade80]/50 transition-colors appearance-none"
                    >
                      {sizes.map((s) => (
                        <option key={s} value={s} className="bg-[#0d0d1a]">
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-2 py-3 rounded-xl bg-linear-to-r from-[#4ade80] to-[#22d3ee] text-black font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  Create Ad Unit
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="glass rounded-2xl border border-white/8 overflow-hidden"
      >
        {units.length === 0 ? (
          <EmptyState
            icon={<Monitor size={28} color="#4ade80" variant="Bold" />}
            title="No ad units yet"
            description="Add your first ad unit to start serving ads and earning revenue."
            action={{ label: "Add Ad Unit", onClick: () => setShowForm(true) }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  {[
                    "Ad Unit",
                    "Format",
                    "Placement",
                    "Status",
                    "Impressions",
                    "Earnings",
                    "CTR",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3.5 text-left text-xs font-medium text-white/30 uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {units.map((u, i) => (
                  <tr
                    key={u.id}
                    className={`border-b border-white/5 hover:bg-white/3 transition-colors ${i % 2 !== 0 ? "bg-white/1" : ""}`}
                  >
                    <td className="px-5 py-4">
                      <div className="font-medium text-white">{u.name}</div>
                      <div className="text-xs text-white/30 mt-0.5">
                        {u.size !== "N/A" ? u.size : ""}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs px-2 py-1 rounded-lg bg-[#a855f7]/10 text-[#a855f7]">
                        {u.format}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-white/50 text-xs max-w-[140px] truncate">
                      {u.placement}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${u.status === "Active" ? "bg-[#4ade80]/10 text-[#4ade80] border-[#4ade80]/20" : "bg-[#f7931a]/10 text-[#f7931a] border-[#f7931a]/20"}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${u.status === "Active" ? "bg-[#4ade80]" : "bg-[#f7931a]"}`}
                        />
                        {u.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-white/60">
                      {u.impressions > 0
                        ? `${(u.impressions / 1000).toFixed(0)}K`
                        : "—"}
                    </td>
                    <td className="px-5 py-4 text-[#4ade80] font-semibold">
                      {u.earnings > 0 ? `$${u.earnings.toFixed(2)}` : "—"}
                    </td>
                    <td className="px-5 py-4 text-[#22d3ee]">
                      {u.ctr > 0 ? `${u.ctr}%` : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            setToast({
                              message: "Loading unit details...",
                              type: "info",
                            })
                          }
                          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#a855f7]/20 flex items-center justify-center transition-colors"
                          title="View"
                        >
                          <Eye size={14} color="#a855f7" />
                        </button>
                        <button
                          onClick={() =>
                            setToast({
                              message: "Opening editor...",
                              type: "info",
                            })
                          }
                          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#22d3ee]/20 flex items-center justify-center transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={14} color="#22d3ee" />
                        </button>
                        <button
                          onClick={() => toggleStatus(u.id)}
                          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#f7931a]/20 flex items-center justify-center transition-colors"
                          title={u.status === "Active" ? "Pause" : "Resume"}
                        >
                          {u.status === "Active" ? (
                            <PauseCircle size={14} color="#f7931a" />
                          ) : (
                            <PlayCircle size={14} color="#4ade80" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
