# Universe Zenith Stats - API Contract

Bu doküman frontend ve backend tarafının aynı veri formatı üzerinden çalışması için hazırlanmıştır.

Backend tarafı API response yapısını değiştirmeden geliştirme yapmalıdır. Frontend tarafı ise bu dokümandaki request ve response formatına göre ekranları tasarlamalıdır.

---

## 1. Endpoint

```http
POST /api/lol/analyze
```

Bu endpoint, League of Legends oyuncu analiz verisini döndürür.

Şu an `RIOT_API_KEY` yoksa mock data döndürmektedir. İleride Riot API bağlantısı aktif olduğunda response formatı aynı kalacaktır.

---

## 2. Request Body

```json
{
  "gameName": "Tunahan",
  "tagLine": "TR1",
  "region": "tr1"
}
```

### Alanlar

| Alan     | Tip    | Zorunlu | Açıklama              |
| -------- | ------ | ------: | --------------------- |
| gameName | string |    Evet | Riot ID kullanıcı adı |
| tagLine  | string |    Evet | Riot ID tag değeri    |
| region   | string |    Evet | Sunucu bölgesi        |

### Desteklenen region değerleri

```ts
"tr1" | "euw1" | "eun1" | "na1" | "kr"
```

---

## 3. Başarılı Response

```json
{
  "player": {
    "gameName": "Tunahan",
    "tagLine": "TR1",
    "region": "tr1",
    "puuid": "mock-puuid-demo-player"
  },
  "summary": {
    "matchCount": 10,
    "winRate": 60,
    "averageKda": 2.85,
    "averageCsPerMinute": 6.7,
    "averageVisionScore": 22,
    "averageDamageDealt": 24150,
    "averageGoldEarned": 11800
  },
  "matches": [
    {
      "matchId": "TR1_100000001",
      "championName": "Ahri",
      "role": "MID",
      "win": true,
      "kills": 8,
      "deaths": 3,
      "assists": 11,
      "kda": 6.33,
      "totalCs": 214,
      "csPerMinute": 7.1,
      "visionScore": 19,
      "damageDealt": 26400,
      "goldEarned": 12600,
      "gameDurationSeconds": 1800,
      "queueId": 420
    }
  ],
  "recommendations": [
    {
      "type": "success",
      "title": "Takım savaşlarına katkın iyi",
      "description": "Son maçlarda kill participation ve asist katkın güçlü görünüyor."
    }
  ]
}
```

---

## 4. Error Response

Hata durumunda backend şu formatta response döner:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Gönderilen oyuncu bilgileri geçersiz."
  }
}
```

### Error Code Listesi

| Code             | Açıklama                       |
| ---------------- | ------------------------------ |
| VALIDATION_ERROR | Request body hatalı            |
| PLAYER_NOT_FOUND | Oyuncu bulunamadı              |
| RIOT_API_ERROR   | Riot API tarafında hata oluştu |
| RATE_LIMITED     | API rate limit sınırı aşıldı   |
| INTERNAL_ERROR   | Beklenmeyen sunucu hatası      |

---

## 5. Frontend Kullanım Notları

Frontend tarafı şu durumları ayrı ayrı göstermelidir:

1. İlk boş durum
2. Loading durumu
3. Başarılı analiz sonucu
4. Validation error
5. Oyuncu bulunamadı hatası
6. Genel sunucu hatası

---

## 6. Örnek Fetch Kullanımı

```ts
const response = await fetch("/api/lol/analyze", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    gameName: "Tunahan",
    tagLine: "TR1",
    region: "tr1",
  }),
});

const data = await response.json();
```

---

## 7. Ortak TypeScript Dosyası

Ortak type dosyası:

```text
types/lol-analysis.ts
```

Frontend tarafı mümkünse bu dosyadaki type yapısına göre ilerlemelidir.

---

## 8. Kritik Kural

Backend response alan isimleri değiştirilmemelidir.

Örnek doğru kullanım:

```ts
averageKda
```

Şu şekilde değiştirilmemelidir:

```ts
averageKDA
avgKda
kdaAverage
```

Alan ismi değişirse frontend tarafında kırılma yaşanır.

---

## 9. Commit

```powershell
npm run lint
git add .
git commit -m "Add API contract documentation"
git push
```
