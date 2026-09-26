import { useQuery } from "@tanstack/react-query";
import { profile as staticProfile } from "@/data/portfolio";

export interface IProfile {
  name: string;
  fullName: string;
  roles: string[];
  intro: string;
  availability: string;
  resumeUrl: string;
  homeImage: string;
  aboutImage: string;
  email: string;
  phone: string;
  phoneIntl: string;
  whatsapp: string;
  location: string;
  socials: {
    github: string;
    linkedin: string;
    facebook: string;
  };
  aboutParagraphs: string[];
  aboutTags: string[];
  quickInfo: {
    label: string;
    value: string;
  }[];
}

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function useProfile() {
  const query = useQuery<IProfile>({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch(`${apiUrl}/api/profile`);
      if (!res.ok) {
        throw new Error("Failed to load profile data.");
      }
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache stale
  });

  const profile = query.data || staticProfile;
  const resumeUrl = profile.resumeUrl || staticProfile.resumeUrl;

  return {
    ...query,
    profile,
    resumeUrl,
  };
}
