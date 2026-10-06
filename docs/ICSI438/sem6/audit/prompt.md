# AI docstring generation prompt

Тухайн модулийн implementation, repository contract болон controller/schema-г хамт
өгөхдөө доорх prompt-ийг хэрэглэнэ. Credential, `.env`, хэрэглэгчийн бодит өгөгдөл өгөхгүй.

```text
Write JSDoc for the supplied Nogoolin InquiryService factory and all returned methods.
Do not change runtime code or invent methods/types. Include description, @param,
@returns, possible errors and a consistent Nogoolin inquiry @example.
Distinguish controller input validation and authentication from service behavior.
Check whether status transitions and audit logging are transactional; do not assume.
If implementation evidence is absent, state the limitation rather than guess.
Return the annotated module and a list of claims requiring verification.
```

Тусдаа GPT-4/Claude session ажиллуулаагүй. Одоогийн controlled draft-ийн гарал ба
seeded алдааг [provenance](provenance.md)-д тодорхой тэмдэглэсэн.
