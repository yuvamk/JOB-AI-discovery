import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Phone, Mail, X, 
  ChevronRight, Sparkles, LogIn, Github, Linkedin, Eye, EyeOff
} from 'lucide-react';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAutoTriggered?: boolean;
}

export default function AuthModal({ isOpen, onClose, isAutoTriggered }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'google' | 'phone' | 'email' | 'linkedin'>('google');
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [email, setEmail] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [showEmailOtp, setShowEmailOtp] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEmailOtp) {
      setLoading(true);
      try {
        const res = await fetch('/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to send OTP code');
        
        toast.success(`Login code sent to ${email}`);
        setShowEmailOtp(true);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(true);
      const res = await signIn('email-otp', {
        email,
        otp: emailOtp,
        redirect: false,
      });
      
      if (res?.error) {
        toast.error('Invalid OTP code');
      } else {
        toast.success('Welcome to Kinetic!');
        onClose();
      }
      setLoading(false);
    }
  };

  const handlePhoneAuth = async () => {
    if (!showOtp) {
      toast.info('OTP sent to ' + phone + ' (Use 123456)');
      setShowOtp(true);
    } else {
      setLoading(true);
      const res = await signIn('phone-otp', {
        phone,
        otp,
        redirect: false,
      });
      if (res?.error) {
        toast.error('Invalid OTP');
      } else {
        toast.success('Signed in successfully');
        onClose();
      }
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay & Blur */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-[8px] z-[-1]"
            onClick={isAutoTriggered ? undefined : onClose}
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-10 overflow-hidden"
          >
            {/* Header */}
            <div className="text-center space-y-4 mb-10">
              <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-indigo-600/20">
                <Zap className="w-8 h-8 text-white fill-white" />
              </div>
              <div className="space-y-1">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                  JOIN THE <span className="text-indigo-600">EVOLUTION.</span>
                </h2>
                <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">
                  {isAutoTriggered ? 'Experience is limited. Sign in to unlock full potential.' : 'Access the world\'s most powerful AI job discovery platform.'}
                </p>
              </div>
            </div>

            {/* Methods Tabs */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl mb-8 overflow-x-auto">
               {(['google', 'linkedin', 'phone', 'email'] as const).map((tab) => (
                 <button
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={`flex-1 py-2.5 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                     activeTab === tab 
                       ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' 
                       : 'text-slate-400 hover:text-slate-600'
                   }`}
                 >
                   {tab}
                 </button>
               ))}
            </div>

            {/* Tab Content */}
            <div className="space-y-4">
              {(activeTab === 'google' || activeTab === 'linkedin') && (
                <div className="space-y-4">
                   <button 
                     onClick={() => signIn(activeTab)}
                     className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl transition-all group border ${
                       activeTab === 'google' 
                        ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-500' 
                        : 'bg-blue-600 text-white border-transparent hover:bg-blue-700'
                     }`}
                   >
                     {activeTab === 'google' ? (
                        <span className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center text-[10px] text-white">G</span>
                     ) : (
                        <Linkedin className="w-5 h-5" />
                     )}
                     <span className={`text-sm font-black ${activeTab === 'google' ? 'text-slate-700 dark:text-slate-200' : 'text-white'}`}>
                       Continue with {activeTab === 'google' ? 'Google' : 'LinkedIn'}
                     </span>
                   </button>
                </div>
              )}

              {activeTab === 'phone' && (
                <div className="space-y-4 text-center">
                   <div className="flex items-center gap-2 p-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl">
                      <span className="px-4 text-sm font-bold text-slate-400 border-r border-slate-200">+91</span>
                      <input 
                        type="tel" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter phone number" 
                        className="flex-1 px-2 py-3 bg-transparent outline-none text-sm font-bold placeholder:text-slate-400"
                        disabled={showOtp}
                      />
                   </div>
                   {showOtp && (
                     <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                       <input 
                        type="text" 
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter 6-digit OTP" 
                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none font-bold text-sm text-center tracking-[0.5em]"
                      />
                     </motion.div>
                   )}
                   <button 
                    onClick={handlePhoneAuth}
                    disabled={loading}
                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-500/20 active:scale-95 transition-all disabled:opacity-50"
                   >
                      {loading ? 'Verifying...' : showOtp ? 'Verify OTP' : 'Send OTP'}
                   </button>
                </div>
              )}

              {activeTab === 'email' && (
                <form onSubmit={handleEmailAuth} className="space-y-4">
                   <div className="space-y-1">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                     <input 
                       type="email" 
                       required
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       placeholder="you@example.com" 
                       className="w-full px-6 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none font-bold text-sm focus:ring-2 ring-indigo-500/10"
                       disabled={showEmailOtp}
                     />
                   </div>

                   {showEmailOtp && (
                     <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Code</label>
                        <input 
                          type="text" 
                          required
                          value={emailOtp}
                          onChange={(e) => setEmailOtp(e.target.value)}
                          placeholder="Enter 6-digit code" 
                          className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none font-bold text-sm text-center tracking-[0.5em]"
                        />
                     </motion.div>
                   )}

                   <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest active:scale-95 transition-all disabled:opacity-50"
                   >
                      {loading ? 'Processing...' : showEmailOtp ? 'Verify Code & Sign In' : 'Send Code'}
                   </button>
                </form>
              )}
            </div>

            {/* Footer */}
            <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
               <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
                  By joining, you agree to our<br />
                  <span className="text-indigo-600 cursor-pointer hover:underline">Terms of Service</span> and <span className="text-indigo-600 cursor-pointer hover:underline">Privacy Policy</span>
               </p>
            </div>

            {/* Close button */}
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
