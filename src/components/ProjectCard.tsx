import React from 'react';
import { ExternalLink, Github } from 'lucide-react';

interface Tag {
  label: string;
}

interface ProjectCardProps {
  index: number;
  title: string;
  subtitle: string;
  description: string;
  details: string[];
  tags: Tag[];
  githubUrl?: string;
  liveUrl?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  index,
  title,
  subtitle,
  description,
  details,
  tags,
  githubUrl,
  liveUrl,
}) => {
  return (
    <div className="group relative border border-[#1E1E1E] bg-[#0D0D0D] hover:border-[#0077FF]/40 transition-all duration-300 overflow-hidden">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#0077FF]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Index badge */}
      <div className="absolute top-4 right-4 font-mono text-xs text-[#333] select-none">
        {String(index).padStart(2, '0')}
      </div>

      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="mb-4">
          <p className="font-mono text-[10px] text-[#0077FF] tracking-[0.2em] uppercase mb-2">
            {subtitle}
          </p>
          <h3 className="text-lg md:text-xl font-bold text-white leading-snug tracking-tight">
            {title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-sm text-[#888] leading-relaxed mb-5 italic">
          "{description}"
        </p>

        {/* Divider */}
        <div className="border-t border-[#1A1A1A] mb-5" />

        {/* Details */}
        <ul className="space-y-2 mb-6">
          {details.map((d, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-[#999]">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-[#0077FF] flex-shrink-0" />
              <span>{d}</span>
            </li>
          ))}
        </ul>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag) => (
            <span
              key={tag.label}
              className="font-mono text-[10px] text-[#0077FF]/80 border border-[#0077FF]/20 bg-[#0077FF]/5 px-2 py-0.5 tracking-wider"
            >
              {tag.label}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-mono text-[#666] hover:text-white border border-[#222] hover:border-[#444] px-3 py-1.5 transition-all duration-200"
            >
              <Github size={12} />
              Source
            </a>
          )}
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-mono text-[#0077FF] border border-[#0077FF]/30 hover:bg-[#0077FF]/10 px-3 py-1.5 transition-all duration-200"
            >
              <ExternalLink size={12} />
              Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
