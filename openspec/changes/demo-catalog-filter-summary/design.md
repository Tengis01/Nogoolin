# Design

## Context

See [proposal.md](proposal.md). The existing server-rendered `/products` page reads category and search from URL parameters, fetches categories and products, and already renders a result count, filters, pagination, and an empty state. The new [behavior spec](specs/catalog-active-filter-summary/spec.md) concerns presentation only.

## Goals / Non-Goals

**Goals:** Keep the summary aligned with the same URL parameters used for the results, and fit it into the current catalog visual language.

**Non-Goals:** No new filtering state, API calls, dependencies, schema changes, or redesign.

## Decisions

- Derive summary content from the existing page data. A separate client state would risk contradicting the URL and add complexity.
- Reuse the fetched category labels where a matching slug exists. Showing only a raw slug would be less readable; exact fallback copy can be chosen during implementation review.
- Keep the summary near the result count or filters, using existing typography and responsive spacing. A modal or separate panel would add unnecessary UI.

## Risks / Trade-offs

- Unknown or stale category slugs could make a label ambiguous → verify the fallback presentation before implementation.
- Long search terms could crowd a small viewport → verify a narrow viewport and wrapping behavior.

## Migration Plan

If approved, implement this as a small page-level UI change and verify the existing filter and empty-state flows. Rollback is reverting that UI change; no data migration is involved. This demo remains unimplemented and unapproved.
