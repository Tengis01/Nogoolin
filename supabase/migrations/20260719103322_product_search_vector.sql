-- ============================================================
-- 0004 product_search_vector — FR-PUB-014 multi-script search
-- Generated tsvector column over name + name_en + search_tags so a single
-- websearch full-text query matches Cyrillic, English, and tag terms.
-- The API additionally transliterates Latin queries to Cyrillic and
-- searches both forms (SEQ-003). Never edit once applied.
-- ============================================================

-- array_to_string is only STABLE; generated columns need IMMUTABLE.
create or replace function public.search_tags_text(tags text[])
returns text
language sql
immutable
as $$
  select coalesce(array_to_string(tags, ' '), '')
$$;

alter table public.products
  add column search_vector tsvector
  generated always as (
    to_tsvector(
      'simple',
      coalesce(name, '') || ' ' ||
      coalesce(name_en, '') || ' ' ||
      public.search_tags_text(search_tags)
    )
  ) stored;

create index idx_products_search_vector
  on public.products using gin (search_vector);

-- Superseded by search_vector (which also covers search_tags); the original
-- expression index from 0001 is dropped to avoid double write amplification.
drop index if exists public.idx_products_search;
