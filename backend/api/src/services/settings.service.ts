import type { PublicSettings } from '@nogoolin/validation-schemas';
import type { SettingsRepository } from '../repositories/types.js';

// Business logic layer — depends on the repository INTERFACE only
// (never on Supabase). No database queries here (NFR-MAIN-001).
export function createSettingsService(repo: SettingsRepository) {
  return {
    // FR-PUB-009: frontends read this to show/hide order UI (FR-PUB-010)
    async getPublicSettings(): Promise<PublicSettings> {
      return repo.getPublicSettings();
    },
  };
}

export type SettingsService = ReturnType<typeof createSettingsService>;
