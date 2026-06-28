'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GraduationCap, ArrowRight, Mail, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-primary-foreground" />
              </div>
            </Link>
            <h1 className="text-2xl font-bold font-[family-name:var(--font-poppins)]">Reset Password</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Enter your email and we&apos;ll send you reset instructions
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-4">
              <CheckCircle2 className="w-16 h-16 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Check Your Email</h3>
              <p className="text-muted-foreground text-sm mb-6">
                We&apos;ve sent password reset instructions to {email}
              </p>
              <Link href="/auth/login">
                <Button variant="outline" className="gap-2">
                  Back to Sign In <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@edunexus.edu"
                    className="pl-9"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full gap-2">
                Send Reset Link <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          )}

          {!submitted && (
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Remember your password? </span>
              <Link href="/auth/login" className="text-primary hover:underline font-medium">
                Sign In
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
