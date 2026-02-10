import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import SkillCard from '@/components/cards/SkillCard';
import EmptyState from '@/components/empty-states/EmptyState';
import { skillService } from '@/services/skillService';
import { BookOpen, Search } from 'lucide-react';

const LearnerSkills = () => {
  const [tab, setTab] = useState<'enrolled' | 'available'>('enrolled');
  const [search, setSearch] = useState('');

  const enrolled = skillService.getEnrolledSkills();
  const available = skillService.getAvailableSkills();
  const skills = tab === 'enrolled' ? enrolled : available;
  const filtered = skills.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase()));

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Skills</h1>
          <p className="text-sm text-muted-foreground mt-1">Track, learn, and maintain your skill portfolio</p>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex bg-muted/50 rounded-lg p-0.5">
            {(['enrolled', 'available'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${tab === t ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {t} ({t === 'enrolled' ? enrolled.length : available.length})
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search skills..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-muted/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title={tab === 'enrolled' ? 'No enrolled skills' : 'No available skills'}
            description={tab === 'enrolled' ? 'Explore available skills to start learning.' : 'All skills are already enrolled.'}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(skill => (
              <SkillCard
                key={skill.id}
                id={skill.id}
                name={skill.name}
                category={skill.category}
                healthScore={skill.healthScore}
                learned={skill.learned}
                enrolled={skill.enrolled}
                nextRecallDate={skill.nextRecallDate}
                modulesCompleted={skill.modules.filter(m => m.completed).length}
                totalModules={skill.modules.length}
              />
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default LearnerSkills;
