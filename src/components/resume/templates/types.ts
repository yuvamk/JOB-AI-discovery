export interface ResumeContent {
  basics: {
    name: string;
    label: string;
    email: string;
    phone: string;
    url?: string;
    location: string;
    summary: string;
    profiles?: {
      network: string;
      username: string;
      url: string;
    }[];
  };
  work: {
    company: string;
    position: string;
    location: string;
    duration: string;
    summary: string;
    highlights: string[];
  }[];
  education: {
    institution: string;
    area: string;
    studyType: string;
    year: string;
    gpa?: string;
  }[];
  skills: {
    name: string;
    level?: string;
    keywords: string[];
  }[];
  projects: {
    name: string;
    description: string;
    highlights: string[];
    keywords: string[];
    url?: string;
  }[];
  awards?: {
    title: string;
    date: string;
    awarder: string;
    summary: string;
  }[];
  certificates?: {
    name: string;
    date: string;
    issuer: string;
    url?: string;
  }[];
}
