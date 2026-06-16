-- Admin schema for Checkmate Property Transparency
-- Safe to re-run: uses IF NOT EXISTS / DROP IF EXISTS patterns

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- Shared trigger function
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- admin_users
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('admin', 'editor')),
  status        TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  last_login_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS admin_users_email_idx ON admin_users (email);
CREATE INDEX IF NOT EXISTS admin_users_status_idx ON admin_users (status);

DROP TRIGGER IF EXISTS admin_users_set_updated_at ON admin_users;
CREATE TRIGGER admin_users_set_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- site_content
-- ============================================================
CREATE TABLE IF NOT EXISTS site_content (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key        TEXT NOT NULL UNIQUE,
  label      TEXT NOT NULL,
  value      TEXT NOT NULL DEFAULT '',
  type       TEXT NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'textarea', 'url')),
  "group"    TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS site_content_group_idx ON site_content ("group");

DROP TRIGGER IF EXISTS site_content_set_updated_at ON site_content;
CREATE TRIGGER site_content_set_updated_at
  BEFORE UPDATE ON site_content
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

INSERT INTO site_content (key, label, value, type, "group") VALUES
  ('transparency.hero.eyebrow',       'Hero — pill/eyebrow',              'Transparência em tempo real', 'text', 'hero'),
  ('transparency.hero.title',         'Hero — título (antes do destaque)', 'Da aquisição à venda, acompanhe cada projeto com', 'text', 'hero'),
  ('transparency.hero.highlight',     'Hero — destaque gradiente',         'transparência real', 'text', 'hero'),
  ('transparency.hero.subtitle',      'Hero — subtítulo',                 'Veja status, andamento, fotos, vídeos, valores investidos e resultados dos projetos publicados pela Checkmate Property.', 'textarea', 'hero'),
  ('transparency.hero.primary_cta',   'Hero — CTA principal',             'Ver projetos', 'text', 'hero'),
  ('transparency.hero.secondary_cta', 'Hero — CTA secundário',            '', 'text', 'hero'),
  ('transparency.trust.item_1',       'Confiança — item 1',               'Dados reais', 'text', 'trust'),
  ('transparency.trust.item_2',       'Confiança — item 2',               'Atualizações constantes', 'text', 'trust'),
  ('transparency.trust.item_3',       'Confiança — item 3',               'Visibilidade por projeto', 'text', 'trust'),
  ('transparency.projects.title',     'Projetos — título',                'Projetos em destaque', 'text', 'projects'),
  ('transparency.projects.subtitle',  'Projetos — subtítulo',             'Acompanhe os imóveis publicados pela Checkmate Property.', 'text', 'projects'),
  ('transparency.footer.text',        'Footer — texto',                   'Checkmate Property — Transparência em investimentos imobiliários.', 'text', 'footer')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- site_settings
-- ============================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key        TEXT NOT NULL UNIQUE,
  value      TEXT NOT NULL DEFAULT '',
  type       TEXT NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'url', 'image')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS site_settings_set_updated_at ON site_settings;
CREATE TRIGGER site_settings_set_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

INSERT INTO site_settings (key, value, type) VALUES
  ('portal.name',             'Checkmate Property Transparency', 'text'),
  ('portal.logo_url',         '', 'image'),
  ('portal.logo_compact_url', '', 'image'),
  ('portal.footer_text',      'Checkmate Property — Transparência em investimentos imobiliários.', 'text')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- RLS
-- ============================================================
ALTER TABLE admin_users   ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content  ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_users_no_public_access" ON admin_users;
CREATE POLICY "admin_users_no_public_access"
  ON admin_users FOR ALL
  USING (false);

DROP POLICY IF EXISTS "site_content_public_read" ON site_content;
CREATE POLICY "site_content_public_read"
  ON site_content FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "site_settings_public_read" ON site_settings;
CREATE POLICY "site_settings_public_read"
  ON site_settings FOR SELECT
  USING (true);

-- ============================================================
-- Storage buckets
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'site-assets',
    'site-assets',
    true,
    5242880,
    ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
  ),
  (
    'property-media',
    'property-media',
    true,
    52428800,
    ARRAY['image/png', 'image/jpeg', 'image/webp', 'video/mp4', 'video/webm']
  )
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "site_assets_public_read" ON storage.objects;
CREATE POLICY "site_assets_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-assets');

DROP POLICY IF EXISTS "property_media_public_read" ON storage.objects;
CREATE POLICY "property_media_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'property-media');
