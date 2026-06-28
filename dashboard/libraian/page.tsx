'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  BookOpen, Users, Clock, AlertTriangle, TrendingUp,
  ArrowRight, Search, Filter, CheckCircle2, XCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function LibrarianDashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { label: 'Total Books', value: '45,000', icon: BookOpen, color: 'bg-primary' },
    { label: 'Active Members', value: '8,200', icon: Users, color: 'bg-secondary' },
    { label: 'Books Issued', value: '1,240', icon: TrendingUp, color: 'bg-accent' },
    { label: 'Overdue', value: '86', icon: AlertTriangle, color: 'bg-destructive' },
  ];

  const recentTransactions = [
    { book: 'Introduction to Algorithms', student: 'Alex Johnson', roll: 'CSE202301', type: 'issue', date: 'Today' },
    { book: 'Deep Learning', student: 'Priya Sharma', roll: 'CSE202302', type: 'return', date: 'Today' },
    { book: 'Clean Code', student: 'Ryan Kim', roll: 'CSE202303', type: 'issue', date: 'Yesterday' },
    { book: 'Design Patterns', student: 'Emma Davis', roll: 'CSE202304', type: 'return', date: 'Yesterday' },
  ];

  const popularBooks = [
    { title: 'Introduction to Algorithms', author: 'Cormen et al.', borrowed: 245, available: 3, total: 8 },
    { title: 'Deep Learning', author: 'Goodfellow et al.', borrowed: 198, available: 1, total: 6 },
    { title: 'Clean Code', author: 'Robert Martin', borrowed: 176, available: 2, total: 5 },
    { title: 'Design Patterns', author: 'Gang of Four', borrowed: 154, available: 4, total: 7 },
  ];

  const overdueBooks = [
    { book: 'Machine Learning Yearning', student: 'James Wilson', roll: 'CSE202305', dueDate: '3 days ago', fine: '₹45' },
    { book: 'The Pragmatic Programmer', student: 'Sophie Brown', roll: 'CSE202306', dueDate: '5 days ago', fine: '₹75' },
    { book: 'Computer Networks', student: 'Daniel Lee', roll: 'CSE202307', dueDate: '1 week ago', fine: '₹105' },
  ];

  return (
    <div className="space-y-6">
      <motion.div {...fadeInUp}>
        <h1 className="text-3xl font-bold font-[family-name:var(--font-poppins)]">Library Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage library operations and resources</p>
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

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div {...fadeInUp} className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Popular Books</CardTitle>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                <Input
                  placeholder="Search books..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-7 h-8 text-sm w-48"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {popularBooks.filter(b => b.title.toLowerCase().includes(searchQuery.toLowerCase())).map((book, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{book.title}</p>
                        <p className="text-xs text-muted-foreground">{book.author}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{book.borrowed} borrows</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        book.available > 2 ? 'bg-accent/10 text-accent' : 'bg-amber-500/10 text-amber-600'
                      }`}>
                        {book.available}/{book.total} available
                      </span>
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
                <AlertTriangle className="w-5 h-5 text-destructive" /> Overdue Books
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {overdueBooks.map((item, index) => (
                  <div key={index} className="p-3 rounded-xl bg-destructive/5 border border-destructive/10">
                    <p className="text-sm font-medium">{item.book}</p>
                    <p className="text-xs text-muted-foreground">{item.student} • {item.roll}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-destructive font-medium">Due: {item.dueDate}</span>
                      <span className="text-xs font-bold text-destructive">{item.fine}</span>
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
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
            <Link href="/dashboard/librarian/transactions">
              <Button size="sm" variant="outline">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((tx, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      tx.type === 'issue' ? 'bg-primary/10' : 'bg-accent/10'
                    }`}>
                      {tx.type === 'issue' ? (
                        <ArrowRight className="w-4 h-4 text-primary" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-accent" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{tx.book}</p>
                      <p className="text-xs text-muted-foreground">{tx.student} • {tx.roll}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      tx.type === 'issue' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'
                    }`}>
                      {tx.type === 'issue' ? 'Issued' : 'Returned'}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">{tx.date}</p>
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
