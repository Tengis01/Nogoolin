# Proposal

## Why

The public product catalog supports URL-based category and search filters, but its result count does not explicitly summarize the active filters. A concise summary could help visitors understand the current view. This is a hypothetical setup test, not an approved product change.

## What Changes

- Propose a small, readable summary of active category and/or search filters on `/products`.
- Keep existing URL-based filtering, pagination, result count, and empty-state behavior.
- Do not change API contracts, database schema, authentication, or unrelated pages.
- Do not implement this proposal until it is reviewed and approved.

## Capabilities

### New Capabilities

- `catalog-active-filter-summary`: Describe when and how the catalog exposes its active filters to visitors.

### Modified Capabilities

None. This project has no existing OpenSpec capabilities to modify.

## Impact

Potentially the existing public products page and its UI tests. No dependency or backend change is proposed. Exact copy and placement remain open for review against the current design rules.
