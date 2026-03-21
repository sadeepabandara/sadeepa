-- ============================================================
-- Sadeepa Bandara Portfolio — Supabase Schema
-- 1. Replace supabase/schema.sql with this file
-- 2. Paste into Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- ── 1. Contact messages ──────────────────────────────────────
create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name       text not null,
  email      text not null,
  service    text,
  message    text not null,
  read       boolean not null default false
);

-- ── 2. Projects ──────────────────────────────────────────────
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  number      text not null,
  title       text not null,
  tags        text[] not null default '{}',
  year        text not null,
  url         text,
  image       text,
  featured    boolean not null default true,
  sort_order  integer not null default 0
);

-- ── 3. Testimonials ──────────────────────────────────────────
create table if not exists public.testimonials (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  role        text not null,
  company     text not null,
  text        text not null,
  initials    text not null,
  featured    boolean not null default true,
  sort_order  integer not null default 0
);

-- ── 4. About ─────────────────────────────────────────────────
create table if not exists public.about (
  id            uuid primary key default gen_random_uuid(),
  bio_line1     text not null,
  bio_line2     text,
  stat_years    text not null default '3+',
  stat_projects text not null default '20+',
  stat_clients  text not null default '10+',
  github_url    text,
  linkedin_url  text,
  email         text,
  resume_url    text,
  updated_at    timestamptz not null default now()
);

-- ── 5. Services ──────────────────────────────────────────────
create table if not exists public.services (
  id          uuid primary key default gen_random_uuid(),
  number      text not null,
  icon        text not null,
  title       text not null,
  description text not null,
  tags        text[] not null default '{}',
  sort_order  integer not null default 0,
  active      boolean not null default true
);

-- ── 6. Education ─────────────────────────────────────────────
create table if not exists public.education (
  id          uuid primary key default gen_random_uuid(),
  period      text not null,
  degree      text not null,
  institution text not null,
  description text not null,
  align       text not null default 'top',
  sort_order  integer not null default 0
);

-- ── 7. Tech Stack ────────────────────────────────────────────
create table if not exists public.tech_stack (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  icon_url    text not null,
  underline   text not null,
  row         text not null default 'top',
  sort_order  integer not null default 0,
  active      boolean not null default true
);

-- ════════════════════════════════════════════
-- Row Level Security
-- ════════════════════════════════════════════
alter table public.contact_messages enable row level security;
alter table public.projects          enable row level security;
alter table public.testimonials      enable row level security;
alter table public.about             enable row level security;
alter table public.services          enable row level security;
alter table public.education         enable row level security;
alter table public.tech_stack        enable row level security;

create policy "public insert contact_messages"
  on public.contact_messages for insert with check (true);
create policy "auth read contact_messages"
  on public.contact_messages for select using (auth.role() = 'authenticated');
create policy "public read projects"     on public.projects     for select using (true);
create policy "public read testimonials" on public.testimonials for select using (true);
create policy "public read about"        on public.about        for select using (true);
create policy "public read services"     on public.services     for select using (true);
create policy "public read education"    on public.education    for select using (true);
create policy "public read tech_stack"   on public.tech_stack   for select using (true);

-- ════════════════════════════════════════════
-- REAL SEED DATA — Sadeepa Bandara
-- ════════════════════════════════════════════

-- About
insert into public.about (
  bio_line1, bio_line2,
  stat_years, stat_projects, stat_clients,
  github_url, linkedin_url, email, resume_url
) values (
  'I''m Sadeepa Bandara, a 24-year-old Software Developer & Designer from Sri Lanka, currently based in Australia. I hold a BSc (Hons) in Computing from Coventry University, UK.',
  'As an Investor, Entrepreneur, Developer and Designer, I''m passionate about innovation and growth. I''m pursuing an MSc in Information Technology Management at Deakin University while exploring forex trading and video editing.',
  '3+', '20+', '10+',
  'https://github.com/sadeepabandara',
  'https://linkedin.com/in/sadeepa-bandara',
  'sadeepadexter@gmail.com',
  '/resume.pdf'
);

-- Services (from sadeepa.me/services)
insert into public.services (number, icon, title, description, tags, sort_order) values
  ('01', '◈', 'Web Design & Development',
   'Stunning, user-friendly websites using the latest design trends and development techniques, ensuring a seamless and engaging user experience for all visitors.',
   array['React', 'Next.js', 'Tailwind'], 1),
  ('02', '◉', 'Search Engine Optimization',
   'Boost your online visibility with expert SEO strategies, improving search rankings, driving organic traffic, and increasing conversions for your business.',
   array['SEO', 'Analytics', 'Content'], 2),
  ('03', '◇', 'Graphic Design',
   'Compelling visuals with innovative graphic design, enhancing brand identity and engaging audiences through aesthetically pleasing and effective designs.',
   array['Figma', 'Illustrator', 'Branding'], 3),
  ('04', '⬡', 'Software Development',
   'Custom software solutions, focusing on functionality and innovation to meet your unique business needs and drive digital transformation.',
   array['React', 'Node.js', 'PostgreSQL'], 4),
  ('05', '⬢', 'Video Editing',
   'Professional video editing, transforming raw footage into polished, captivating content tailored to your vision and audience for maximum impact.',
   array['Premiere Pro', 'After Effects'], 5),
  ('06', '◎', 'Game Development',
   'Immersive games blending creativity and technology to deliver captivating experiences across various platforms, engaging players and pushing boundaries.',
   array['Unity', 'C#', 'Game Design'], 6);

-- Education (real qualifications)
insert into public.education (period, degree, institution, description, align, sort_order) values
  ('2021 - 2022', 'Diploma in Information Technology',
   'ESOFT Metro Campus, Sri Lanka',
   'Foundations of programming, networking, database management and software development principles.',
   'top', 1),
  ('2022 - 2023', 'Higher Diploma in Information Technology',
   'ESOFT Metro Campus, Sri Lanka',
   'Advanced software engineering, web development, system analysis and design methodologies.',
   'bottom', 2),
  ('2021 - 2024', 'BSc (Hons) in Computing',
   'Coventry University, UK',
   'Specialised in full-stack development, algorithms, cloud computing, mobile app development and software engineering.',
   'top', 3),
  ('2024 - Present', 'MSc in Information Technology Management',
   'Deakin University, Australia',
   'Advanced IT management, enterprise systems, digital strategy, project management and emerging technologies.',
   'bottom', 4);

-- Tech Stack
insert into public.tech_stack (name, icon_url, underline, row, sort_order) values
  ('React',      'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',             '#61DAFB', 'top', 1),
  ('Next.js',    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',           '#ffffff', 'top', 2),
  ('TypeScript', 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',   '#3178C6', 'top', 3),
  ('Node.js',    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg',           '#83CD29', 'top', 4),
  ('Tailwind',   'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg', '#06B6D4', 'top', 5),
  ('Figma',      'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg',             '#F24E1E', 'top', 6),
  ('PostgreSQL', 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg',   '#336791', 'bottom', 1),
  ('Python',     'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',           '#FFD43B', 'bottom', 2),
  ('Git',        'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg',                 '#F05032', 'bottom', 3),
  ('AWS',        'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg', '#FF9900', 'bottom', 4),
  ('Docker',     'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg',           '#2496ED', 'bottom', 5),
  ('Firebase',   'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg',       '#FFCA28', 'bottom', 6);

-- Projects
insert into public.projects (number, title, tags, year, sort_order) values
  ('001', 'Arcane Studio',     array['Brand Identity', 'Web Design'],       '2025', 1),
  ('002', 'Velour E-Commerce', array['Design', 'Development', 'Motion'],     '2025', 2),
  ('003', 'Meridian Platform', array['UX/UI', 'React'],                      '2024', 3),
  ('004', 'Noir Magazine',     array['Editorial Design', 'Typography'],      '2024', 4),
  ('005', 'Pulse Dashboard',   array['Product Design', 'Data Viz'],          '2024', 5);

-- Testimonials (all 5)
insert into public.testimonials (name, role, company, initials, text, sort_order) values
  ('Anne Smith', 'Customer', 'Client', 'AS',
   'It''s been great working with Sadeepa thus far and I look forward to our continued partnership! I was really surprised by the work quality. This is why you hire an expert and I''m so glad I went with his team so far!',
   1),
  ('Kelly Watkins', 'Customer', 'Client', 'KW',
   'Amazing work! Sadeepa goes the extra mile to deliver a great service. I am so pleased with the website that Sadeepa delivered. He knows how to do business correctly and is always in great communication.',
   2),
  ('Marlene Ogata', 'Customer', 'Client', 'MO',
   'This man did an excellent job! I am really happy and satisfied with the work that was done for me. I would definitely recommend Sadeepa to others and would love to work with them again in the future.',
   3),
  ('Noah Park', 'CTO', 'Meridian', 'NP',
   'Delivered on time, on budget, and somehow still managed to exceed what we thought was possible. Rare combination of technical depth and real design taste. Would hire again in a heartbeat.',
   4),
  ('Maya Lin', 'Creative Director', 'Noir', 'ML',
   'Most designers can make something look good. Few can make something feel like it belongs to your brand at a soul level. Sadeepa is in that second group. Phenomenal to work with.',
   5);




-- ── Quote ─────────────────────────────────────────────────
create table if not exists public.quote (
  id         uuid primary key default gen_random_uuid(),
  text       text not null,
  author     text not null,
  updated_at timestamptz not null default now()
);

alter table public.quote enable row level security;
create policy "public read quote" on public.quote for select using (true);
create policy "auth write quote"  on public.quote for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

insert into public.quote (text, author) values (
  'Rule No. 1 : Never lose money. Rule No. 2 : Never forget Rule No. 1.',
  'Warren Buffett'
);

-- ── Flappy Scores ─────────────────────────────────────────
create table if not exists public.flappy_scores (
  id         uuid primary key default gen_random_uuid(),
  score      integer not null,
  created_at timestamptz not null default now()
);

alter table public.flappy_scores enable row level security;
create policy "public read scores"   on public.flappy_scores for select using (true);
create policy "public insert scores" on public.flappy_scores for insert with check (true);
