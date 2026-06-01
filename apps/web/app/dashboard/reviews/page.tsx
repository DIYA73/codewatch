'use client';
import { useEffect, useState } from 'react';
import { reviewsApi, teamsApi } from '@/lib/api';
import { GitPullRequest, ExternalLink, Star } from 'lucide-react';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const teams = await teamsApi.getAll();
        if (teams.length > 0) {
          const r = await reviewsApi.getAll(teams[0].id);
          setReviews(r);
        }
      } catch {} finally { setLoading(false); }
    };
    init();
  }, []);

  const statusColor: Record<string, string> = {
    completed: '#22c55e', failed: '#ef4444', running: '#f59e0b', pending: '#6366f1',
  };

  return (
    <div className="flex gap-6 h-full">
      {/* List */}
      <div className="w-96 flex-shrink-0">
        <h1 className="text-xl font-bold text-white mb-6">Reviews</h1>
        <div className="space-y-2">
          {loading && <p style={{ color: 'var(--text-dim)' }} className="text-sm">Loading...</p>}
          {!loading && reviews.length === 0 && (
            <div className="p-8 text-center rounded-xl border" style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-dim)' }}>
              <GitPullRequest size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No reviews yet</p>
            </div>
          )}
          {reviews.map((r) => (
            <div key={r.id} onClick={() => setSelected(r)}
              className="p-4 rounded-xl border cursor-pointer transition-all"
              style={{
                background: selected?.id === r.id ? 'rgba(99,102,241,0.1)' : 'var(--surface)',
                borderColor: selected?.id === r.id ? '#6366f1' : 'var(--border)',
              }}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{r.prTitle}</p>
                  <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-dim)' }}>{r.repo} · #{r.prNumber}</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium"
                  style={{ background: `${statusColor[r.status]}20`, color: statusColor[r.status] }}>
                  {r.status}
                </span>
              </div>
              {r.overallScore && (
                <div className="flex items-center gap-1 mt-2">
                  <Star size={11} className="text-yellow-400" />
                  <span className="text-xs text-yellow-400 font-medium">{r.overallScore}/10</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Detail */}
      <div className="flex-1 rounded-xl border overflow-auto" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        {!selected ? (
          <div className="h-full flex items-center justify-center" style={{ color: 'var(--text-dim)' }}>
            <div className="text-center">
              <GitPullRequest size={40} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm">Select a review to see details</p>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-white">{selected.prTitle}</h2>
                <p className="text-sm mt-1" style={{ color: 'var(--text-dim)' }}>
                  {selected.repo} · #{selected.prNumber} · by {selected.author}
                </p>
              </div>
              <a href={selected.prUrl} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all hover:border-indigo-500"
                style={{ borderColor: 'var(--border)', color: 'var(--text-dim)' }}>
                <ExternalLink size={12} /> View PR
              </a>
            </div>

            {selected.aiReview?.summary ? (
              <div className="prose prose-invert max-w-none">
                <div className="rounded-xl p-5 border text-sm leading-relaxed whitespace-pre-wrap"
                  style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}>
                  {selected.aiReview.summary}
                </div>
              </div>
            ) : (
              <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
                {selected.status === 'pending' || selected.status === 'running'
                  ? '⏳ Review in progress...'
                  : 'No review content available'}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
