'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, GitPullRequest, Settings, LogOut, Eye } from 'lucide-react';

const nav = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/reviews', label: 'Reviews', icon: GitPullRequest },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!localStorage.getItem('token')) router.push('/login');
  }, [router]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside className="w-56 flex flex-col border-r flex-shrink-0" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="p-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2">
            <Eye size={18} className="text-indigo-400" />
            <span className="font-bold text-white text-sm">codewatch</span>
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>AI Code Review</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all"
              style={{
                background: pathname === href ? 'rgba(99,102,241,0.15)' : 'transparent',
                color: pathname === href ? '#818cf8' : 'var(--text-dim)',
              }}>
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </nav>

        <button onClick={logout}
          className="flex items-center gap-3 px-6 py-4 text-sm border-t transition-all hover:text-red-400"
          style={{ color: 'var(--text-dim)', borderColor: 'var(--border)' }}>
          <LogOut size={15} />
          Logout
        </button>
      </aside>

      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
