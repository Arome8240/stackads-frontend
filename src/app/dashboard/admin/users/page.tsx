"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { useStacks } from "@/providers/StacksProvider";
import { SearchNormal1, Filter, Eye, ShieldTick, CloseCircle } from "iconsax-react";

interface User {
  address: string;
  type: "publisher" | "advertiser";
  name: string;
  reputation: number;
  status: "active" | "suspended" | "pending";
  registeredAt: Date;
  totalTransactions: number;
  stakeAmount: number;
}

export default function AdminUsers() {
  const { address, isConnected } = useStacks();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "publisher" | "advertiser">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "suspended" | "pending">("all");

  // Mock data - in production, this would come from smart contracts
  const [users] = useState<User[]>([
    {
      address: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
      type: "publisher",
      name: "Tech Blog Network",
      reputation: 95,
      status: "active",
      registeredAt: new Date("2024-01-15"),
      totalTransactions: 1250,
      stakeAmount: 50,
    },
    {
      address: "ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG",
      type: "advertiser",
      name: "Acme Corporation",
      reputation: 88,
      status: "active",
      registeredAt: new Date("2024-02-01"),
      totalTransactions: 450,
      stakeAmount: 100,
    },
    {
      address: "ST3AM1A56AK2C1XAFJ4115ZSV26EB49BVQ10MGCS0",
      type: "publisher",
      name: "News Portal",
      reputation: 72,
      status: "active",
      registeredAt: new Date("2024-03-10"),
      totalTransactions: 680,
      stakeAmount: 30,
    },
    {
      address: "ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5",
      type: "advertiser",
      name: "StartupXYZ",
      reputation: 45,
      status: "pending",
      registeredAt: new Date("2024-04-20"),
      totalTransactions: 12,
      stakeAmount: 10,
    },
    {
      address: "ST2REHHS5J3CERCRBEPMGH7921Q6PYKAADT7JP2VB",
      type: "publisher",
      name: "Gaming Site",
      reputation: 30,
      status: "suspended",
      registeredAt: new Date("2024-02-28"),
      totalTransactions: 890,
      stakeAmount: 25,
    },
  ]);

  // Check if user is admin
  const isAdmin = address === process.env.NEXT_PUBLIC_ADMIN_ADDRESS;

  if (!isConnected || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-white/60">
            You don't have permission to access this page
          </p>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || user.type === filterType;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: users.length,
    publishers: users.filter((u) => u.type === "publisher").length,
    advertisers: users.filter((u) => u.type === "advertiser").length,
    active: users.filter((u) => u.status === "active").length,
    pending: users.filter((u) => u.status === "pending").length,
    suspended: users.filter((u) => u.status === "suspended").length,
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-white/60 text-sm mt-1">
          Manage all platform users and their accounts
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="glass rounded-xl p-4 border border-white/8">
          <p className="text-xs text-white/40 mb-1">Total Users</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="glass rounded-xl p-4 border border-white/8">
          <p className="text-xs text-white/40 mb-1">Publishers</p>
          <p className="text-2xl font-bold text-[#a855f7]">{stats.publishers}</p>
        </div>
        <div className="glass rounded-xl p-4 border border-white/8">
          <p className="text-xs text-white/40 mb-1">Advertisers</p>
          <p className="text-2xl font-bold text-[#f7931a]">{stats.advertisers}</p>
        </div>
        <div className="glass rounded-xl p-4 border border-white/8">
          <p className="text-xs text-white/40 mb-1">Active</p>
          <p className="text-2xl font-bold text-[#4ade80]">{stats.active}</p>
        </div>
        <div className="glass rounded-xl p-4 border border-white/8">
          <p className="text-xs text-white/40 mb-1">Pending</p>
          <p className="text-2xl font-bold text-[#22d3ee]">{stats.pending}</p>
        </div>
        <div className="glass rounded-xl p-4 border border-white/8">
          <p className="text-xs text-white/40 mb-1">Suspended</p>
          <p className="text-2xl font-bold text-[#ef4444]">{stats.suspended}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <SearchNormal1
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or address..."
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#f7931a] transition-colors"
          />
        </div>

        {/* Type Filter */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#f7931a] transition-colors"
        >
          <option value="all">All Types</option>
          <option value="publisher">Publishers</option>
          <option value="advertiser">Advertisers</option>
        </select>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#f7931a] transition-colors"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl border border-white/8 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {[
                  "User",
                  "Type",
                  "Reputation",
                  "Status",
                  "Stake",
                  "Transactions",
                  "Registered",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-medium text-white/30 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, i) => (
                <tr
                  key={user.address}
                  className={`border-b border-white/5 hover:bg-white/3 transition-colors ${
                    i % 2 === 0 ? "" : "bg-white/1"
                  }`}
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-white">{user.name}</p>
                      <p className="text-xs text-white/40 font-mono mt-1">
                        {user.address.slice(0, 8)}...{user.address.slice(-6)}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.type === "publisher"
                          ? "bg-[#a855f7]/10 text-[#a855f7]"
                          : "bg-[#f7931a]/10 text-[#f7931a]"
                      }`}
                    >
                      {user.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-full max-w-[100px] bg-white/5 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            user.reputation >= 80
                              ? "bg-[#4ade80]"
                              : user.reputation >= 50
                              ? "bg-[#f7931a]"
                              : "bg-[#ef4444]"
                          }`}
                          style={{ width: `${user.reputation}%` }}
                        />
                      </div>
                      <span className="text-white/60 text-xs">{user.reputation}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.status === "active"
                          ? "bg-[#4ade80]/10 text-[#4ade80]"
                          : user.status === "pending"
                          ? "bg-[#22d3ee]/10 text-[#22d3ee]"
                          : "bg-[#ef4444]/10 text-[#ef4444]"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white/60">
                    {user.stakeAmount} SADS
                  </td>
                  <td className="px-6 py-4 text-white/60">
                    {user.totalTransactions}
                  </td>
                  <td className="px-6 py-4 text-white/60">
                    {user.registeredAt.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} color="#22d3ee" />
                      </button>
                      {user.status === "pending" && (
                        <button
                          className="p-2 rounded-lg bg-white/5 hover:bg-[#4ade80]/10 transition-colors"
                          title="Approve"
                        >
                          <ShieldTick size={16} color="#4ade80" />
                        </button>
                      )}
                      {user.status === "active" && (
                        <button
                          className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 transition-colors"
                          title="Suspend"
                        >
                          <CloseCircle size={16} color="#ef4444" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12 text-white/60">
          <p>No users found matching your filters</p>
        </div>
      )}
    </div>
  );
}
