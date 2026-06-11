"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, KeyRound, ArrowRight, Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Forgot Password States
  const [mode, setMode] = useState<'login' | 'forgot_step1' | 'forgot_step2'>('login');
  const [resetUsername, setResetUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  useEffect(() => {
    const savedUser = localStorage.getItem('remembered_user');
    const savedPass = localStorage.getItem('remembered_pass');
    if (savedUser && savedPass) {
      setUsername(savedUser);
      setPassword(savedPass);
      setRememberMe(true);
    }
  }, []);

  const handleVerifyUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify_username', username: resetUsername }),
      });

      if (res.ok) {
        setMode('forgot_step2');
      } else {
        const data = await res.json();
        setError(data.message || 'Kullanıcı adı bulunamadı.');
      }
    } catch (err) {
      setError('Bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset_password', username: resetUsername, newPassword: newPassword }),
      });

      if (res.ok) {
        setSuccessMsg('Şifreniz başarıyla değiştirildi. Yeni şifrenizle giriş yapabilirsiniz.');
        setMode('login');
        setResetUsername('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const data = await res.json();
        setError(data.message || 'Şifre değiştirilemedi.');
      }
    } catch (err) {
      setError('Bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, rememberMe }),
      });

      if (res.ok) {
        if (rememberMe) {
          localStorage.setItem('remembered_user', username);
          localStorage.setItem('remembered_pass', password);
        } else {
          localStorage.removeItem('remembered_user');
          localStorage.removeItem('remembered_pass');
        }
        router.push('/admin/dashboard');
      } else {
        const data = await res.json();
        setError(data.message || 'Giriş başarısız');
      }
    } catch (err) {
      setError('Bir hata oluştu, lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-zinc-200/50 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-slate-300/40 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-white rounded-[32px] p-10 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-slate-100 relative z-10">

        {/* Header */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 bg-zinc-900 text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-zinc-900/20 transform -rotate-3">
            <Lock size={32} strokeWidth={2} />
          </div>
          <h1 className="text-[28px] font-extrabold text-slate-800 tracking-tight">Yönetim Paneli</h1>
          <p className="text-slate-500 mt-2 font-medium">Sadece yetkili erişimine açıktır.</p>
        </div>

        {/* Error / Success Messages */}
        {successMsg && (
          <div className="mb-6 bg-green-50 text-green-600 rounded-xl p-4 text-sm font-semibold border border-green-100 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-600"></div>
            {successMsg}
          </div>
        )}
        {error && (
          <div className="mb-6 bg-red-50 text-red-600 rounded-xl p-4 text-sm font-semibold border border-red-100 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
            {error}
          </div>
        )}

        {/* Forms */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="flex flex-col space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-zinc-600 transition-colors">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Kullanıcı Adı"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full h-14 pl-12 pr-5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 focus:bg-white transition-all shadow-inner shadow-slate-100/50"
                />
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-zinc-600 transition-colors">
                  <KeyRound size={20} />
                </div>
                <input
                  type="password"
                  placeholder="Şifre"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-14 pl-12 pr-5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 focus:bg-white transition-all shadow-inner shadow-slate-100/50"
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-zinc-900 focus:ring-zinc-900"
                />
                <label htmlFor="rememberMe" className="text-sm font-semibold text-slate-600 cursor-pointer select-none">
                  Beni Hatırla
                </label>
              </div>
              <button
                type="button"
                onClick={() => { setMode('forgot_step1'); setError(''); setSuccessMsg(''); }}
                className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                Şifre Değiştir
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-bold text-[16px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group shadow-[0_10px_30px_rgba(24,24,27,0.2)]"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  Sisteme Giriş Yap
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        )}

        {mode === 'forgot_step1' && (
          <form onSubmit={handleVerifyUsername} className="flex flex-col space-y-6">
            <div className="text-center mb-2">
              <h2 className="text-xl font-bold text-slate-800">Şifre Değiştir</h2>
              <p className="text-sm text-slate-500 mt-1">Lütfen teyit için kullanıcı adınızı girin.</p>
            </div>
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-zinc-600 transition-colors">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Kullanıcı Adı"
                  value={resetUsername}
                  onChange={(e) => setResetUsername(e.target.value)}
                  required
                  className="w-full h-14 pl-12 pr-5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 focus:bg-white transition-all shadow-inner shadow-slate-100/50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-bold text-[16px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group shadow-[0_10px_30px_rgba(24,24,27,0.2)]"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Devam Et'}
            </button>
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
              className="mt-2 text-sm font-semibold text-slate-600 hover:text-zinc-900 transition-colors text-center w-full"
            >
              Giriş Ekranına Dön
            </button>
          </form>
        )}

        {mode === 'forgot_step2' && (
          <form onSubmit={handleResetPassword} className="flex flex-col space-y-6">
            <div className="text-center mb-2">
              <h2 className="text-xl font-bold text-slate-800">Yeni Şifre Belirle</h2>
              <p className="text-sm text-slate-500 mt-1">Kullanıcı adı doğrulandı. Lütfen yeni şifrenizi girin.</p>
            </div>
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-zinc-600 transition-colors">
                  <KeyRound size={20} />
                </div>
                <input
                  type="password"
                  placeholder="Yeni Şifre"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full h-14 pl-12 pr-5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 focus:bg-white transition-all shadow-inner shadow-slate-100/50"
                />
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-zinc-600 transition-colors">
                  <KeyRound size={20} />
                </div>
                <input
                  type="password"
                  placeholder="Yeni Şifre (Tekrar)"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full h-14 pl-12 pr-5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 focus:bg-white transition-all shadow-inner shadow-slate-100/50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-bold text-[16px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group shadow-[0_10px_30px_rgba(24,24,27,0.2)]"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Şifreyi Güncelle'}
            </button>
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); setResetUsername(''); setNewPassword(''); setConfirmPassword(''); }}
              className="mt-2 text-sm font-semibold text-slate-600 hover:text-zinc-900 transition-colors text-center w-full"
            >
              İptal Et
            </button>
          </form>
        )}

      </div>

      {/* Footer info */}
      <div className="mt-12 text-center text-slate-400 text-sm font-medium z-10">
        &copy; {new Date().getFullYear()} Perdens Perde Sistemleri Tüm Hakları Saklıdır.
      </div>
    </div>
  );
}
