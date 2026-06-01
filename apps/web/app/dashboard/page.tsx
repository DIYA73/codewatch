'use client';
import { useEffect, useState } from 'react';
import { reviewsApi, teamsApi } from '@/lib/api';
import { GitPullRequest, CheckCircle, XCircle, TrendingUp, Zap } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState({ total: 0, completed: 0, failed: 0, successRate: 0 });
  const [reviews, setReviews] = useState<any[]>([]);
  const [teamId, setTeamId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const teams = await teamsApi.getAll();
        if (teams.length > 0) {
          const id = teams[0].id;
          setTeamId(id);
          const [s, r] = await Promise.all([
            reviewsApi.getStats(id),
            reviewsApi.getAll(id),
          ]);
          setStats(s);
          setReviews(r.slice(0, 5));
        }
      } catch {} finally { setLoading(false); }
    };
    init();
  }, []);

  const cards = [
    { label: 'Total Reviews', value: stats.total, icon: GitPullRequest, color: '#6366f1' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle, color: '#22c55e' },
    { label: 'Failed', value: stats.failed, icon: XCircle, color: '#ef4444' },
    { label: 'Success Rate', value: `${stats.successRate}%`, icon: TrendingUp, color: '#f59e0b' },
  ];

  const statusColor: Record<string, string> = {
    completed: '#22c55e', failed: '#ef4444', running: '#f59e0b', pending: '#6366f1',
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Good to see you 👋</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-dim)' }}>Here's what's happening with your code reviews</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="p-5 rounded-xl border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>{label}</span>
              <Icon size={16} style={{ color }} />
            </div>
            <div className="text-3xl font-bold text-white">{loading ? '—' : value}</div>
          </div>
        ))}
      </div>

      {/* Recent Reviews */}
      <div className="rounded-xl border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <h2 className="font-semibold text-white text-sm">Recent Reviews</h2>
          <Zap size={14} className="text-indigo-400" />
        </div>
        {reviews.length === 0 && !loading ? (
          <div className="p-8 text-center" style={{ color: 'var(--text-dim)' }}>
            <GitPullRequest size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No reviews yet. Set up a webhook to get started.</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {reviews.map((r) => (
              <div key={r.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">{r.prTitle}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-dim)' }}>{r.repo} · #{r.prNumber} by {r.author}</p>
                </div>
                <div className="flex items-center gap-3">
                  {r.overallScore && <span className="text-sm font-bold" style={{ color: '#f59e0b' }}>{r.overallScore}/10</span>}
                  <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: `${statusColor[r.status]}20`, color: statusColor[r.status] }}>
                    {r.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
