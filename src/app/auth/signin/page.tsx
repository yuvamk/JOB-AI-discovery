'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Chrome, Phone, Mail, Zap, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SignInPage() {
  const [method, setMethod] = useState<'options' | 'phone' | 'email'>('options');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  return (
    <div className="min-h-[calc(100-4rem)] flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[30%] h-[30%] bg-violet-500/5 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative z-10"
      >
        <div className="text-center space-y-3 mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group mb-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-slate-900 dark:text-white text-xl tracking-tight">Kinetic AI</span>
          </Link>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Welcome Back.</h1>
          <p className="text-slate-500 dark:text-slate-400">Choose your preferred way to sign in to Kinetic.</p>
        </div>

        {method === 'options' && (
          <div className="space-y-4">
            <button
              onClick={() => signIn('google', { callbackUrl: '/jobs' })}
              className="w-full h-14 flex items-center justify-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-[0.98]"
            >
              <Chrome className="w-5 h-5 text-blue-500" />
              Sign in with Google
            </button>
            <button
              onClick={() => setMethod('phone')}
              className="w-full h-14 flex items-center justify-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all active:scale-[0.98]"
            >
              <Phone className="w-5 h-5" />
              Sign in with Phone
            </button>
            <button
              onClick={() => setMethod('email')}
              className="w-full h-14 flex items-center justify-center gap-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-[0.98]"
            >
              <Mail className="w-5 h-5" />
              Passwordless Email
            </button>
          </div>
        )}

        {method === 'phone' && (
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-5">
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Phone Number</label>
                <input 
                  type="text"
                  placeholder="+1 234 567 890"
                  className="w-full h-14 px-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:ring-2 ring-blue-500/20 transition-all outline-none"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Verification Code</label>
                <input 
                  type="text"
                  placeholder="123456"
                  className="w-full h-14 px-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:ring-2 ring-blue-500/20 transition-all outline-none"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
             </div>
             <button 
               onClick={() => signIn('credentials', { phone, otp, callbackUrl: '/jobs' })}
               className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/25 transition-all"
             >
               Verify OTP
             </button>
             <button onClick={() => setMethod('options')} className="w-full flex items-center justify-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
               <ArrowLeft className="w-4 h-4" /> Back to options
             </button>
          </motion.div>
        )}

        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-sm text-slate-400">
            Don't have an account? <Link href="/auth/signup" className="text-blue-600 font-bold hover:underline">Create one</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
