'use client';
import { useEffect, useState } from 'react';
import { teamsApi } from '@/lib/api';
import { Copy, Check } from 'lucide-react';

export default function SettingsPage() {
  const [team, setTeam] = useState<any>(null);
  const [form, setForm] = useState({ openaiApiKey: '', notificationEmail: '', postGithubComments: true, sendEmailSummary: true });
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    teamsApi.getAll().then(teams => {
      if (teams.length > 0) {
        setTeam(teams[0]);
        setForm({
          openaiApiKey: teams[0].openaiApiKey || '',
          notificationEmail: teams[0].notificationEmail || '',
          postGithubComments: teams[0].postGithubComments ?? true,
          sendEmailSummary: teams[0].sendEmailSummary ?? true,
        });
      }
    }).catch(() => {});
  }, []);

  const handleSave = async () => {
    if (!team) return;
    await teamsApi.update(team.id, form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const webhookUrl = team ? `http://localhost:3001/webhooks/github/${team.id}` : '';

  const copyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold text-white mb-8">Settings</h1>

      {/* Webhook URL */}
      <div className="p-5 rounded-xl border mb-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <h2 className="text-sm font-semibold text-white mb-1">GitHub Webhook URL</h2>
        <p className="text-xs mb-3" style={{ color: 'var(--text-dim)' }}>Add this URL to your GitHub repo Settings → Webhooks. Set content type to application/json and select "Pull requests" events.</p>
        <div className="flex items-center gap-2">
          <code className="flex-1 px-3 py-2 rounded-lg text-xs font-mono text-indigo-300 border overflow-auto"
            style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
            {webhookUrl || 'Create a team first'}
          </code>
          <button onClick={copyWebhook} className="p-2 rounded-lg border transition-all hover:border-indigo-500"
            style={{ borderColor: 'var(--border)' }}>
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} style={{ color: 'var(--text-dim)' }} />}
          </button>
        </div>
      </div>

      {/* AI Settings */}
      <div className="p-5 rounded-xl border mb-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <h2 className="text-sm font-semibold text-white mb-4">AI Configuration</h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-dim)' }}>OpenAI API Key</label>
            <input type="password" value={form.openaiApiKey}
              onChange={e => setForm({ ...form, openaiApiKey: e.target.value })}
              placeholder="sk-..."
              className="w-full px-3 py-2.5 rounded-lg text-sm text-white border outline-none focus:border-indigo-500"
              style={{ background: 'var(--bg)', borderColor: 'var(--border)' }} />
          </div>
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-dim)' }}>Notification Email</label>
            <input type="email" value={form.notificationEmail}
              onChange={e => setForm({ ...form, notificationEmail: e.target.value })}
              placeholder="team@company.com"
              className="w-full px-3 py-2.5 rounded-lg text-sm text-white border outline-none focus:border-indigo-500"
              style={{ background: 'var(--bg)', borderColor: 'var(--border)' }} />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="p-5 rounded-xl border mb-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <h2 className="text-sm font-semibold text-white mb-4">Notifications</h2>
        {[
          { key: 'postGithubComments', label: 'Post review as GitHub PR comment' },
          { key: 'sendEmailSummary', label: 'Send email summary after review' },
        ].map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between py-2">
            <span className="text-sm" style={{ color: 'var(--text)' }}>{label}</span>
            <button onClick={() => setForm({ ...form, [key]: !(form as any)[key] })}
              className="w-10 h-5 rounded-full transition-all relative"
              style={{ background: (form as any)[key] ? '#6366f1' : 'var(--border)' }}>
              <span className="absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all"
                style={{ left: (form as any)[key] ? '22px' : '2px' }} />
            </button>
          </div>
        ))}
      </div>

      <button onClick={handleSave}
        className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all"
        style={{ background: saved ? '#22c55e' : '#6366f1' }}>
        {saved ? '✓ Saved!' : 'Save Settings'}
      </button>
    </div>
  );
}
