'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Home, Users, AlertTriangle, CheckCircle2, TrendingUp,
  ArrowRight, Search, Clock, MessageSquare, Wallet
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';


const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function HostelWardenDashboard() {
  const stats = [
    { label: 'Total Rooms', value: '520', icon: Home, color: 'bg-primary' },
    { label: 'Occupied', value: '486', icon: Users, color: 'bg-secondary' },
    { label: 'Vacant', value: '34', icon: CheckCircle2, color: 'bg-accent' },
    { label: 'Complaints', value: '12', icon: AlertTriangle, color: 'bg-destructive' },
  ];

  const roomOccupancy = [
    { block: 'Block A', total: 120, occupied: 115, type: 'Boys' },
    { block: 'Block B', total: 120, occupied: 112, type: 'Boys' },
    { block: 'Block C', total: 100, occupied: 95, type: 'Girls' },
    { block: 'Block D', total: 100, occupied: 88, type: 'Girls' },
    { block: 'Block E', total: 80, occupied: 76, type: 'PG' },
  ];

  const recentComplaints = [
    { student: 'Alex Johnson', room: 'A-205', issue: 'WiFi not working', status: 'pending', date: 'Today' },
    { student: 'Priya Sharma', room: 'C-112', issue: 'Water heater issue', status: 'in-progress', date: 'Yesterday' },
    { student: 'Ryan Kim', room: 'A-310', issue: 'Room cleaning', status: 'resolved', date: '2 days ago' },
    { student: 'Emma Davis', room: 'C-205', issue: 'Fan not working', status: 'in-progress', date: '2 days ago' },
  ];

  const feeStatus = [
    { block: 'Block A', collected: '95%', amount: '35,25,000', pending: '1,75,000' },
    { block: 'Block B', collected: '92%', amount: '33,60,000', pending: '2,40,000' },
    { block: 'Block C', collected: '98%', amount: '29,40,000', pending: '60,000' },
    { block: 'Block D', collected: '88%', amount: '26,40,000', pending: '3,60,000' },
  ];

  return (
    <div className="space-y-6">
      <motion.div {...fadeInUp}>
        <h1 className="text-3xl font-bold font-[family-name:var(--font-poppins)]">Hostel Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage hostel operations and student accommodations</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div key={stat.label} {...fadeInUp} transition={{ delay: index * 0.05 }}>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div {...fadeInUp}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Room Occupancy</CardTitle>
              <Link href="/dashboard/hostel_warden/rooms">
                <Button size="sm" variant="outline">Manage Rooms</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roomOccupancy.map((block) => (
                  <div key={block.block}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{block.block}</span>
                        <span className="text-xs px-2 py-0.5 bg-muted rounded-full">{block.type}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{block.occupied}/{block.total}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{width: `${(block.occupied / block.total) * 100}%`}} /></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" /> Recent Complaints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentComplaints.map((complaint, index) => (
                  <div key={index} className="p-3 rounded-xl bg-muted/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{complaint.issue}</p>
                        <p className="text-xs text-muted-foreground">{complaint.student} • Room {complaint.room}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        complaint.status === 'resolved' ? 'bg-accent/10 text-accent' :
                        complaint.status === 'in-progress' ? 'bg-secondary/10 text-secondary' :
                        'bg-destructive/10 text-destructive'
                      }`}>
                        {complaint.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{complaint.date}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div {...fadeInUp}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Wallet className="w-5 h-5" /> Fee Collection Status
            </CardTitle>
            <Link href="/dashboard/hostel_warden/fees">
              <Button size="sm" variant="outline">View Details</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {feeStatus.map((block, index) => (
                <div key={block.block} className="text-center p-4 rounded-xl bg-muted/50">
                  <p className="text-sm font-medium mb-2">{block.block}</p>
                  <div className="relative w-16 h-16 mx-auto mb-2">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none" className="text-muted" />
                      <circle
                        cx="32" cy="32" r="28"
                        stroke="currentColor" strokeWidth="4" fill="none"
                        strokeDasharray={`${(parseInt(block.collected) / 100) * 175.9} 175.9`}
                        className="text-primary"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold">{block.collected}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">₹{block.amount}</p>
                  <p className="text-xs text-destructive">Pending: ₹{block.pending}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
