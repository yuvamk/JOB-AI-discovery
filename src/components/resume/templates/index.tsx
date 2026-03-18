import { ModernTemplate, ClassicTemplate } from './TemplateSet1';
import { CreativeTemplate, ExecutiveTemplate } from './TemplateSet2';
import { TechTemplate, MinimalTemplate } from './TemplateSet3';
import { ResumeContent } from './types';

export const TEMPLATES = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  creative: CreativeTemplate,
  executive: ExecutiveTemplate,
  tech: TechTemplate,
  minimal: MinimalTemplate,
};

export type TemplateId = keyof typeof TEMPLATES;

export function getTemplate(id: string) {
  return TEMPLATES[id as TemplateId] || ModernTemplate;
}

export * from './types';
