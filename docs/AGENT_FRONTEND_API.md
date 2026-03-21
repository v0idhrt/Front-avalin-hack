# Инструкция для агента фронтенда: бэкенд через Swagger, Axios, TanStack Query

Цель: единообразно подключать UI к REST API, описанному в **OpenAPI/Swagger**, без смешивания сетевой логики с компонентами. Вся работа с сервером — через **Axios** (общий клиент) и **TanStack Query**; бизнес-обёртки — в **хуках** и **API-слое**.

---

## 1. Роли слоёв (строго соблюдать)

| Слой | Ответственность | Где живёт |
|------|-----------------|-----------|
| **Типы и контракт** | DTO запросов/ответов, пути, query-параметры — по Swagger | `src/app/api/types/` или рядом с доменом |
| **Чистые API-функции** | Один вызов `http` на эндпоинт, без React | `src/app/api/<domain>Api.ts` |
| **Query / Mutation factories** | `queryKey`, `queryFn`, `mutationFn` — только вызовы API-функций | `src/app/api/queries/<domain>Queries.ts` |
| **Хуки** | `useQuery` / `useMutation`, маппинг в UI (enabled, select, onSuccess), **не** сырой axios в JSX | `src/app/hooks/use<Domain>.ts` |
| **Компоненты** | Только данные из хуков: `data`, `isLoading`, `error`, `mutate` | `src/app/components/...` |

**Запрещено:** вызывать `http` или `api` напрямую из компонентов (кроме редких исключений по согласованию). **Запрещено:** дублировать строки URL в десятке мест — централизовать пути.

---

## 2. Swagger / OpenAPI как источник правды

1. Открыть спецификацию (Swagger UI или `openapi.json` / `swagger.yaml`).
2. Для каждого эндпоинта зафиксировать:
   - метод и **path** (включая `{id}`);
   - **query** / **header** / **body** схемы;
   - коды ответов и тело **200** (и при необходимости ошибок).
3. Перенести это в **TypeScript-типы** (ручной ввод или генерация — см. ниже).

### Генерация типов (по желанию команды)

- Инструменты вроде `openapi-typescript` могут сгенерировать типы из `openapi.json`.
- Если генерации нет — типы пишутся вручную **один раз** и переиспользуются в API-функциях и хуках.

Имена типов: `UserDto`, `CreateBookingBody`, `PaginatedResponse<T>` — как в контракте или близко к нему.

---

## 3. Axios: только общий клиент

В проекте уже настроено:

- `API_BASE_URL` из `VITE_API_URL` или префикс `/api` (удобно под proxy в Vite).
- Экспорт `http`, `api`, `setApiAuthToken`, `getApiErrorMessage`, `isHttpClientError`.

**Правила:**

- Все запросы идут через **`http`** из `@/app/api` (или `src/app/api`), а не через «голый» `axios` с новым `baseURL`.
- Токен: после логина вызывать `setApiAuthToken(token)`, после выхода — `setApiAuthToken(null)`.
- Типизировать ответ: `http.get<UserDto>('/users/me')`, затем брать `data` из ответа в API-функции.

Пример **чистой API-функции** (без React):

```ts
// src/app/api/usersApi.ts
import { http } from "@/app/api";
import type { UserDto } from "./types/user";

export async function fetchCurrentUser() {
  const { data } = await http.get<UserDto>("/users/me");
  return data;
}

export async function updateProfile(body: Partial<UserDto>) {
  const { data } = await http.patch<UserDto>("/users/me", body);
  return data;
}
```

Пути сверять со Swagger; при смене версии API — править **здесь**, а не в хуках.

---

## 4. TanStack Query: ключи, queries, mutations

### 4.1 Фабрика ключей (обязательно)

Один домен — один объект с ключами, чтобы инвалидировать кэш предсказуемо:

```ts
// src/app/api/queryKeys.ts (или рядом с доменом)
export const userKeys = {
  all: ["users"] as const,
  me: () => [...userKeys.all, "me"] as const,
  detail: (id: string) => [...userKeys.all, "detail", id] as const,
};
```

### 4.2 Query / mutation — тонкая обёртка над API

```ts
// src/app/api/queries/userQueries.ts
import { queryOptions } from "@tanstack/react-query";
import { fetchCurrentUser } from "../usersApi";
import { userKeys } from "../queryKeys";

export const currentUserQueryOptions = () =>
  queryOptions({
    queryKey: userKeys.me(),
    queryFn: fetchCurrentUser,
  });
```

Для мутаций — функции, возвращающие настройки `useMutation`, или отдельные `mutationFn` + ключи для `invalidateQueries`.

После успешной мутации, меняющей список/сущность:

```ts
queryClient.invalidateQueries({ queryKey: userKeys.all });
```

---

## 5. Хуки: вся «прод»-логика для UI

**Именование:** `useCurrentUser`, `useUpdateProfile`, `useExcursionsList` — глагол/сущность + контекст.

**Внутри хука:**

- `useQuery` / `useMutation` из `@tanstack/react-query`.
- Опции: `enabled` (например, только если есть `id`), `staleTime` при необходимости, `select` для лёгкого маппинга.
- Экспорт только того, что нужно экрану: данные, флаги загрузки, ошибка, функции вызова мутации.

Пример:

```ts
// src/app/hooks/useCurrentUser.ts
import { useQuery } from "@tanstack/react-query";
import { currentUserQueryOptions } from "@/app/api/queries/userQueries";

export function useCurrentUser() {
  return useQuery(currentUserQueryOptions());
}
```

Компонент:

```tsx
const { data: user, isPending, error } = useCurrentUser();
```

**Не класть в хук:** разметку JSX, огромные сайд-эффекты не про данные; навигацию — по необходимости через колбэки из компонента или отдельный хук.

---

## 6. Ошибки и UX

- Для сообщения пользователю использовать **`getApiErrorMessage(error)`** из `@/app/api`.
- Проверка axios-ошибки: **`isHttpClientError(error)`** или `AxiosError.isAxiosError`.
- Глобальные 401/403 при необходимости — в **response interceptor** в `client.ts` (осторожно: не создавать циклов с редиректом).

---

## 7. Окружение и прокси (dev)

- Прод/стейдж: в `.env` задать `VITE_API_URL=https://api.example.com`.
- Локально с Vite proxy: в `vite.config.ts` проксировать `/api` на бэкенд, `VITE_API_URL` можно не задавать (будет `/api`).

Агент не коммитит секреты; `.env` в `.gitignore`.

---

## 8. Провайдер QueryClient

Приложение должно быть обёрнуто в `QueryClientProvider` с клиентом из `@/app/api` (`queryClient` или `createAppQueryClient()`), обычно в `main.tsx` или корневом layout.

---

## 9. Чеклист перед мержем (агент)

- [ ] Эндпоинты и типы совпадают со **Swagger**.
- [ ] Нет прямых вызовов `http` из компонентов — только через хуки/API-слой.
- [ ] Есть **queryKey** для всех `useQuery`; мутации инвалидируют нужные ключи.
- [ ] Ошибки обрабатываются через **`getApiErrorMessage`** где показывается текст пользователю.
- [ ] Нет захардкоженного базового URL кроме `VITE_API_URL` / дефолта в клиенте.

---

## 10. Структура папок (рекомендуемая)

```
src/app/
  api/
    client.ts          # уже есть
    queryClient.ts     # уже есть
    index.ts
    types/             # DTO из OpenAPI
    usersApi.ts        # чистые функции
    queryKeys.ts
    queries/
      userQueries.ts
  hooks/
    useCurrentUser.ts
    useUpdateProfile.ts
  components/
    ...
```

Так агент всегда знает: **Swagger → типы → *Api.ts → queries → hooks → UI**.
