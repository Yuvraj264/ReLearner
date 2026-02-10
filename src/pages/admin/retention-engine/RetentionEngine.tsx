import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Zap, Clock, TrendingDown, Save } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { RECALL_INTERVAL_LIST } from '@/constants/recallIntervals';

const RetentionEngine = () => {
  const [decaySensitivity, setDecaySensitivity] = useState(50);
  const [reminderFrequency, setReminderFrequency] = useState('moderate');
  const [intervals, setIntervals] = useState(RECALL_INTERVAL_LIST);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Retention Engine</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure how the platform tracks and prevents skill decay</p>
        </div>

        {/* Decay Sensitivity */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingDown className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Decay Sensitivity</h2>
              <p className="text-xs text-muted-foreground">How aggressively skill scores decay without recall activity</p>
            </div>
          </div>
          <div className="space-y-2">
            <input
              type="range"
              min={10}
              max={100}
              value={decaySensitivity}
              onChange={e => setDecaySensitivity(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Gentle</span>
              <span className="text-foreground font-medium">{decaySensitivity}%</span>
              <span>Aggressive</span>
            </div>
          </div>
        </div>

        {/* Reminder Frequency */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Reminder Frequency</h2>
              <p className="text-xs text-muted-foreground">How often learners receive recall reminders</p>
            </div>
          </div>
          <div className="flex gap-3">
            {['conservative', 'moderate', 'aggressive'].map(freq => (
              <button
                key={freq}
                onClick={() => setReminderFrequency(freq)}
                className={`flex-1 py-2.5 text-xs font-medium rounded-lg border capitalize transition-colors ${
                  reminderFrequency === freq
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted/30 text-muted-foreground border-border hover:border-primary/40'
                }`}
              >
                {freq}
              </button>
            ))}
          </div>
        </div>

        {/* Recall Intervals */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-healthy/10">
              <Zap className="w-5 h-5 text-healthy" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Recall Intervals (days)</h2>
              <p className="text-xs text-muted-foreground">Spaced repetition schedule after skill is learned</p>
            </div>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {intervals.map((day, i) => (
              <div key={i} className="text-center">
                <span className="text-xs text-muted-foreground block mb-1">#{i + 1}</span>
                <input
                  type="number"
                  value={day}
                  onChange={e => {
                    const newIntervals = [...intervals];
                    newIntervals[i] = Number(e.target.value);
                    setIntervals(newIntervals);
                  }}
                  className="w-full px-2 py-1.5 text-sm text-center bg-muted/50 border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-lg text-primary-foreground bg-primary btn-glow"
          >
            <Save className="w-4 h-4" />
            {saved ? 'Saved!' : 'Save Configuration'}
          </motion.button>
        </div>
      </div>
    </PageTransition>
  );
};

export default RetentionEngine;
