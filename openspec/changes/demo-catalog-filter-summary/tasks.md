# Tasks

## 1. Catalog summary

- [ ] 1.1 Add a concise active-filter summary to `/products` using the page's existing category/search data; verify manually that unfiltered, category-only, search-only, and combined URLs show the expected summary state.
- [ ] 1.2 Preserve existing filter, pagination, result-count, and empty-state behavior; verify those flows through the project's documented checks and a targeted local browser run.

## 2. Responsive integration

- [ ] 2.1 Match the existing catalog design language and ensure long search text wraps; verify the rendered page at desktop and one small viewport with Playwright CLI.
- [ ] 2.2 Review the focused diff against the spec and run applicable project typecheck/lint/tests; verify no API, schema, auth, or unrelated page changes were introduced.
