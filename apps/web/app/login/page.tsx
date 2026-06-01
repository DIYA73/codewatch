'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = isLogin
        ? await authApi.login({ email: form.email, password: form.password })
        : await authApi.register(form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-md p-8 rounded-2xl border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">🔍 codewatch</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-dim)' }}>AI-powered code review</p>
        </div>

        <div className="flex mb-6 rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
          {['Login', 'Register'].map((tab) => (
            <button key={tab} onClick={() => setIsLogin(tab === 'Login')}
              className="flex-1 py-2 text-sm font-medium transition-all"
              style={{ background: (isLogin ? tab === 'Login' : tab === 'Register') ? 'var(--accent)' : 'transparent', color: 'white' }}>
              {tab}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input type="text" placeholder="Full name" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg text-sm text-white outline-none border focus:border-indigo-500"
              style={{ background: 'var(--bg)', borderColor: 'var(--border)' }} required />
          )}
          <input type="email" placeholder="Email" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 rounded-lg text-sm text-white outline-none border focus:border-indigo-500"
            style={{ background: 'var(--bg)', borderColor: 'var(--border)' }} required />
          <input type="password" placeholder="Password" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-3 rounded-lg text-sm text-white outline-none border focus:border-indigo-500"
            style={{ background: 'var(--bg)', borderColor: 'var(--border)' }} required />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-50"
            style={{ background: 'var(--accent)' }}>
            {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
