# Aeon API Client

API client được tạo tự động từ OpenAPI schema cho dự án Aeon.

## Cấu trúc

```
src/api/
├── types.ts          # TypeScript interfaces và types
├── client.ts         # API client chính
├── endpoints.ts      # Định nghĩa endpoints
├── config.ts         # Cấu hình và instance mặc định
├── hooks.ts          # React hooks
├── index.ts          # Export tất cả
└── schema.json       # OpenAPI schema gốc
```

## Cách sử dụng

### 1. Cấu hình môi trường

Thêm biến môi trường vào `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-base-url.com
```

### 2. Sử dụng API Client trực tiếp

```typescript
import { apiClient, setApiToken } from '@/api';

// Đặt token (sau khi đăng nhập)
setApiToken('your-access-token');

// Gọi API
const response = await apiClient.getAccounts({
  page: 1,
  size: 10
});

if (response.meta?.success) {
  console.log(response.data);
}
```

### 3. Sử dụng React Hooks

```typescript
import { useGetAccounts, useLogin } from '@/api';

function AccountsList() {
  const { data, loading, error, execute } = useGetAccounts();

  useEffect(() => {
    execute({ page: 1, size: 10 });
  }, [execute]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {data?.map(account => (
        <div key={account.id}>{account.name}</div>
      ))}
    </div>
  );
}

function LoginForm() {
  const { loading, error, execute } = useLogin();

  const handleLogin = async (username: string, password: string) => {
    try {
      const result = await execute({ username, password });
      if (result?.accessToken) {
        setApiToken(result.accessToken);
        // Redirect to dashboard
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      handleLogin(
        formData.get('username') as string,
        formData.get('password') as string
      );
    }}>
      <input name="username" type="text" placeholder="Username" />
      <input name="password" type="password" placeholder="Password" />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p>Error: {error}</p>}
    </form>
  );
}
```

## Các API có sẵn

### Admin Account APIs
- `createAccount(data)` - Tạo tài khoản mới
- `getAccounts(params?)` - Lấy danh sách tài khoản
- `getAccountDetail(id)` - Lấy chi tiết tài khoản
- `updateAccount(id, data)` - Cập nhật tài khoản
- `deleteAccount(id)` - Khóa tài khoản
- `restoreAccount(id)` - Mở khóa tài khoản

### Identity APIs
- `loginWithPassword(data)` - Đăng nhập bằng mật khẩu
- `refreshToken(data)` - Làm mới access token

### Admin Settings APIs
- `getSettings()` - Lấy danh sách thiết lập
- `updateSettings(data)` - Cập nhật thiết lập

## Types

Tất cả các types được định nghĩa trong `types.ts` dựa trên OpenAPI schema:

- `ApiResponse<T>` - Response wrapper chung
- `CreateAccountRequest` - Payload tạo tài khoản
- `LoginRequest` - Payload đăng nhập
- `AuthResponse` - Response chứa tokens
- Và nhiều types khác...

## Error Handling

```typescript
import { ApiError } from '@/api';

try {
  const response = await apiClient.getAccounts();
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API Error:', error.message, 'Status:', error.status);
  } else {
    console.error('Unknown error:', error);
  }
}
```

## Custom Base URL

```typescript
import { createApiClient } from '@/api';

const customClient = createApiClient('https://custom-api-url.com');
```