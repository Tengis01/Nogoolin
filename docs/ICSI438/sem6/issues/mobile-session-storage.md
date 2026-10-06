# Mobile auth session-ийг encrypted storage-д шилжүүлэх

**Төлөв:** локал issue draft; GitLab project/issue дугаар байхгүй.
**Хариуцах:** Тэнгис. **Priority:** High. Хугацаа тогтоогоогүй.

## Асуудал

[`apps/mobile/lib/supabase.ts`](../../../../apps/mobile/lib/supabase.ts) нь Supabase
auth session-ийг AsyncStorage-д persist хийдэг. Phase-0 security §5.2 encrypted
storage шаардсан. Хуучин `TODO(Phase 2)` нь шийдэгдсэн ажил биш; зөвхөн хугацааны хуучин
тэмдэглэгээ байсан. Түүний SecureStore хэмжээний тайлбарыг одоогийн платформ/version-тэй
шалгаагүй тул хэрэгжүүлэх заавар болгон хадгалаагүй.

## Хийх ажил

Mobile орчинд тохирох encrypted storage adapter сонгох. Key management, session-ийн
хэмжээ, existing session migration болон logout cleanup-ийг хамтад нь шийдэх.
Хэрэгжүүлэхээс өмнө тухайн SDK-ийн одоогийн албан documentation-ийг шалгах.

## Acceptance criteria

- Persist хийсэн session plaintext байдлаар AsyncStorage-д үлдэхгүй.
- Login → app restart → session restore болон token refresh ажиллана.
- Logout нь session болон холбогдох local key/data-г цэвэрлэнэ.
- Existing session migration эсвэл аюулгүй дахин login хийх замтай байна.
- Storage unavailable/corrupt үед crash болон credential log гарахгүй.
- Android/iOS дээрх бодит шалгалтын үр дүнг тэмдэглэнэ.

## Verification

Implementation хийгдээгүй. GitLab issue үүссэн үед энд URL/ID-г тэмдэглэж,
эх comment-ийг `TODO(#actual-id)` хэлбэрт шилжүүлнэ. Дугаар зохиохгүй.

Эх: [security §5.2](../../../phase-0/08-security.md), mobile source-ийн `auth.storage`.
