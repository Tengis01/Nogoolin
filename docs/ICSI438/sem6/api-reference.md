# Nogoolin — Service API Reference

Энэ reference нь Nogoolin backend-ийн зургаан service модулийн exported factory,
service type, method болон media input/output interface-ийг хамарна. Controller,
Supabase adapter, hooks, bootstrap, frontend болон shared schema нь энэ reference-ийн
entry point биш. Төслийн бүх exported symbol-ийн бүрэн coverage гэж мэдүүлэхгүй.

## Ашиглах нөхцөл

Controller нь input-ийг Zod schema-аар шалгаж, JWT болон admin эрхийг баталгаажуулсны
дараа service дуудна. Service-ийн UUID параметрүүдийг шууд хэрэглэгчийн request-оос
итгэж авч болохгүй. Repository port-уудыг factory-д constructor dependency шиг өгнө.

`@example` нь тухайн method-ийн хэрэглээг үзүүлэх snippet. Factory жишээний
`productRepository`, `inquiryRepository`, `categoryRepository`, `cartRepository`,
`settingsRepository`, `imageRepository`, `fileStorage`, `auditLogRepository` нь caller-ийн
бэлтгэсэн typed dependency. Method жишээний `service` нь тухайн модулийн factory-аас
үүссэн object. `productId`, `categoryId`, `emptyCategoryId`, `imageId`, `inquiryId`,
`customerId`, `adminId` нь test fixture UUID; `imageBytes` нь image Buffer байна.
Бодит хэрэглэгчийн мэдээлэл, credential эсвэл database connection шаардсан жишээ биш.

Нэг домэйн жишээ хэрэглэв: **Ногоон Дарь эх бүтээгдэхүүн → хадгалах → inquiry → admin
хариуцах**. Local repository double ашигласан inquiry жишээнүүдийг Sem6 test шалгана;
бусад service жишээнүүдийн type/syntax-ийг шалгах бөгөөд live database test гэж үзэхгүй.

## Алдаа ба side effect

`@throws` нь async method-ийн rejected Promise-ийг тайлбарлана. Repository болон audit
алдаа caller руу дамжина. Mutation ба audit log нэг transaction биш тул audit failure
өмнөх өөрчлөлтийг rollback хийсэн гэж үзэж болохгүй. Inquiry status утгууд нь `new`,
`contacted`, `closed`; service нь заавал энэ дарааллаар шилжих дүрэм хэрэгжүүлээгүй.

## Internal exclusion

`paginate`, `prepareSearch`, `validateFile`, `storagePath`, `pathFromUrl` болон локал
`Paginated` нь implementation detail. Эх кодод exclusion тайлбар нэмсэн; public
entrypoint болгон export хийгээгүй. Repository/schema нь referenced contract бөгөөд
тэдгээрийн бүх field-ийн документацийг энэ багц орлоогүй. TypeDoc-ийн `notExported`
warning-ийг зөвхөн энэ scope-ийн гадаад contract-д зориулан унтраасан; missing docs,
invalid link болон compiler error-ийн шалгалт хэвээр байна.

[Sem6 эх ба audit](https://github.com/Tengis01/Nogoolin/tree/main/docs/ICSI438/sem6)

[TypeDoc validation](https://typedoc.org/documents/Options.Validation.html) ·
[GitLab Pages](https://docs.gitlab.com/user/project/pages/getting_started/pages_from_scratch/)
