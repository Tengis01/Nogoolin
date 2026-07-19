import type { SupabaseClient } from '@supabase/supabase-js';
import type { FileStorage } from '../types.js';
import { upstreamError } from '../../lib/errors.js';

// Supabase Storage implementation of the FileStorage port.
// Uses service_role (storage.objects has admin-only write policies) —
// only reached behind requireAdmin. Upload failures map to 502
// (06-api-spec UC-ADM-005 Exception Flow).
export function createSupabaseFileStorage(client: SupabaseClient): FileStorage {
  return {
    async uploadPublic(bucket, path, data, contentType) {
      const { error } = await client.storage
        .from(bucket)
        .upload(path, data, { contentType, upsert: false });
      if (error) {
        throw upstreamError(`Storage upload failed: ${error.message}`, 'STORAGE_UPLOAD_FAILED');
      }
      const { data: pub } = client.storage.from(bucket).getPublicUrl(path);
      return pub.publicUrl;
    },

    async remove(bucket, path) {
      const { error } = await client.storage.from(bucket).remove([path]);
      if (error) {
        throw upstreamError(`Storage delete failed: ${error.message}`, 'STORAGE_DELETE_FAILED');
      }
    },
  };
}
