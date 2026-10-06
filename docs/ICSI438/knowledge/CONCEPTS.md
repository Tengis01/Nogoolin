# ICSI438 — Recurring Concepts

[Home](../COURSE-HOME.md) · [Roadmap](../COURSE-ROADMAP.md)

- **Audience/documentation type:** A W01-ийн User/Developer/Operations/Process нь existing Sem1-ийн Getting Started/Tutorial/Reference/API-аас өөр ангилал. Нэг ангиллыг нөгөөгөөр далд сольж болохгүй ([Sem1](../sem1/README.md)).
- **Testable requirement:** ID, source, priority, owner, measurable verification. Example timeout/size/status нь өөрийн project requirement автоматаар болохгүй (A х.4; [Sem3](../sem3/README.md)).
- **Traceability:** FR/NFR → design/C4/ADR → verification evidence. File/code path байгаа нь implemented indicator; test result байхгүй бол verified биш ([Sem3](../sem3/README.md), [Sem4](../sem4/README.md)).
- **Architecture view:** arc42 хэсэг нь ямар асуултад хариулахыг тогтооно; C4 context/container/component, runtime sequence өөр түвшин. Shared schema нь library, deployable container биш ([Sem4](../sem4/README.md)).
- **ADR:** бодит decision, alternatives, consequences, constraints. UE-4-ийн зориудын “Magic Container” Before нь production architecture биш ([UE-4](../sem4/wiki/ue4-rework.md)).
- **Trustworthy sample:** explained/concise/clear/usable/trustworthy; actual response vs clearly labelled mock ялгаатай. AI text/score-ийг evidence гэж үзэхгүй ([Sem5 source](../sem5/README.md)).
- **Durable documentation:** reader-first, CI-green, ownership, successor/sunset; metric бүр claim ба action-тай (B х.2–4).
- **Completion:** local artifact, review, runtime test, publication, submission, teacher grade тусдаа төлөв. SRS/M milestone label нь calendar week-тэй адил биш.

Theory-г lab бүрт давтахгүй; шинэ lesson нь аль source/result-оос гарсныг холбоно.

- **Code comment verification:** validation/auth can belong to the controller, while the service performs a different check. A lifecycle arrow does not prove enforced transitions; mutation followed by audit is not automatically transactional ([Sem6 audit](../sem6/bhatti_audit_table.md)).
- **Detector evidence:** a seeded ghost method/type can prove that reflection rejects missing symbols. It cannot prove that a real model invented that API ([Sem6 provenance](../sem6/audit/provenance.md)).
