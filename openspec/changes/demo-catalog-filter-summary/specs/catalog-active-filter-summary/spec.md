# Spec Delta

## Purpose

Make the active filters on the public product listing visible, so visitors can tell which category or search term is shaping the current results.

## ADDED Requirements

### Requirement: Active catalog filters are summarized
The public products page SHALL display a concise, readable summary of active category and search filters when at least one of those filters is applied. The summary SHALL reflect the filters used for the displayed results.

#### Scenario: No filters
- **WHEN** a visitor opens `/products` without a category or search filter
- **THEN** no active-filter summary is shown

#### Scenario: Category filter
- **WHEN** a visitor views results filtered by category
- **THEN** the summary identifies the active category

#### Scenario: Search filter
- **WHEN** a visitor views results filtered by a search term
- **THEN** the summary identifies that search term

#### Scenario: Both filters
- **WHEN** a visitor views results filtered by both category and search term
- **THEN** the summary identifies both active filters

### Requirement: Existing catalog behavior remains available
The products page SHALL retain its current URL-based filtering, pagination, result count, and empty-state reset behavior when the summary is present.

#### Scenario: Filtered page navigation
- **WHEN** a visitor moves between pages of filtered results
- **THEN** the same filters remain active and the summary matches them

#### Scenario: No matching products
- **WHEN** active filters yield no matching products
- **THEN** the existing empty state remains available and the summary still identifies the active filters
