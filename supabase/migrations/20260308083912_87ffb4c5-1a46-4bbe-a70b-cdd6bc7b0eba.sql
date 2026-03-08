
-- Caregiver profiles for rate and availability
CREATE TABLE public.caregiver_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  hourly_rate numeric(10,2) NOT NULL DEFAULT 0,
  bio text,
  available boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.caregiver_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view caregiver profiles" ON public.caregiver_profiles
  FOR SELECT USING (true);

CREATE POLICY "Caregivers can insert own profile" ON public.caregiver_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Caregivers can update own profile" ON public.caregiver_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Bookings table
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid NOT NULL,
  caregiver_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  scheduled_date date NOT NULL,
  scheduled_time time NOT NULL,
  duration_hours numeric(4,1) NOT NULL DEFAULT 1,
  total_price numeric(10,2) NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Families can see their own bookings
CREATE POLICY "Families can view own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = family_id);

-- Caregivers can see bookings assigned to them
CREATE POLICY "Caregivers can view assigned bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = caregiver_id);

-- Families can create bookings
CREATE POLICY "Families can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = family_id);

-- Caregivers can update booking status (approve/reject)
CREATE POLICY "Caregivers can update assigned bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = caregiver_id);

-- Triggers for updated_at
CREATE TRIGGER update_caregiver_profiles_updated_at
  BEFORE UPDATE ON public.caregiver_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for bookings
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
