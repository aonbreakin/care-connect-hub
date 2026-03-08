import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export type Profile = {
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  status: string;
};

export type Certificate = {
  id: string;
  certificate_name: string;
  certificate_type: string;
  status: string;
  file_url: string;
  created_at: string;
  verified_at: string | null;
};

export type Reward = {
  id: string;
  reward_name: string;
  reward_type: string;
  awarded_at: string;
};

export type Booking = {
  id: string;
  family_id: string;
  caregiver_id: string;
  status: string;
  scheduled_date: string;
  scheduled_time: string;
  duration_hours: number;
  total_price: number;
  notes: string | null;
  created_at: string;
};

export type CaregiverProfile = {
  hourly_rate: number;
  bio: string | null;
  available: boolean;
};

export const useDashboardData = (user: User | null) => {
  const [profile, setProfile] = useState<Profile>({ full_name: null, phone: null, avatar_url: null });
  const [role, setRole] = useState<string | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [caregiverProfile, setCaregiverProfile] = useState<CaregiverProfile>({ hourly_rate: 0, bio: null, available: true });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      Promise.all([fetchProfile(), fetchRole(), fetchCertificates(), fetchRewards(), fetchBookings(), fetchCaregiverProfile()])
        .finally(() => setLoading(false));
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, phone, avatar_url")
      .eq("user_id", user!.id)
      .single();
    if (data) setProfile(data);
    return data;
  };

  const fetchRole = async () => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user!.id)
      .single();
    if (data) setRole(data.role);
  };

  const fetchCertificates = async () => {
    const { data } = await supabase
      .from("certificates")
      .select("id, certificate_name, certificate_type, status, file_url, created_at, verified_at")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });
    if (data) setCertificates(data);
  };

  const fetchRewards = async () => {
    const { data } = await supabase
      .from("certificate_rewards")
      .select("id, reward_name, reward_type, awarded_at")
      .eq("user_id", user!.id)
      .order("awarded_at", { ascending: false });
    if (data) setRewards(data);
  };

  const fetchBookings = async () => {
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .order("scheduled_date", { ascending: true });
    if (data) setBookings(data as Booking[]);
  };

  const fetchCaregiverProfile = async () => {
    const { data } = await supabase
      .from("caregiver_profiles")
      .select("hourly_rate, bio, available")
      .eq("user_id", user!.id)
      .single();
    if (data) setCaregiverProfile(data);
  };

  return {
    profile, setProfile,
    role,
    certificates, setCertificates,
    rewards,
    bookings, setBookings,
    caregiverProfile, setCaregiverProfile,
    loading,
    refetchCertificates: fetchCertificates,
    refetchBookings: fetchBookings,
    refetchCaregiverProfile: fetchCaregiverProfile,
  };
};
