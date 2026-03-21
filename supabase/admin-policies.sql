-- Run this in Supabase SQL Editor AFTER creating your admin user
-- This allows the authenticated admin to do full CRUD on all tables

-- Projects
create policy "auth full access projects"
  on public.projects for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Testimonials
create policy "auth full access testimonials"
  on public.testimonials for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- About
create policy "auth full access about"
  on public.about for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Services
create policy "auth full access services"
  on public.services for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Education
create policy "auth full access education"
  on public.education for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Tech Stack
create policy "auth full access tech_stack"
  on public.tech_stack for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Contact messages — authenticated can read, update (mark read), delete
create policy "auth full access contact_messages"
  on public.contact_messages for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
