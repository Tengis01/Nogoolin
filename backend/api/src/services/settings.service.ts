import type { PublicSettings } from '@nogoolin/validation-schemas';
import type { SettingsRepository } from '../repositories/types.js';

// Business logic layer — depends on the repository INTERFACE only
// (never on Supabase). No database queries here (NFR-MAIN-001).
/**
 * Нийтийн тохиргоог repository port-оор унших service үүсгэнэ.
 *
 * @param repo - Тохиргоо унших repository.
 * @returns getPublicSettings method бүхий service; үүсгэх үед repository дуудахгүй.
 * @throws Factory өөрөө алдаа шидэхгүй.
 * @example
 * ```ts
 * const service = createSettingsService(settingsRepository);
 * ```
 */
export function createSettingsService(repo: SettingsRepository) {
  return {
    // FR-PUB-009: frontends read this to show/hide order UI (FR-PUB-010)
    /**
     * Нийтийн тохиргоог repository-оос уншина.
     *
     * @returns PublicSettings; delivery_enabled зэрэг нийтийн тохиргоо.
     * @throws Repository-ийн алдаа өөрчлөгдөхгүй дамжина.
     * @example
     * ```ts
     * const settings = await service.getPublicSettings();
     * ```
     */
    async getPublicSettings(): Promise<PublicSettings> {
      return repo.getPublicSettings();
    },
  };
}

/** SettingsService нь createSettingsService-ийн method-уудын inferred contract.
 * @example
 * ```ts
 * type Service = SettingsService;
 * ```
 */
export type SettingsService = ReturnType<typeof createSettingsService>;
