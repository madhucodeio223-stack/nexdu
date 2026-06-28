'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  DollarSign, TrendingUp, Users, AlertTriangle, ArrowRight,
  CheckCircle2, Clock, Search, Filter, Wallet, Award
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';


const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function FinanceDashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { label: 'Total Revenue', value: '₹24.5M', icon: DollarSign, color: 'bg-primary', trend: '+12%' },
    { label: 'Fee Collection', value: '94%', icon: TrendingUp, color: 'bg-secondary', trend: '+3%' },
    { label: 'Outstanding', value: '₹1.8M', icon: AlertTriangle, color: 'bg-destructive', trend: '-5%' },
    { label: 'Scholarships', value: '₹2.1M', icon: Award, color: 'bg-accent', trend: '+8%' },
  ];

  const feeStructure = [
    { course: 'B.Tech CSE', tuition: '1,50,000', hostel: '75,000', misc: '25,000', total: '2,50,000' },
    { course: 'B.Tech ECE', tuition: '1,40,000', hostel: '75,000', misc: '25,000', total: '2,40,000' },
    { course: 'MBA', tuition: '2,50,000', hostel: '85,000', misc: '30,000', total: '3,65,000' },
    { course: 'M.Tech', tuition: '2,00,000', hostel: '75,000', misc: '25,000', total: '3,00,000' },
  ];

  const recentPayments = [
    { student: 'Alex Johnson', roll: 'CSE202301', amount: '1,25,000', date: 'Today', method: 'Online', status: 'success' },
    { student: 'Priya Sharma', roll: 'CSE202302', amount: '1,25,000', date: 'Yesterday', method: 'Online', status: 'success' },
    { student: 'Ryan Kim', roll: 'CSE202303', amount: '75,000', date: '2 days ago', method: 'Bank Transfer', status: 'pending' },
    { student: 'Emma Davis', roll: 'CSE202304', amount: '1,25,000', date: '3 days ago', method: 'Online', status: 'success' },
  ];

  const outstandingFees = [
    { student: 'James Wilson', roll: 'CSE202305', amount: '1,25,000', due: '15 days overdue' },
    { student: 'Sophie Brown', roll: 'CSE202306', amount: '75,000', due: '10 days overdue' },
    { student: 'Daniel Lee', roll: 'CSE202307', amount: '1,25,000', due: '5 days overdue' },
  ];

  return (
    <div className="space-y-6">
      <motion.div {...fadeInUp}>
        <h1 className="text-3xl font-bold font-[family-name:var(--font-poppins)]">Finance Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage fee collection, payments, and financial reports</p>
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
                  <span className={`text-xs font-medium ${stat.trend.startsWith('+') ? 'text-accent' : 'text-destructive'}`}>
                    {stat.trend}
                  </span>
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
              <CardTitle className="text-lg">Fee Structure</CardTitle>
              <Link href="/dashboard/finance_officer/fees">
                <Button size="sm" variant="outline">Manage</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {feeStructure.map((fee, index) => (
                  <div key={index} className="p-3 rounded-xl bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">{fee.course}</p>
                      <span className="text-sm font-bold text-primary">₹{fee.total}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                      <span>Tuition: ₹{fee.tuition}</span>
                      <span>Hostel: ₹{fee.hostel}</span>
                      <span>Misc: ₹{fee.misc}</span>
                    </div>
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
                <AlertTriangle className="w-5 h-5 text-destructive" /> Outstanding Fees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {outstandingFees.map((item, index) => (
                  <div key={index} className="p-3 rounded-xl bg-destructive/5 border border-destructive/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{item.student}</p>
                        <p className="text-xs text-muted-foreground">{item.roll}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-destructive">₹{item.amount}</p>
                        <p className="text-xs text-destructive">{item.due}</p>
                      </div>
                    </div>
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
            <CardTitle className="text-lg">Recent Payments</CardTitle>
            <Link href="/dashboard/finance_officer/payments">
              <Button size="sm" variant="outline">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentPayments.map((payment, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      payment.status === 'success' ? 'bg-accent/10' : 'bg-amber-500/10'
                    }`}>
                      {payment.status === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-accent" />
                      ) : (
                        <Clock className="w-4 h-4 text-amber-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{payment.student}</p>
                      <p className="text-xs text-muted-foreground">{payment.roll} • {payment.method}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">₹{payment.amount}</p>
                    <p className="text-xs text-muted-foreground">{payment.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
