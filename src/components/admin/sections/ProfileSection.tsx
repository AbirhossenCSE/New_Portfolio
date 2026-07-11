import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  User,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Plus,
  Trash2,
  Lock,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAdminAuth } from "../AdminAuthContext";
import { ProfileItem } from "../types";

export default function ProfileSection() {
  const { token, fetchWithAuth } = useAdminAuth();
  const queryClient = useQueryClient();
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Profile Form state
  const [profName, setProfName] = useState("");
  const [profFullName, setProfFullName] = useState("");
  const [profRoles, setProfRoles] = useState("");
  const [profIntro, setProfIntro] = useState("");
  const [profAvailability, setProfAvailability] = useState("");
  const [profResumeUrl, setProfResumeUrl] = useState("");
  const [profHomeImage, setProfHomeImage] = useState("");
  const [profAboutImage, setProfAboutImage] = useState("");
  const [profEmail, setProfEmail] = useState("");
  const [profPhone, setProfPhone] = useState("");
  const [profPhoneIntl, setProfPhoneIntl] = useState("");
  const [profWhatsapp, setProfWhatsapp] = useState("");
  const [profLocation, setProfLocation] = useState("");
  const [profGithub, setProfGithub] = useState("");
  const [profLinkedin, setProfLinkedin] = useState("");
  const [profFacebook, setProfFacebook] = useState("");
  const [profAboutParagraphs, setProfAboutParagraphs] = useState<string[]>([]);
  const [profAboutTags, setProfAboutTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState("");
  const [profQuickInfo, setProfQuickInfo] = useState<
    { label: string; value: string }[]
  >([
    { label: "Location", value: "" },
    { label: "Education", value: "" },
    { label: "Experience", value: "" },
    { label: "Focus", value: "" },
  ]);
  const [profileFormSuccess, setProfileFormSuccess] = useState(false);
  const [profileFormError, setProfileFormError] = useState<string | null>(null);

  // Fetch profile query
  const profileQuery = useQuery<ProfileItem>({
    queryKey: ["profile", token],
    queryFn: async () => {
      const res = await fetch(`${apiUrl}/api/profile`);
      if (!res.ok) throw new Error("Failed to load profile.");
      return res.json();
    },
    enabled: !!token,
  });

  // Sync profile data state once loaded from server
  useEffect(() => {
    if (profileQuery.data) {
      const p = profileQuery.data;
      setProfName(p.name || "");
      setProfFullName(p.fullName || "");
      setProfRoles(p.roles ? p.roles.join(", ") : "");
      setProfIntro(p.intro || "");
      setProfAvailability(p.availability || "");
      setProfResumeUrl(p.resumeUrl || "");
      setProfHomeImage(p.homeImage || "");
      setProfAboutImage(p.aboutImage || "");
      setProfEmail(p.email || "");
      setProfPhone(p.phone || "");
      setProfPhoneIntl(p.phoneIntl || "");
      setProfWhatsapp(p.whatsapp || "");
      setProfLocation(p.location || "");
      setProfGithub(p.socials?.github || "");
      setProfLinkedin(p.socials?.linkedin || "");
      setProfFacebook(p.socials?.facebook || "");
      setProfAboutParagraphs(p.aboutParagraphs || []);
      setProfAboutTags(p.aboutTags || []);

      // Re-hydrate quickInfo array labels safely
      const defaultLabels = ["Location", "Education", "Experience", "Focus"];
      const loadedQuickInfo = defaultLabels.map((lbl) => {
        const found = p.quickInfo?.find((qi) => qi.label === lbl);
        return { label: lbl, value: found ? found.value : "" };
      });
      setProfQuickInfo(loadedQuickInfo);
    }
  }, [profileQuery.data]);

  // Profile update mutation
  const profileMutation = useMutation({
    mutationFn: async (data: Omit<ProfileItem, "_id">) => {
      const res = await fetchWithAuth(`${apiUrl}/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save profile changes.");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setProfileFormSuccess(true);
      setTimeout(() => setProfileFormSuccess(false), 4000);
    },
    onError: (err: Error) => {
      setProfileFormError(err.message || "An error occurred.");
    },
  });

  const handleQuickInfoChange = (index: number, val: string) => {
    const updated = [...profQuickInfo];
    updated[index].value = val;
    setProfQuickInfo(updated);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = newTagInput.trim();
      if (val && !profAboutTags.includes(val)) {
        setProfAboutTags([...profAboutTags, val]);
        setNewTagInput("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setProfAboutTags(profAboutTags.filter((t) => t !== tagToRemove));
  };

  const handleParagraphChange = (index: number, val: string) => {
    const updated = [...profAboutParagraphs];
    updated[index] = val;
    setProfAboutParagraphs(updated);
  };

  const handleRemoveParagraph = (index: number) => {
    setProfAboutParagraphs(profAboutParagraphs.filter((_, i) => i !== index));
  };

  const handleAddParagraph = () => {
    setProfAboutParagraphs([...profAboutParagraphs, ""]);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileFormError(null);

    const rolesArray = profRoles
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean);

    if (rolesArray.length === 0) {
      setProfileFormError("Please add at least one role.");
      return;
    }

    const data = {
      name: profName,
      fullName: profFullName,
      roles: rolesArray,
      intro: profIntro,
      availability: profAvailability,
      resumeUrl: profResumeUrl,
      homeImage: profHomeImage,
      aboutImage: profAboutImage,
      email: profEmail,
      phone: profPhone,
      phoneIntl: profPhoneIntl,
      whatsapp: profWhatsapp,
      location: profLocation,
      socials: {
        github: profGithub,
        linkedin: profLinkedin,
        facebook: profFacebook,
      },
      aboutParagraphs: profAboutParagraphs.filter((p) => p.trim() !== ""),
      aboutTags: profAboutTags,
      quickInfo: profQuickInfo,
    };

    profileMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5 gap-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground shadow-soft shrink-0">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              Site Profile Details
            </h2>
            <p className="text-sm text-muted-foreground">
              Configure the global brand identity, bio metrics, and social urls
            </p>
          </div>
        </div>
      </div>

      {profileQuery.isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-border bg-card/20">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          {profileFormError && (
            <div className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{profileFormError}</span>
            </div>
          )}

          {profileFormSuccess && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-500">
              <CheckCircle className="h-5 w-5 shrink-0" />
              <span>Profile changes saved successfully!</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* General Settings */}
            <Card className="border-border bg-card/40 backdrop-blur-md shadow-soft rounded-2xl">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  General Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Short Name</label>
                    <Input
                      value={profName}
                      onChange={(e) => setProfName(e.target.value)}
                      required
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">
                      Full Legal Name
                    </label>
                    <Input
                      value={profFullName}
                      onChange={(e) => setProfFullName(e.target.value)}
                      required
                      className="rounded-xl"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">
                    Availability Status
                  </label>
                  <Input
                    value={profAvailability}
                    onChange={(e) => setProfAvailability(e.target.value)}
                    placeholder="E.g. Available for work"
                    required
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">
                    Roles (comma-separated list)
                  </label>
                  <Input
                    value={profRoles}
                    onChange={(e) => setProfRoles(e.target.value)}
                    required
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">
                    Intro Description
                  </label>
                  <Textarea
                    value={profIntro}
                    onChange={(e) => setProfIntro(e.target.value)}
                    rows={3}
                    required
                    className="rounded-xl"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact & Location */}
            <Card className="border-border bg-card/40 backdrop-blur-md shadow-soft rounded-2xl">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Contact & Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={profEmail}
                      onChange={(e) => setProfEmail(e.target.value)}
                      required
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Location</label>
                    <Input
                      value={profLocation}
                      onChange={(e) => setProfLocation(e.target.value)}
                      required
                      className="rounded-xl"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">
                      Phone Display
                    </label>
                    <Input
                      value={profPhone}
                      onChange={(e) => setProfPhone(e.target.value)}
                      required
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">
                      Phone (Intl Format)
                    </label>
                    <Input
                      value={profPhoneIntl}
                      onChange={(e) => setProfPhoneIntl(e.target.value)}
                      required
                      className="rounded-xl"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">WhatsApp Link</label>
                  <Input
                    value={profWhatsapp}
                    onChange={(e) => setProfWhatsapp(e.target.value)}
                    required
                    className="rounded-xl"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Visuals & Assets */}
            <Card className="border-border bg-card/40 backdrop-blur-md shadow-soft rounded-2xl">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Visual Assets & Resume
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">
                    Hero Image URL
                  </label>
                  <Input
                    value={profHomeImage}
                    onChange={(e) => setProfHomeImage(e.target.value)}
                    required
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">
                    About Image URL
                  </label>
                  <Input
                    value={profAboutImage}
                    onChange={(e) => setProfAboutImage(e.target.value)}
                    required
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">
                    Resume PDF Link
                  </label>
                  <Input
                    value={profResumeUrl}
                    onChange={(e) => setProfResumeUrl(e.target.value)}
                    required
                    className="rounded-xl"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Social Handles */}
            <Card className="border-border bg-card/40 backdrop-blur-md shadow-soft rounded-2xl">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Social Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">GitHub URL</label>
                  <Input
                    value={profGithub}
                    onChange={(e) => setProfGithub(e.target.value)}
                    required
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">LinkedIn URL</label>
                  <Input
                    value={profLinkedin}
                    onChange={(e) => setProfLinkedin(e.target.value)}
                    required
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Facebook URL</label>
                  <Input
                    value={profFacebook}
                    onChange={(e) => setProfFacebook(e.target.value)}
                    required
                    className="rounded-xl"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Info Grid */}
          <Card className="border-border bg-card/40 backdrop-blur-md shadow-soft rounded-2xl">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Quick Info Cards (Exactly 4 pairs)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {profQuickInfo.map((qi, idx) => (
                  <div
                    key={qi.label}
                    className="space-y-1 p-3 rounded-xl border border-border/30 bg-muted/10"
                  >
                    <span className="text-xs font-bold text-primary">
                      {qi.label}
                    </span>
                    <Input
                      value={qi.value}
                      onChange={(e) =>
                        handleQuickInfoChange(idx, e.target.value)
                      }
                      placeholder={`Value for ${qi.label}`}
                      required
                      className="rounded-xl h-9 mt-1"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Repeatable Biography Paragraphs */}
            <Card className="border-border bg-card/40 backdrop-blur-md shadow-soft rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Biography Paragraphs
                </CardTitle>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddParagraph}
                  className="cursor-pointer h-8 rounded-lg text-xs bg-muted/65 text-foreground hover:bg-muted"
                >
                  <Plus className="h-3 w-3 mr-1" /> Add Paragraph
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {profAboutParagraphs.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No paragraphs added. Click add above.
                  </p>
                ) : (
                  profAboutParagraphs.map((para, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <span className="font-mono text-xs text-muted-foreground mt-2 shrink-0">
                        #{index + 1}
                      </span>
                      <Textarea
                        value={para}
                        onChange={(e) =>
                          handleParagraphChange(index, e.target.value)
                        }
                        placeholder="Write bio content..."
                        rows={3}
                        required
                        className="rounded-xl flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveParagraph(index)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Biography Skill Tags */}
            <Card className="border-border bg-card/40 backdrop-blur-md shadow-soft rounded-2xl">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Biography Skill Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-1.5 p-3 min-h-[80px] rounded-xl border border-border/40 bg-muted/10">
                  {profAboutTags.length === 0 ? (
                    <span className="text-xs text-muted-foreground">
                      No tags configured yet. Add them below.
                    </span>
                  ) : (
                    profAboutTags.map((tag) => (
                      <Badge
                        key={tag}
                        className="bg-primary/20 text-foreground border border-primary/20 flex items-center gap-1 text-[10px] pl-2 pr-1.5 py-0.5"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-destructive hover:bg-destructive/15 rounded-full p-0.5 cursor-pointer"
                        >
                          <Lock className="h-2 w-2" />{" "}
                          {/* Small cross equivalent */}
                        </button>
                      </Badge>
                    ))
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Add New Tag</label>
                  <Input
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Type a tag (e.g. Next.js) and press Enter"
                    className="rounded-xl"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-3 border-t border-border pt-6">
            <Button
              type="submit"
              disabled={profileMutation.isPending}
              className="cursor-pointer rounded-xl bg-gradient-primary text-primary-foreground font-semibold px-6 shadow-soft hover:shadow-lift transition-all duration-300"
            >
              {profileMutation.isPending ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Profile Changes
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
