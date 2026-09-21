# Баримтжуулалтын дөрвөн төрөл

US-1.1 / DOCUMENTATION TYPES MATRIX

Гурван бодит төсөл ба RAG chatbot-д хэрэглэх шийдэл

# Төслийг сонгосон үндэслэл

Би 2026 оны зун дадлагын ажлын хүрээнд хийсэн Document RAG Chatbot төслөө сонгосон. Хэрэглэгч PDF эсвэл текст оруулж, баримтын талаар асуулт асуухад систем холбогдох хэсэгт тулгуурлан хариулж, ашигласан эхийг харуулдаг. Өөрийн төслийг сонгосноор баримтжуулалтын төрлүүдийг бодит код, хэрэглэгчийн үйлдэлтэй холбон судалж, надад ойлгомжтой боловч шинэ уншигчид дутуу тайлбарлагдсан зүйлсийг илрүүлэх боломжтой.

# Гурван төслийн дөрвөн төрлийн матриц

Seminar 1-ийн Getting Started, Tutorial, Reference, API ангиллыг хэрэглэв. API нь Reference-тэй давхцаж болох тул энд ерөнхий лавлахыг Reference, тодорхой интерфейсийн гэрээг API гэж ялгав. Lecture-ийн User, Developer, Operations, Process нь уншигчаар ангилсан өөр хэмжээс юм.

Төслүүд: [fastapi/fastapi](https://github.com/fastapi/fastapi), [numpy/numpy](https://github.com/numpy/numpy), [encode/django-rest-framework](https://github.com/encode/django-rest-framework). Доорх мөр бүр хэрэглэгчийн асуулт ба documentation-ийн байрлалыг хоёр өгүүлбэрээр тайлбарлана; холбоосуудыг 2026-09-11-нд шалгав.

## FastAPI

| Төрөл | Асуулт ба байрлал |
|:---|:---|
| Getting Started | “Хамгийн жижиг API-г хэрхэн ажиллуулж, хариуг нь харах вэ?” гэсэн асуултад First Steps хариулна. Байрлал нь [/tutorial/first-steps/](https://fastapi.tiangolo.com/tutorial/first-steps/) бөгөөд анхны код, ажиллуулах алхам, шалгах үр дүнг нэгтгэсэн. |
| Tutorial | “JSON өгөгдөл хүлээн авах endpoint хэрхэн бүтээх вэ?” гэсэн суралцах зорилгыг Request Body гүйцэтгэнэ. Байрлал нь [/tutorial/body/](https://fastapi.tiangolo.com/tutorial/body/) бөгөөд өгөгдлийн загвараас хүсэлт боловсруулах хүртэл тайлбарлана. |
| Reference | “FastAPI-ийн аль хэсгийн дэлгэрэнгүй тайлбарыг хаанаас олох вэ?” гэсэн асуултад Reference индекс хариулна. Байрлал нь [/reference/](https://fastapi.tiangolo.com/reference/) бөгөөд class, parameter, response зэрэг сэдвийг лавлах байдлаар жагсаана. |
| API | “FastAPI class үүсгэхэд ямар параметр өгч болох вэ?” гэсэн интерфейсийн асуултад class-ийн лавлах хариулна. Байрлал нь [/reference/fastapi/](https://fastapi.tiangolo.com/reference/fastapi/) бөгөөд constructor-ийн параметр ба API гишүүдийг тодорхойлно. |

## NumPy

| Төрөл | Асуулт ба байрлал |
|:---|:---|
| Getting Started | “NumPy-г анх хэрэглэж, массив хэрхэн үүсгэх вэ?” гэсэн асуултад Absolute basics хариулна. Байрлал нь [/doc/stable/user/absolute_beginners.html](https://numpy.org/doc/stable/user/absolute_beginners.html) бөгөөд эхлэгчид зориулсан үндсэн ойлголт, жишээг агуулна. |
| Tutorial | “Массивын shape, axis болон үйлдлүүдийг хэрхэн ашиглаж сурах вэ?” гэсэн асуултад Quickstart-ийн дасгалчилсан жишээнүүд хариулна. Байрлал нь [/doc/stable/user/quickstart.html](https://numpy.org/doc/stable/user/quickstart.html) бөгөөд нэр нь quickstart ч Python мэддэг уншигчид зориулсан суралцах зорилготой тул Tutorial гэж ангилав. |
| Reference | “NumPy-ийн өгөгдлийн төрөл, массив, функцийн лавлах хаана байна вэ?” гэсэн асуултад Reference индекс хариулна. Байрлал нь [/doc/stable/reference/](https://numpy.org/doc/stable/reference/) бөгөөд сэдвээр ангилсан лавлахын орох цэг болно. |
| API | “numpy.array функцийн dtype, copy зэрэг аргумент юу хийдэг вэ?” гэсэн асуултад тухайн функцийн API хуудас хариулна. Байрлал нь [/doc/stable/reference/generated/numpy.array.html](https://numpy.org/doc/stable/reference/generated/numpy.array.html) бөгөөд signature, параметр, буцаах утга, жишээг өгнө. |

## Django REST framework

| Төрөл | Асуулт ба байрлал |
|:---|:---|
| Getting Started | “Анхны хэрэглэгч, бүлгийн API-г хэрхэн босгох вэ?” гэсэн асуултад Quickstart хариулна. Байрлал нь [/tutorial/quickstart/](https://www.django-rest-framework.org/tutorial/quickstart/) бөгөөд төслийн үүсгэлтээс API-г шалгах хүртэлх богино замыг өгнө. |
| Tutorial | “Өгөгдлийг serializer ашиглан хэрхэн хөрвүүлж сурах вэ?” гэсэн асуултад Serialization tutorial хариулна. Байрлал нь [/tutorial/1-serialization/](https://www.django-rest-framework.org/tutorial/1-serialization/) бөгөөд snippet кейсийг дагуулан хөгжүүлнэ. |
| Reference | “HTTP хариуны нэрлэсэн код, ангиллууд юу вэ?” гэсэн асуултад Status codes лавлах хариулна. Байрлал нь [/api-guide/status-codes/](https://www.django-rest-framework.org/api-guide/status-codes/) бөгөөд кодуудыг утгаар нь хайж ашиглахад зориулагдана. |
| API | “Request объектын data, query_params зэрэг гишүүн юу буцаадаг вэ?” гэсэн асуултад Requests хуудас хариулна. Байрлал нь [/api-guide/requests/](https://www.django-rest-framework.org/api-guide/requests/) бөгөөд хүсэлтийн объектын интерфейсийг тайлбарлана. |

# RAG chatbot-д хэрэглэх кейсүүд

**Getting Started:** Төслийг анх ажиллуулах хүнд орчноо бэлдэх, текст оруулах, эх сурвалжтай хариу авах дарааллыг тайлбарлана. Үүний тулд үндсэн README-ээс `docs/LOCAL_SETUP.md` руу холбоос өгөх хэрэгтэй.

**Tutorial:** “Номын сан 18:00 цагт хаана” гэсэн текст оруулаад “Хэдэн цагт хаах вэ?” гэж асууж, хариуг эх хэсэгтэй тулгах нэг бүрэн урсгал бичнэ.

**Reference:** Retrieval-ийн threshold, lambda, useMMR тохиргооны default утга 0.1, 0.5, true болохыг хүснэгтээр тайлбарлана. Эдгээр нь `chat.routes.ts`-ийн утга бөгөөд хариултын чанарын баталгаа биш.

**API:** `POST /chat`-ийн session, `documentIds`, `message`, буцаах `reply`, `sources`, алдааны нөхцөлийг одоо байгаа route-оос баримтжуулна.

**Бодит олдвор:** Root README байхгүй, web README нь Vite template. PROJECT_BRIEF нь Supabase гэж бичсэн ч LOCAL_SETUP, Compose тохиргоо local PostgreSQL ашигладаг. Энэ зөрүү нь документацийг кодтой хамт шинэчлэх шаардлагыг харуулна.

**Эх сурвалж:** Seminar 01, US-1.1; Chinchilla, бүлэг 2, х. 9–24; Lecture 01, слайд 4. Төслийн нотолгоо: `apps/api/src/modules/chat/chat.routes.ts`, `docs/LOCAL_SETUP.md`, `docker-compose.yml`.
