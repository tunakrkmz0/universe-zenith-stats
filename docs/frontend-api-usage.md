# Frontend API Kullanım Notları

Bu doküman Kadir’in frontend tarafında `/api/lol/analyze` endpoint’ini doğru kullanması için hazırlanmıştır.

---

## 1. Endpoint

```http
POST /api/lol/analyze
```

---

## 2. Request

```ts
const requestBody = {
  gameName: "Tunahan",
  tagLine: "TR1",
  region: "tr1",
};
```

---

## 3. Fetch Kullanımı

```ts
const response = await fetch("/api/lol/analyze", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    gameName,
    tagLine,
    region,
  }),
});

const data = await response.json();
```

---

## 4. Önerilen Frontend State Yapısı

```ts
type AnalysisState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: LolAnalysisResponse }
  | { status: "error"; message: string };
```

---

## 5. Örnek Kullanım

```ts
import type {
  LolAnalysisErrorResponse,
  LolAnalysisResponse,
  LolRegion,
} from "@/types/lol-analysis";

type AnalysisState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: LolAnalysisResponse }
  | { status: "error"; message: string };

async function analyzePlayer(params: {
  gameName: string;
  tagLine: string;
  region: LolRegion;
}): Promise<LolAnalysisResponse> {
  const response = await fetch("/api/lol/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  const data = (await response.json()) as
    | LolAnalysisResponse
    | LolAnalysisErrorResponse;

  if (!response.ok) {
    if ("error" in data) {
      throw new Error(data.error.message);
    }

    throw new Error("Bilinmeyen bir hata oluştu.");
  }

  return data as LolAnalysisResponse;
}
```

---

## 6. Gösterilmesi Gereken UI Durumları

Frontend tarafında şu durumlar ayrı ayrı ele alınmalıdır:

1. İlk boş durum
2. Loading durumu
3. Başarılı analiz sonucu
4. Oyuncu bulunamadı hatası
5. Validation hatası
6. Genel sunucu hatası

---

## 7. Önemli Not

Backend tarafı `RIOT_API_KEY` yoksa mock response döndürür.

Bu yüzden frontend geliştirme sürecinde gerçek Riot API beklenmez.

Frontend sadece şu endpoint’i kullanmalıdır:

```http
POST /api/lol/analyze
```

Mock veya live mod ayrımını frontend yapmayacaktır.

---

## 8. Commit

```powershell
npm run lint
git add .
git commit -m "Add frontend API usage guide"
git push
```
