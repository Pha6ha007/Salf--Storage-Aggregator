# План безопасности и соответствия требованиям - MVP v1
# Self-Storage Aggregator

**Версия документа:** 1.0  
**Дата:** 09 декабря 2025 г.  
**Статус:** Утверждено для реализации MVP

---

## Оглавление

1. [Обзор безопасности](#1-обзор-безопасности)
2. [Контроль доступа и RBAC](#2-контроль-доступа-и-rbac)
3. [Безопасность API](#3-безопасность-api)
4. [Защита данных и PII](#4-защита-данных-и-pii)
5. [Стандарты шифрования](#5-стандарты-шифрования)
6. [Управление секретами](#6-управление-секретами)
7. [Безопасная разработка и SDLC](#7-безопасная-разработка-и-sdlc)
8. [Требования соответствия](#8-требования-соответствия)
9. [Мониторинг безопасности](#9-мониторинг-безопасности)
10. [План реагирования на инциденты](#10-план-реагирования-на-инциденты)

---

# 1. Обзор безопасности

## 1.1. Цели безопасности MVP

### Основные цели

| Цель | Описание | Критерии успеха |
|------|----------|-----------------|
| **Конфиденциальность** | Защита персональных данных пользователей и операторов | Нулевые утечки PII, шифрование критичных данных |
| **Целостность** | Предотвращение несанкционированного изменения данных | Аудит всех изменений, защита от SQL-инъекций |
| **Доступность** | Обеспечение непрерывности работы платформы | Uptime 99%, защита от DDoS |
| **Аутентификация** | Надежная идентификация пользователей | JWT-токены, хеширование паролей (bcrypt) |
| **Авторизация** | Контроль доступа к ресурсам на основе ролей | RBAC, изоляция данных операторов |
| **Аудит** | Отслеживание действий для соответствия требованиям | Логи всех критичных операций, 1 год хранения |

### Критерии успеха

- ✅ Нулевое количество критичных уязвимостей в production
- ✅ 100% API-эндпоинтов защищены аутентификацией
- ✅ 100% PII зашифровано (пароли, токены)
- ✅ Автоматическое сканирование зависимостей в CI/CD
- ✅ План реагирования на инциденты готов до запуска

## 1.2. Область применения

### Покрываемые компоненты

| Компонент | Технология | Уровень безопасности |
|-----------|-----------|---------------------|
| **Frontend** | Next.js 14, React 18 | HTTPS, CSP, XSS-защита |
| **Backend API** | NestJS 10, Node.js 20 | JWT, валидация входных данных, rate limiting |
| **База данных** | PostgreSQL 15 + PostGIS | Шифрование at-rest, RLS-политики |
| **AI Service** | FastAPI, Claude API | Ограничение запросов, изоляция API-ключей |
| **Инфраструктура** | Docker, nginx, Cloudflare CDN | TLS 1.2+, SSL-сертификаты, firewall |
| **CI/CD** | GitHub Actions | Secret scanning, SAST, dependency check |

### Не входит в область MVP

- WAF (Web Application Firewall) - планируется в v2
- IDS/IPS (Intrusion Detection/Prevention) - планируется в v2
- Bug Bounty программа - после запуска
- Penetration testing - перед production
- SOC 2 / ISO 27001 сертификация - долгосрочная цель

## 1.3. Минимальные требования безопасности

### Аутентификация и авторизация

```typescript
const SECURITY_REQUIREMENTS = {
  authentication: {
    method: 'JWT (JSON Web Tokens)',
    access_token_ttl: '15 minutes',
    refresh_token_ttl: '7 days',
    token_blacklisting: true,
  },
  
  password_policy: {
    hashing_algorithm: 'bcrypt',
    salt_rounds: 12,
    min_length: 8,
    requires_uppercase: true,
    requires_lowercase: true,
    requires_digit: true,
    requires_special_char: true,
  },
  
  rbac: {
    roles: ['guest', 'user', 'operator', 'admin'],
    operator_data_scoping: true,
    least_privilege: true,
  },
};
```

### Защита API

```typescript
const API_SECURITY_REQUIREMENTS = {
  input_validation: {
    library: 'class-validator',
    whitelist: true,
    forbid_non_whitelisted: true,
    transform: true,
  },
  
  sql_injection_prevention: {
    orm: 'TypeORM with parameterized queries',
    raw_queries: 'Forbidden',
  },
  
  rate_limiting: {
    anonymous: '100 req/min',
    authenticated: '300 req/min',
    login_attempts: '5 per 15 min',
    ai_requests: { anonymous: '5/hour', authenticated: '20/hour' },
  },
  
  cors: {
    origin_whitelist: ['https://selfstorage.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
};
```

## 1.4. Ответственность заинтересованных сторон

### Матрица ответственности

| Роль | Ответственность |
|------|----------------|
| **Product Owner** | Утверждение требований безопасности, приоритизация |
| **Backend Developer** | Реализация аутентификации, авторизации, защиты API |
| **Frontend Developer** | Защита от XSS, CSRF, безопасная работа с формами |
| **DevOps Engineer** | Инфраструктурная безопасность, secrets, CI/CD |
| **QA Engineer** | Тестирование security controls |

### Процесс эскалации

```
CRITICAL → Немедленно: CTO + DevOps (< 15 мин)
HIGH     → DevOps в течение 1 часа
MEDIUM   → Создать тикет в течение 4 часов
LOW      → Добавить в backlog
```

---

# 2. Контроль доступа и RBAC

## 2.1. Система ролей

### Четырехуровневая иерархия ролей

| Роль | Описание | Требования | Возможности |
|------|----------|------------|-------------|
| **Guest** | Неаутентифицированный пользователь | Без регистрации | Просмотр складов, поиск, фильтрация |
| **User** | Зарегистрированный клиент | Email + пароль | Бронирование, отзывы, избранное |
| **Operator** | Менеджер склада | Регистрация + одобрение админом | Управление своими складами и бронированиями |
| **Admin** | Администратор платформы | Создание вручную | Полный доступ, модерация |

## 2.2. Матрица прав доступа

| Ресурс | Действие | Guest | User | Operator | Admin |
|--------|----------|-------|------|----------|-------|
| **Склады** | Просмотр | ✅ | ✅ | ✅ | ✅ |
| | Создание | ❌ | ❌ | ✅ (свои) | ✅ |
| | Редактирование | ❌ | ❌ | ✅ (только свои) | ✅ (все) |
| | Удаление | ❌ | ❌ | ✅ (только свои) | ✅ (все) |
| **Боксы** | Просмотр | ✅ | ✅ | ✅ | ✅ |
| | Создание | ❌ | ❌ | ✅ (для своих складов) | ✅ |
| | Редактирование | ❌ | ❌ | ✅ (только свои) | ✅ (все) |
| **Бронирования** | Создание | ❌ | ✅ | ✅ | ✅ |
| | Просмотр своих | ❌ | ✅ | ✅ | ✅ |
| | Одобрение | ❌ | ❌ | ✅ (только свои склады) | ✅ (все) |
| **Отзывы** | Просмотр | ✅ | ✅ | ✅ | ✅ |
| | Создание | ❌ | ✅ | ✅ | ✅ |
| | Удаление | ❌ | ❌ | ❌ | ✅ |
| **AI функции** | Box Finder | 5/час | 20/час | 50/час | Без лимита |

## 2.3. Изоляция данных операторов (Operator Scoping)

### КРИТИЧЕСКИЙ контроль безопасности

**Принцип:** Операторы имеют доступ ТОЛЬКО к своим данным.

### Уровень 1: База данных (Row-Level Security)

```sql
-- Политика RLS для таблицы warehouses
CREATE POLICY operator_isolation_policy ON warehouses
    FOR ALL
    TO selfstorage_api
    USING (
        operator_id = current_setting('app.current_operator_id')::INTEGER
        OR current_setting('app.user_role') = 'admin'
    );

-- Активация RLS
ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE boxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
```

### Уровень 2: Backend Guard

```typescript
// src/operator/guards/operator-scoping.guard.ts
@Injectable()
export class OperatorScopingGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    // Админы обходят проверку
    if (user.role === 'admin') {
      return true;
    }
    
    // Проверка роли оператора
    if (user.role !== 'operator') {
      throw new ForbiddenException('Operator role required');
    }
    
    // Получение operator_id
    const operator = await this.operatorsService.findByUserId(user.id);
    if (!operator || operator.status !== 'approved') {
      throw new ForbiddenException('Operator account not approved');
    }
    
    // Прикрепление operator_id к запросу
    request.operatorId = operator.id;
    
    // Проверка владения ресурсом
    const resourceId = request.params.id;
    if (resourceId) {
      const hasAccess = await this.verifyResourceAccess(resourceId, operator.id);
      if (!hasAccess) {
        throw new ForbiddenException('You do not own this resource');
      }
    }
    
    return true;
  }
}
```

### Уровень 3: Service Layer

```typescript
// src/warehouses/warehouses.service.ts
@Injectable()
export class WarehousesService {
  
  async findByOperator(operatorId: number): Promise<Warehouse[]> {
    return this.warehousesRepository.find({
      where: { operator_id: operatorId },
    });
  }

  async create(dto: CreateWarehouseDto, operatorId: number): Promise<Warehouse> {
    const warehouse = this.warehousesRepository.create({
      ...dto,
      operator_id: operatorId, // КРИТИЧНО: явное присвоение
      status: 'draft',
    });
    return this.warehousesRepository.save(warehouse);
  }

  async update(id: string, dto: UpdateWarehouseDto, operatorId: number): Promise<Warehouse> {
    const warehouse = await this.warehousesRepository.findOne({ where: { id } });
    
    // КРИТИЧНАЯ проверка
    if (warehouse.operator_id !== operatorId) {
      throw new ForbiddenException('You do not own this warehouse');
    }
    
    await this.warehousesRepository.update(id, dto);
    return this.warehousesRepository.findOne({ where: { id } });
  }
}
```

## 2.4. Управление сессиями и токенами

### Политика времени жизни токенов

| Токен | TTL | Где хранится | Действие при logout |
|-------|-----|--------------|---------------------|
| **Access Token (JWT)** | 15 минут | Память клиента | Добавляется в blacklist |
| **Refresh Token** | 7 дней | БД (хеш) | Отзывается |
| **Email Verification** | 24 часа | БД | Удаляется |
| **Password Reset** | 1 час | БД | Удаляется |

### Генерация и хранение токенов

```typescript
// src/auth/auth.service.ts
@Injectable()
export class AuthService {
  
  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    // Access token (JWT)
    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    }, { secret: process.env.JWT_SECRET, expiresIn: '15m' });
    
    // Refresh token
    const refreshToken = this.jwtService.sign({
      sub: user.id,
      token_id: uuidv4(),
    }, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' });
    
    // Хеширование refresh token перед сохранением
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    
    await this.refreshTokensRepository.save({
      user_id: user.id,
      token_hash: refreshTokenHash,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    
    return { access_token: accessToken, refresh_token: refreshToken, expires_in: 900 };
  }
  
  async logout(userId: number, accessToken: string): Promise<void> {
    // Отзыв всех refresh tokens
    await this.refreshTokensRepository.update(
      { user_id: userId, revoked_at: IsNull() },
      { revoked_at: new Date() }
    );
    
    // Добавление access token в blacklist
    const decoded = this.jwtService.decode(accessToken) as any;
    const ttl = decoded.exp - Math.floor(Date.now() / 1000);
    if (ttl > 0) {
      await this.redis.setex(`blacklist:${accessToken}`, ttl, '1');
    }
  }
}
```

### Максимальное количество одновременных сессий

```typescript
private readonly MAX_CONCURRENT_SESSIONS = 5;

async login(email: string, password: string): Promise<AuthResponse> {
  // ... проверка учетных данных ...
  
  const activeSessions = await this.refreshTokensRepository.count({
    where: {
      user_id: user.id,
      revoked_at: IsNull(),
      expires_at: MoreThan(new Date()),
    },
  });
  
  if (activeSessions >= this.MAX_CONCURRENT_SESSIONS) {
    // Отозвать самую старую сессию
    const oldestSession = await this.refreshTokensRepository.findOne({
      where: { user_id: user.id, revoked_at: IsNull() },
      order: { created_at: 'ASC' },
    });
    
    if (oldestSession) {
      await this.refreshTokensRepository.update(oldestSession.id, {
        revoked_at: new Date(),
      });
    }
  }
  
  // ... создание новой сессии ...
}
```

---

# 3. Безопасность API

## 3.1. JWT-аутентификация

### Архитектура двойных токенов

**Access Token (15 минут):**
- Хранится в памяти клиента (не в localStorage/cookies)
- Содержит claims: user_id, email, role
- Используется для всех API-запросов

**Refresh Token (7 дней):**
- Хранится в БД в виде хеша (bcrypt)
- Используется только для получения новой пары токенов
- Отзывается при logout/смене пароля

### JWT Strategy Implementation

```typescript
// src/auth/strategies/jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private readonly redis: Redis
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true
    });
  }

  async validate(req: Request, payload: any) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    
    // Проверка blacklist
    const isBlacklisted = await this.redis.get(`blacklist:${token}`);
    if (isBlacklisted) {
      throw new UnauthorizedException('Token has been revoked');
    }
    
    // Проверка пользователя
    const user = await this.usersService.findById(payload.sub);
    if (!user || !user.is_active) {
      throw new UnauthorizedException('User not found or inactive');
    }
    
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
```

### Хеширование паролей

```typescript
// src/auth/password.service.ts
@Injectable()
export class PasswordService {
  private readonly SALT_ROUNDS = 12;

  async hashPassword(password: string): Promise<string> {
    this.validatePasswordStrength(password);
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  validatePasswordStrength(password: string): void {
    const errors: string[] = [];
    if (password.length < 8) errors.push('Минимум 8 символов');
    if (!/[A-Z]/.test(password)) errors.push('Минимум одна заглавная буква');
    if (!/[a-z]/.test(password)) errors.push('Минимум одна строчная буква');
    if (!/\d/.test(password)) errors.push('Минимум одна цифра');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('Минимум один спецсимвол');

    if (errors.length > 0) {
      throw new BadRequestException({ message: 'Пароль не соответствует требованиям', errors });
    }
  }
}
```

### Генерация секретов

```bash
# Генерация сильных секретов (минимум 32 символа)
JWT_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)
```

## 3.2. Авторизация на уровне API Gateway

### Глобальная защита эндпоинтов

```typescript
// src/main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Применение JwtAuthGuard глобально
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  
  await app.listen(4000);
}

// Public Decorator для обхода аутентификации
export const Public = () => SetMetadata('isPublic', true);

// Использование:
@Get()
@Public() // Этот эндпоинт доступен без аутентификации
async search(@Query() query: SearchWarehousesDto) {
  return this.warehousesService.search(query);
}
```

### Role-Based Guards

```typescript
// src/auth/guards/roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) throw new ForbiddenException('User not authenticated');

    const hasRole = requiredRoles.some(role => user.role === role);
    if (!hasRole) {
      throw new ForbiddenException(`Требуемые роли: ${requiredRoles.join(', ')}`);
    }

    return true;
  }
}

// Использование:
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  @Get('users')
  async getAllUsers() {
    return this.usersService.findAll();
  }
}
```

## 3.3. Валидация входных данных

### DTO с class-validator

```typescript
// src/warehouses/dto/create-warehouse.dto.ts
export class CreateWarehouseDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(2000)
  description: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  full_address: string;

  @IsNumber()
  @Type(() => Number)
  latitude: number;

  @IsNumber()
  @Type(() => Number)
  longitude: number;

  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/) // E.164 формат
  contact_phone: string;
}
```

### Global Validation Pipe

```typescript
// src/main.ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,           // Удалить неизвестные свойства
    forbidNonWhitelisted: true, // Отклонить если есть неизвестные свойства
    transform: true,            // Автопреобразование типов
  }),
);
```

### Защита от SQL-инъекций

```typescript
// ✅ БЕЗОПАСНО: Параметризованный запрос (TypeORM)
async findWarehousesByCity(city: string): Promise<Warehouse[]> {
  return this.warehousesRepository.find({
    where: { city } // Автоматически параметризовано
  });
}

// ✅ БЕЗОПАСНО: Query builder с параметрами
async searchWarehouses(searchTerm: string): Promise<Warehouse[]> {
  return this.warehousesRepository
    .createQueryBuilder('warehouse')
    .where('warehouse.name ILIKE :search', { search: `%${searchTerm}%` })
    .getMany();
}

// ❌ НЕБЕЗОПАСНО: Конкатенация строк (НИКОГДА НЕ ДЕЛАЙТЕ ТАК)
async unsafeSearch(searchTerm: string): Promise<Warehouse[]> {
  return this.warehousesRepository.query(
    `SELECT * FROM warehouses WHERE name LIKE '%${searchTerm}%'`
  );
}
```

## 3.4. Защита от OWASP API Top-10

| # | Уязвимость | Защита | Статус |
|---|-----------|--------|--------|
| **API1** | Broken Object Level Authorization | Operator scoping guards, RLS | ✅ |
| **API2** | Broken Authentication | JWT короткий TTL, bcrypt, blacklist | ✅ |
| **API3** | Broken Object Property Level Authorization | DTO whitelist, forbidNonWhitelisted | ✅ |
| **API4** | Unrestricted Resource Consumption | Rate limiting 100-1000 req/min | ✅ |
| **API5** | Broken Function Level Authorization | RBAC guards на всех эндпоинтах | ✅ |
| **API6** | Unrestricted Access to Sensitive Business Flows | AI rate limits, booking limits | ✅ |
| **API7** | Server Side Request Forgery | Нет URL от пользователей, whitelist | ✅ |
| **API8** | Security Misconfiguration | Helmet.js, CORS whitelist | ✅ |
| **API9** | Improper Inventory Management | Swagger docs, версионирование | ✅ |
| **API10** | Unsafe Consumption of APIs | HTTPS для внешних API | ✅ |

## 3.5. Настройка CORS

```typescript
// src/main.ts
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'https://selfstorage.com',
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
};

app.enableCors(corsOptions);
```

---

# 4. Защита данных и PII

## 4.1. Классификация PII

| Категория данных | Уровень PII | Примеры | Шифрование |
|-----------------|------------|---------|------------|
| **Данные аутентификации** | Высокий | Хеш пароля, токены | ✅ At rest |
| **Контактная информация** | Средний | Email, телефон | ✅ At rest |
| **Персональная идентификация** | Средний | Имя, фамилия | ❌ |
| **Детали бронирования** | Средний | Контакт в бронировании | ✅ At rest |
| **Данные отзывов** | Низкий | Имя + первая буква фамилии | ❌ (анонимизировано) |
| **Логи аудита** | Низкий | User ID (без PII) | ❌ |

## 4.2. Политика хранения данных

| Тип данных | Срок хранения | Действие после |
|-----------|--------------|----------------|
| **Активные пользователи** | Бессрочно | - |
| **Удаленные пользователи** | 30 дней | Hard delete |
| **Завершенные бронирования** | 3 года | Анонимизация PII |
| **Отмененные бронирования** | 1 год | Анонимизация |
| **Отзывы** | Бессрочно | - (уже анонимизированы) |
| **Логи безопасности** | 1 год | Удаление |
| **Логи аудита** | 1 год | Удаление |
| **Логи приложения** | 90 дней | Удаление |
| **Access tokens** | 15 минут | Auto-expire |
| **Refresh tokens** | 7 дней | Auto-expire |
| **Email verification** | 24 часа | Удаление |
| **Password reset** | 1 час | Удаление |

### Автоматизация retention

```typescript
// src/tasks/data-retention.service.ts
@Injectable()
export class DataRetentionService {
  
  @Cron('0 3 * * *') // Ежедневно в 3:00
  async executeRetentionPolicies() {
    await this.deleteExpiredRefreshTokens();
    await this.hardDeleteMarkedUsers();
    await this.anonymizeOldBookings();
    await this.purgeOldAuditLogs();
  }

  private async deleteExpiredRefreshTokens() {
    const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    await this.refreshTokensRepository.delete({ expires_at: LessThan(cutoff) });
  }

  private async hardDeleteMarkedUsers() {
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const users = await this.usersRepository.find({
      where: { deleted_at: LessThan(cutoff) }
    });
    
    for (const user of users) {
      const activeBookings = await this.bookingsRepository.count({
        where: { user_id: user.id, status: In(['pending', 'confirmed', 'active']) }
      });
      if (activeBookings === 0) {
        await this.usersRepository.delete(user.id);
      }
    }
  }

  private async anonymizeOldBookings() {
    const cutoff = new Date();
    cutoff.setFullYear(cutoff.getFullYear() - 3);
    
    await this.bookingsRepository.update(
      { status: In(['completed', 'cancelled']), completed_at: LessThan(cutoff) },
      {
        contact_name: 'ANONYMIZED',
        contact_email: 'anonymized@system.local',
        contact_phone: '+00000000000',
        notes: null
      }
    );
  }

  private async purgeOldAuditLogs() {
    const cutoff = new Date();
    cutoff.setFullYear(cutoff.getFullYear() - 1);
    await this.auditLogsRepository.delete({ created_at: LessThan(cutoff) });
  }
}
```

## 4.3. Маскирование данных

```typescript
// src/common/utils/masking.utils.ts
export class MaskingUtils {
  
  /**
   * Маскировка email: john.doe@example.com -> j***e@e*****e.com
   */
  static maskEmail(email: string): string {
    const [local, domain] = email.split('@');
    const maskedLocal = local.length <= 2 
      ? `${local[0]}***` 
      : `${local[0]}${'*'.repeat(local.length - 2)}${local[local.length - 1]}`;
    const [name, tld] = domain.split('.');
    const maskedDomain = `${name[0]}${'*'.repeat(name.length - 2)}${name[name.length - 1]}.${tld}`;
    return `${maskedLocal}@${maskedDomain}`;
  }

  /**
   * Маскировка телефона: +79991234567 -> +7999***4567
   */
  static maskPhone(phone: string): string {
    const prefix = phone.slice(0, phone.startsWith('+') ? 5 : 4);
    const suffix = phone.slice(-4);
    return `${prefix}***${suffix}`;
  }

  /**
   * Для отзывов: Иван Петров -> Иван П.
   */
  static maskNameForReview(firstName: string, lastName: string): string {
    return `${firstName} ${lastName.charAt(0).toUpperCase()}.`;
  }
}
```

## 4.4. Исключение PII из логов

```typescript
// src/common/logger/winston.config.ts
const PII_PATTERNS = [
  /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi, // Email
  /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, // Телефон
  /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, // Карты
  /"password"\s*:\s*"[^"]+"/gi,
  /"token"\s*:\s*"[^"]+"/gi,
];

const sanitizeFormat = winston.format((info) => {
  let message = typeof info.message === 'string' 
    ? info.message 
    : JSON.stringify(info.message);
  
  PII_PATTERNS.forEach(pattern => {
    message = message.replace(pattern, '***PII_REDACTED***');
  });
  
  info.message = message;
  return info;
});

// ❌ ПЛОХО
logger.log(`Пользователь зарегистрирован: ${email}`);

// ✅ ХОРОШО
logger.log('Пользователь зарегистрирован', { user_id: user.id });
```

## 4.5. Удаление данных пользователя (GDPR)

```typescript
// src/users/users.service.ts
async requestAccountDeletion(userId: number): Promise<DeletionResponseDto> {
  const user = await this.usersRepository.findOne({ 
    where: { id: userId },
    relations: ['bookings']
  });

  // Проверка активных бронирований
  const activeBookings = user.bookings.filter(b => 
    ['pending', 'confirmed', 'active'].includes(b.status)
  );

  if (activeBookings.length > 0) {
    throw new BadRequestException({
      message: 'Невозможно удалить аккаунт с активными бронированиями',
      active_bookings: activeBookings.map(b => ({ id: b.id, status: b.status }))
    });
  }

  // Мягкое удаление (30-дневный период восстановления)
  await this.usersRepository.update(userId, {
    deleted_at: new Date(),
    is_active: false
  });

  // Анонимизация бронирований
  await this.anonymizeUserBookings(userId);

  // Отзыв токенов
  await this.refreshTokensRepository.update(
    { user_id: userId },
    { revoked_at: new Date() }
  );

  // Логирование
  await this.auditLogsRepository.save({
    user_id: userId,
    action: 'ACCOUNT_DELETION_REQUESTED',
    timestamp: new Date()
  });

  return {
    message: 'Удаление запланировано',
    deletion_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    can_cancel_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  };
}

// Экспорт данных пользователя (GDPR Article 15)
async exportUserData(userId: number): Promise<UserDataExportDto> {
  const user = await this.usersRepository.findOne({
    where: { id: userId },
    relations: ['bookings', 'reviews', 'favorites']
  });

  return {
    personal_info: {
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      created_at: user.created_at
    },
    bookings: user.bookings.map(b => ({
      id: b.id,
      warehouse_name: b.warehouse?.name,
      status: b.status,
      created_at: b.created_at
    })),
    reviews: user.reviews.map(r => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      created_at: r.created_at
    })),
    favorites: user.favorites.map(f => ({
      warehouse_id: f.warehouse_id,
      added_at: f.created_at
    })),
    exported_at: new Date()
  };
}
```

---

# 5. Стандарты шифрования

## 5.1. TLS/HTTPS

### Обязательные требования

- TLS 1.2+ для всех соединений
- HSTS (HTTP Strict Transport Security)
- Let's Encrypt SSL сертификаты с автообновлением

### Конфигурация nginx

```nginx
# /etc/nginx/sites-available/selfstorage
server {
    listen 80;
    server_name selfstorage.com www.selfstorage.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name selfstorage.com www.selfstorage.com;

    # SSL сертификаты
    ssl_certificate /etc/letsencrypt/live/selfstorage.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/selfstorage.com/privkey.pem;

    # Протоколы и шифры
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    ssl_trusted_certificate /etc/letsencrypt/live/selfstorage.com/chain.pem;

    # Session cache
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;

    # DH parameters
    ssl_dhparam /etc/nginx/dhparam.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Auto-renewal сертификатов

```bash
# /etc/systemd/system/certbot-renewal.timer
[Unit]
Description=Certbot SSL renewal timer

[Timer]
OnCalendar=*-*-* 04:00:00
RandomizedDelaySec=3600
Persistent=true

[Install]
WantedBy=timers.target

# Активация
sudo systemctl enable certbot-renewal.timer
sudo systemctl start certbot-renewal.timer
```

## 5.2. Шифрование в транзите

### Внешние API

```typescript
// src/common/config/https-agent.config.ts
import * as https from 'https';

export const secureHttpsAgent = new https.Agent({
  rejectUnauthorized: true,
  minVersion: 'TLSv1.2',
});

// Использование с axios
const response = await axios.get('https://external-api.com/endpoint', {
  httpsAgent: secureHttpsAgent,
});
```

### PostgreSQL SSL

```typescript
// src/database/database.config.ts
export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: true,
    ca: fs.readFileSync('/path/to/ca-certificate.crt'),
  } : false,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
};
```

### Redis TLS

```typescript
// src/redis/redis.config.ts
export const redisConfig = {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT, 10),
  password: process.env.REDIS_PASSWORD,
  tls: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: true,
    ca: fs.readFileSync('/path/to/ca-certificate.crt'),
  } : undefined,
};
```

## 5.3. Шифрование at rest

### Пароли: bcrypt

```typescript
// src/auth/password.service.ts
@Injectable()
export class PasswordService {
  private readonly SALT_ROUNDS = 12; // ~250ms на хеширование

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
```

### Чувствительные поля: AES-256-GCM

```typescript
// src/common/services/encryption.service.ts
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly keyLength = 32;
  private readonly ivLength = 16;
  private readonly authTagLength = 16;

  private deriveKey(secret: string): Buffer {
    return crypto.scryptSync(secret, 'salt', this.keyLength);
  }

  encrypt(text: string): string {
    const key = this.deriveKey(process.env.ENCRYPTION_SECRET);
    const iv = crypto.randomBytes(this.ivLength);
    
    const cipher = crypto.createCipheriv(this.algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    // Формат: IV:AuthTag:Ciphertext (все в base64)
    return `${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted}`;
  }

  decrypt(encryptedData: string): string {
    const [ivBase64, authTagBase64, ciphertext] = encryptedData.split(':');
    
    const key = this.deriveKey(process.env.ENCRYPTION_SECRET);
    const iv = Buffer.from(ivBase64, 'base64');
    const authTag = Buffer.from(authTagBase64, 'base64');
    
    const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}
```

### S3 Server-Side Encryption

```typescript
// src/storage/s3.service.ts
async uploadFile(file: Express.Multer.File, key: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ServerSideEncryption: 'AES256', // SSE-S3
  });

  await this.s3Client.send(command);
  return `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${key}`;
}
```

## 5.4. Шифрование бэкапов

```bash
#!/bin/bash
# /opt/scripts/backup-database.sh

set -e

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="selfstorage_backup_${TIMESTAMP}.sql"
ENCRYPTED_FILE="${BACKUP_FILE}.gpg"

# Создание дампа
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME > /tmp/${BACKUP_FILE}

# Сжатие
gzip /tmp/${BACKUP_FILE}

# Шифрование (GPG symmetric)
gpg --symmetric --cipher-algo AES256 \
    --passphrase "$BACKUP_ENCRYPTION_PASSWORD" \
    --batch --yes \
    -o /tmp/${ENCRYPTED_FILE} \
    /tmp/${BACKUP_FILE}.gz

# Загрузка в S3
aws s3 cp /tmp/${ENCRYPTED_FILE} \
    s3://${BACKUP_BUCKET}/database/${ENCRYPTED_FILE} \
    --sse AES256

# Очистка
rm -f /tmp/${BACKUP_FILE}* /tmp/${ENCRYPTED_FILE}

echo "Backup completed: ${ENCRYPTED_FILE}"
```

### Восстановление из бэкапа

```bash
#!/bin/bash
# /opt/scripts/restore-database.sh

BACKUP_FILE=$1

# Скачивание из S3
aws s3 cp s3://${BACKUP_BUCKET}/database/${BACKUP_FILE} /tmp/

# Расшифровка
gpg --decrypt \
    --passphrase "$BACKUP_ENCRYPTION_PASSWORD" \
    --batch --yes \
    -o /tmp/backup.sql.gz \
    /tmp/${BACKUP_FILE}

# Распаковка
gunzip /tmp/backup.sql.gz

# Восстановление
psql -h $DB_HOST -U $DB_USER -d $DB_NAME < /tmp/backup.sql

# Очистка
rm -f /tmp/backup.sql* /tmp/${BACKUP_FILE}
```

---

# 6. Управление секретами

## 6.1. Doppler (рекомендуется для MVP)

### Настройка

```bash
# Установка Doppler CLI
curl -Ls https://cli.doppler.com/install.sh | sh

# Авторизация
doppler login

# Настройка проекта
doppler setup

# Установка секретов
doppler secrets set JWT_SECRET="your-secret-key"
doppler secrets set DB_PASSWORD="your-db-password"
doppler secrets set CLAUDE_API_KEY="sk-ant-api..."

# Запуск приложения с секретами
doppler run -- npm start
```

### Интеграция с CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Install Doppler CLI
        uses: dopplerhq/cli-action@v3
        
      - name: Deploy
        run: doppler run -- ./deploy.sh
        env:
          DOPPLER_TOKEN: ${{ secrets.DOPPLER_TOKEN_PRODUCTION }}
```

### Docker интеграция

```dockerfile
# Dockerfile
FROM node:20-alpine

# Установка Doppler CLI
RUN wget -q -t3 'https://packages.doppler.com/public/cli/rsa.8004D9FF50437357.key' -O /etc/apk/keys/cli@doppler-8004D9FF50437357.rsa.pub && \
    echo 'https://packages.doppler.com/public/cli/alpine/any-version/main' | tee -a /etc/apk/repositories && \
    apk add doppler

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist

# Запуск через Doppler
CMD ["doppler", "run", "--", "node", "dist/main.js"]
```

## 6.2. HashiCorp Vault (альтернатива)

```typescript
// src/config/vault.service.ts
import Vault from 'node-vault';

@Injectable()
export class VaultService {
  private client: Vault.client;

  constructor() {
    this.client = Vault({
      endpoint: process.env.VAULT_ADDR,
      token: process.env.VAULT_TOKEN,
    });
  }

  async getSecret(path: string): Promise<Record<string, string>> {
    const result = await this.client.read(`secret/data/${path}`);
    return result.data.data;
  }

  async getDatabaseCredentials(): Promise<{ username: string; password: string }> {
    const secrets = await this.getSecret('selfstorage/database');
    return {
      username: secrets.DB_USERNAME,
      password: secrets.DB_PASSWORD,
    };
  }
}
```

## 6.3. Политика ротации ключей

| Секрет | Частота ротации | Метод |
|--------|----------------|-------|
| **JWT_SECRET** | 90 дней | Zero-downtime rotation |
| **JWT_REFRESH_SECRET** | 90 дней | Zero-downtime rotation |
| **ENCRYPTION_SECRET** | 90 дней | Re-encrypt sensitive data |
| **DB_PASSWORD** | 90 дней | Dual-password support |
| **API Keys (Claude, Yandex)** | 90 дней | Generate new, update config |
| **Service Tokens** | 30 дней | Automatic via Doppler/Vault |

### Zero-Downtime JWT Rotation

```typescript
// src/auth/jwt-rotation.service.ts
@Injectable()
export class JWTRotationService {
  
  async rotateJWTSecret(): Promise<void> {
    // 1. Генерация нового секрета
    const newSecret = crypto.randomBytes(32).toString('base64');
    
    // 2. Сохранение как SECONDARY
    await this.secretsService.set('JWT_SECRET_NEW', newSecret);
    
    // 3. Обновление конфигурации для приема обоих секретов
    // JwtStrategy теперь проверяет оба секрета
    
    // 4. Ожидание (20 минут - время жизни старых токенов + буфер)
    // После этого все токены будут подписаны новым секретом
    
    // 5. Продвижение нового секрета в PRIMARY
    await this.secretsService.set('JWT_SECRET_OLD', process.env.JWT_SECRET);
    await this.secretsService.set('JWT_SECRET', newSecret);
    await this.secretsService.delete('JWT_SECRET_NEW');
    
    // 6. Удаление старого секрета через 24 часа
    // (grace period для редких edge cases)
  }
}

// JWT Strategy с поддержкой нескольких секретов
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: (request, rawJwtToken, done) => {
        // Попытка валидации с текущим секретом
        const secrets = [
          process.env.JWT_SECRET,
          process.env.JWT_SECRET_NEW,
          process.env.JWT_SECRET_OLD,
        ].filter(Boolean);
        
        done(null, secrets);
      },
    });
  }
}
```

### Мониторинг ротации

```typescript
// src/tasks/key-rotation-monitor.service.ts
@Injectable()
export class KeyRotationMonitorService {
  
  @Cron('0 9 * * 1') // Каждый понедельник в 9:00
  async checkRotationStatus() {
    const secrets = [
      { name: 'JWT_SECRET', lastRotated: await this.getLastRotation('JWT_SECRET') },
      { name: 'DB_PASSWORD', lastRotated: await this.getLastRotation('DB_PASSWORD') },
      { name: 'ENCRYPTION_SECRET', lastRotated: await this.getLastRotation('ENCRYPTION_SECRET') },
    ];

    for (const secret of secrets) {
      const daysSinceRotation = this.daysSince(secret.lastRotated);
      
      if (daysSinceRotation >= 90) {
        await this.alertService.sendCritical({
          message: `Секрет ${secret.name} не ротировался ${daysSinceRotation} дней!`,
          action: 'Требуется немедленная ротация',
        });
      } else if (daysSinceRotation >= 75) {
        await this.alertService.sendWarning({
          message: `Секрет ${secret.name} требует ротации через ${90 - daysSinceRotation} дней`,
        });
      }
    }
  }
}
```

## 6.4. Защита от утечки в репозиторий

### .gitignore

```gitignore
# Секреты
.env
.env.*
!.env.example
*.key
*.pem
secrets/
credentials/

# Бэкапы с данными
*.sql
*.backup
*.dump
```

### Pre-commit hook

```bash
#!/bin/bash
# .husky/pre-commit

# Проверка на секреты
PATTERNS=(
  "password\s*=\s*['\"][^'\"]+['\"]"
  "api_key\s*=\s*['\"][^'\"]+['\"]"
  "secret\s*=\s*['\"][^'\"]+['\"]"
  "token\s*=\s*['\"][^'\"]+['\"]"
  "sk-ant-api"
  "SG\.[a-zA-Z0-9_-]+"
)

for pattern in "${PATTERNS[@]}"; do
  if git diff --cached --diff-filter=ACM | grep -iE "$pattern"; then
    echo "❌ Обнаружены потенциальные секреты в коммите!"
    echo "Паттерн: $pattern"
    exit 1
  fi
done

# Проверка на console.log в production коде
if git diff --cached --diff-filter=ACM -- '*.ts' '*.tsx' | grep -E "console\.(log|debug|info)"; then
  echo "⚠️ Обнаружены console.log в коде. Удалите перед коммитом."
  exit 1
fi

exit 0
```

### Gitleaks конфигурация

```toml
# .gitleaks.toml
title = "Self-Storage Aggregator Gitleaks Config"

[[rules]]
id = "jwt-secret"
description = "JWT Secret"
regex = '''JWT_SECRET\s*=\s*['\"]?[A-Za-z0-9+/=]{32,}['\"]?'''
tags = ["secret", "jwt"]

[[rules]]
id = "db-password"
description = "Database Password"
regex = '''DB_PASSWORD\s*=\s*['\"]?[^\s'\"]+['\"]?'''
tags = ["secret", "database"]

[[rules]]
id = "claude-api-key"
description = "Claude API Key"
regex = '''sk-ant-api[a-zA-Z0-9_-]{20,}'''
tags = ["secret", "api"]

[[rules]]
id = "sendgrid-api-key"
description = "SendGrid API Key"
regex = '''SG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43}'''
tags = ["secret", "api"]

[allowlist]
paths = [
  '''.env.example''',
  '''.*_test\.go''',
  '''.*\.spec\.ts''',
]
```

### GitHub Actions для сканирования

```yaml
# .github/workflows/security-scan.yml
name: Security Scan

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  gitleaks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          
      - name: Gitleaks Scan
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  trufflehog:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          
      - name: TruffleHog Scan
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          extra_args: --only-verified
```

### Действия при обнаружении утечки

```bash
#!/bin/bash
# scripts/remediate-secret-leak.sh

SECRET_FILE=$1
SECRET_NAME=$2

echo "🚨 Обнаружена утечка секрета: $SECRET_NAME"

# 1. Удаление из истории Git
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch $SECRET_FILE" \
  --prune-empty --tag-name-filter cat -- --all

# Или с BFG (быстрее)
# bfg --delete-files $SECRET_FILE

# 2. Очистка reflog
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 3. Force push (требуется координация с командой!)
echo "⚠️ Требуется force push. Уведомите команду!"
# git push origin --force --all
# git push origin --force --tags

# 4. Ротация секрета
echo "📝 КРИТИЧНО: Немедленно ротируйте секрет $SECRET_NAME!"

# 5. Уведомление команды
echo "📧 Уведомите команду о необходимости пере-клонирования репозитория"
```

---

# 7. Безопасная разработка и SDLC

## 7.1. Сканирование зависимостей (SCA)

### npm audit в CI/CD

```yaml
# .github/workflows/security.yml
jobs:
  dependency-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm audit --audit-level=moderate
```

### Snyk интеграция

```yaml
jobs:
  snyk-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high
```

### GitHub Dependabot

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    reviewers:
      - "backend-team"
```

## 7.2. Статический анализ кода (SAST)

### ESLint Security Plugins

```javascript
// .eslintrc.js
module.exports = {
  extends: ['plugin:security/recommended'],
  plugins: ['security', 'security-node'],
  rules: {
    'security/detect-object-injection': 'error',
    'security/detect-unsafe-regex': 'error',
    'security/detect-eval-with-expression': 'error',
    'security/detect-pseudoRandomBytes': 'error',
    'security-node/detect-sql-injection': 'error',
  },
};
```

### CodeQL Analysis

```yaml
# .github/workflows/codeql.yml
name: CodeQL
on:
  push:
    branches: [main]
  schedule:
    - cron: '0 4 * * 1'
jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: github/codeql-action/init@v3
        with:
          languages: javascript, typescript
          queries: security-extended
      - uses: github/codeql-action/autobuild@v3
      - uses: github/codeql-action/analyze@v3
```

## 7.3. Сканирование секретов

### Pre-commit hooks

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.0
    hooks:
      - id: gitleaks
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: detect-private-key
```

### GitHub Actions

```yaml
jobs:
  gitleaks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: gitleaks/gitleaks-action@v2
```

## 7.4. Docker Hardening

```dockerfile
FROM node:20-alpine AS production
RUN apk add --no-cache dumb-init
RUN addgroup -g 1001 -S nestjs && adduser -S nestjs -u 1001 -G nestjs
WORKDIR /app
COPY --from=build --chown=nestjs:nestjs /app/dist ./dist
COPY --from=build --chown=nestjs:nestjs /app/node_modules ./node_modules
USER nestjs
HEALTHCHECK --interval=30s --timeout=3s CMD node -e "require('http').get('http://localhost:4000/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]
```

## 7.5. Code Review Security Checklist

- [ ] Endpoints защищены JwtAuthGuard
- [ ] Корректные @Roles()
- [ ] Operator scoping для /operator/*
- [ ] DTO с class-validator
- [ ] Параметризованные SQL
- [ ] PII не логируется
- [ ] Нет hardcoded secrets
- [ ] npm audit пройден

---

# 8. Требования соответствия

## 8.1. Правовая база

| Регламент | Применимость | Статус |
|-----------|-------------|--------|
| **GDPR** | EU users | ✅ Реализовано |
| **PDPA** | Россия | ✅ Частично |

## 8.2. Управление согласиями

```typescript
// src/auth/dto/register.dto.ts
export class RegisterDto {
  @IsBoolean()
  consent_terms: boolean; // Обязательно
  
  @IsBoolean()
  consent_privacy: boolean; // Обязательно
  
  @IsBoolean()
  @IsOptional()
  consent_marketing?: boolean; // Опционально
}
```

```sql
CREATE TABLE user_consents (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    consent_type VARCHAR(50) NOT NULL,
    consent_given BOOLEAN NOT NULL,
    consent_version VARCHAR(20) NOT NULL,
    ip_address INET,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## 8.3. Права пользователей (GDPR)

| Право | Реализация |
|-------|-----------|
| **Access** (Art. 15) | GET /users/me/data-export |
| **Rectification** (Art. 16) | PATCH /users/me |
| **Erasure** (Art. 17) | DELETE /users/me |
| **Portability** (Art. 20) | GET /users/me/data-export (JSON) |
| **Withdraw consent** (Art. 7.3) | DELETE /users/me/consents/:type |

## 8.4. Политика конфиденциальности

Обязательные разделы:
- Контроллер данных
- Собираемые данные
- Правовые основания
- Права пользователей
- Сроки хранения
- Меры безопасности
- Контакты

## 8.5. Логи аудита

```sql
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id INTEGER,
    operator_id INTEGER,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id VARCHAR(50),
    ip_address INET,
    changes JSONB,
    status VARCHAR(20) DEFAULT 'success',
    created_at TIMESTAMP DEFAULT NOW()
);
```

Аудируемые действия:
- WAREHOUSE_CREATED/UPDATED/DELETED
- BOX_CREATED/UPDATED/DELETED
- BOOKING_CREATED/APPROVED/REJECTED/CANCELLED
- USER_REGISTERED/LOGIN/LOGOUT/DELETED
- OPERATOR_REGISTERED/APPROVED/SUSPENDED
- FAILED_LOGIN, UNAUTHORIZED_ACCESS

## 8.6. Уведомление о нарушениях

| Регламент | Срок (орган) | Срок (пользователи) |
|-----------|-------------|---------------------|
| GDPR | 72 часа | Без задержки |
| PDPA | 72 часа | Если вероятен ущерб |

---

# 9. Мониторинг безопасности

## 9.1. Конфигурация алертов

### Уровни приоритета

| Уровень | Время реакции | Каналы уведомления | Примеры |
|---------|--------------|-------------------|---------|
| **CRITICAL** | < 15 мин | Slack, Email, SMS, PagerDuty | Утечка БД, компрометация admin, ransomware |
| **HIGH** | < 1 час | Slack, Email | SQL-инъекция, unauthorized API access |
| **MEDIUM** | < 4 часа | Slack | Rate limit exceeded, unusual patterns |
| **LOW** | < 24 часа | Slack | Single failed login, scanner detected |
| **INFO** | Нет | Логи | Successful login, normal usage |

### Сервис алертов

```typescript
// src/security/services/security-alert.service.ts
@Injectable()
export class SecurityAlertService {
  
  async triggerAlert(alert: {
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    type: string;
    description: string;
    source: string;
    metadata?: Record<string, any>;
  }): Promise<void> {
    this.logger.warn(`[SECURITY ALERT] ${alert.severity}: ${alert.type}`, alert);

    // Аудит лог
    await this.auditService.logAction({
      action: 'SECURITY_ALERT_TRIGGERED',
      status: 'success',
      changes: { severity: alert.severity, type: alert.type },
    });

    // Отправка уведомлений по каналам
    const config = ALERT_CONFIGURATIONS[alert.severity];
    
    if (config.channels.includes('slack')) {
      await this.sendSlackAlert(alert);
    }
    
    if (config.channels.includes('email')) {
      await this.sendEmailAlert(alert, config.recipients);
    }
    
    if (config.channels.includes('sms')) {
      await this.sendSMSAlert(alert, config.recipients);
    }
  }

  private async sendSlackAlert(alert: any): Promise<void> {
    const emoji = {
      CRITICAL: '🚨',
      HIGH: '⚠️',
      MEDIUM: '📢',
      LOW: '📝',
    };
    
    await this.slackService.send({
      channel: '#security-alerts',
      text: `${emoji[alert.severity]} **${alert.severity}**: ${alert.type}\n${alert.description}`,
    });
  }
}
```

## 9.2. Обнаружение подозрительного поведения

```typescript
// src/security/services/anomaly-detection.service.ts
@Injectable()
export class AnomalyDetectionService {
  
  /**
   * Обнаружение необычных API паттернов
   */
  async detectUnusualAPIUsage(userId: number, endpoint: string): Promise<void> {
    const key = `api:usage:${userId}:${endpoint}`;
    const count = await this.redis.incr(key);
    await this.redis.expire(key, 3600);

    const baseline = await this.getUserBaseline(userId, endpoint);

    // Алерт если использование в 5 раз выше нормы
    if (baseline > 0 && count > baseline * 5) {
      await this.alertService.triggerAlert({
        severity: 'MEDIUM',
        type: 'UNUSUAL_API_USAGE',
        description: `User ${userId}: ${count} запросов к ${endpoint} (норма: ${baseline})`,
        source: 'anomaly_detection',
        metadata: { userId, endpoint, count, baseline },
      });
    }
  }

  /**
   * Обнаружение необычного входа
   */
  async detectUnusualLogin(userId: number, metadata: {
    ipAddress: string;
    userAgent: string;
  }): Promise<void> {
    const knownIPs = await this.getKnownUserIPs(userId);
    
    if (!knownIPs.includes(metadata.ipAddress)) {
      const ipInfo = await this.getIPGeolocation(metadata.ipAddress);
      
      if (this.isSuspiciousLocation(ipInfo)) {
        await this.alertService.triggerAlert({
          severity: 'MEDIUM',
          type: 'UNUSUAL_LOGIN_LOCATION',
          description: `User ${userId}: вход из ${ipInfo.country}`,
          source: 'anomaly_detection',
          metadata: { userId, ipAddress: metadata.ipAddress, location: ipInfo },
        });

        // Уведомление пользователя
        await this.notifyUserOfUnusualLogin(userId, ipInfo);
      }

      await this.addKnownIP(userId, metadata.ipAddress);
    }
  }

  /**
   * Обнаружение массового создания аккаунтов
   */
  async detectRapidAccountCreation(ipAddress: string): Promise<void> {
    const key = `registrations:ip:${ipAddress}`;
    const count = await this.redis.incr(key);
    await this.redis.expire(key, 3600);

    if (count >= 5) {
      await this.alertService.triggerAlert({
        severity: 'HIGH',
        type: 'RAPID_ACCOUNT_CREATION',
        description: `${count} аккаунтов с IP ${ipAddress} за час`,
        source: 'anomaly_detection',
        metadata: { ipAddress, count },
      });

      // Блокировка регистраций с этого IP
      await this.blockRegistrations(ipAddress, 86400);
    }
  }

  /**
   * Обнаружение scraping
   */
  async detectScrapingBehavior(ipAddress: string): Promise<void> {
    const key = `scraping:${ipAddress}`;
    const patterns = await this.redis.lrange(key, 0, 99);
    
    if (patterns.length >= 50) {
      const timestamps = patterns.map(p => parseInt(p));
      const intervals = [];
      
      for (let i = 1; i < timestamps.length; i++) {
        intervals.push(timestamps[i-1] - timestamps[i]);
      }

      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const variance = intervals.reduce((sum, val) => sum + Math.pow(val - avgInterval, 2), 0) / intervals.length;
      const stdDev = Math.sqrt(variance);

      // Слишком регулярные запросы = бот
      if (stdDev < 500 && avgInterval < 5000) {
        await this.alertService.triggerAlert({
          severity: 'MEDIUM',
          type: 'SCRAPING_DETECTED',
          description: `Подозрение на scraping с IP ${ipAddress}`,
          source: 'anomaly_detection',
          metadata: { ipAddress, avgInterval, stdDev },
        });

        await this.applyAggressiveRateLimit(ipAddress);
      }
    }
  }
}
```

## 9.3. Мониторинг неудачных входов

```typescript
// src/auth/guards/failed-login-monitor.guard.ts
@Injectable()
export class FailedLoginMonitorService {
  
  async trackFailedLogin(email: string, ipAddress: string): Promise<void> {
    const userKey = `failed:login:${email}:${ipAddress}`;
    const globalKey = `failed:login:global:${ipAddress}`;

    const userAttempts = await this.redis.incr(userKey);
    const globalAttempts = await this.redis.incr(globalKey);

    await this.redis.expire(userKey, 900);  // 15 минут
    await this.redis.expire(globalKey, 3600); // 1 час

    // Алерт на 5 попытках
    if (userAttempts === 5) {
      await this.alertService.triggerAlert({
        severity: 'MEDIUM',
        type: 'MULTIPLE_FAILED_LOGINS_USER',
        description: `5 неудачных входов для ${email} с ${ipAddress}`,
        source: 'failed_login_monitor',
        metadata: { email, ipAddress, attempts: userAttempts },
      });
    }

    // Блокировка аккаунта на 10+ попытках
    if (userAttempts >= 10) {
      await this.alertService.triggerAlert({
        severity: 'HIGH',
        type: 'BRUTE_FORCE_ATTACK_USER',
        description: `${userAttempts} неудачных входов для ${email}`,
        source: 'failed_login_monitor',
        metadata: { email, ipAddress, attempts: userAttempts },
      });

      await this.lockAccount(email, 3600); // 1 час
    }

    // Блокировка IP на 20+ попытках
    if (globalAttempts >= 20) {
      await this.alertService.triggerAlert({
        severity: 'HIGH',
        type: 'BRUTE_FORCE_ATTACK_IP',
        description: `${globalAttempts} неудачных входов с IP ${ipAddress}`,
        source: 'failed_login_monitor',
        metadata: { ipAddress, attempts: globalAttempts },
      });

      await this.blockIP(ipAddress, 7200); // 2 часа
    }

    // Аудит
    await this.auditService.logAction({
      action: 'FAILED_LOGIN_ATTEMPT',
      status: 'failure',
      ip_address: ipAddress,
      changes: { email, attempts: userAttempts },
    });
  }

  private async lockAccount(email: string, ttl: number): Promise<void> {
    await this.redis.setex(`locked:account:${email}`, ttl, '1');
    
    await this.emailService.send(email, {
      subject: 'Аккаунт временно заблокирован',
      body: `Ваш аккаунт заблокирован на ${ttl / 60} минут из-за множественных неудачных попыток входа.`,
    });
  }

  private async blockIP(ipAddress: string, ttl: number): Promise<void> {
    await this.redis.setex(`blocked:ip:${ipAddress}`, ttl, '1');
  }
}
```

## 9.4. Brute-Force Protection

### Проверка блокировки

```typescript
// src/common/guards/brute-force-protection.guard.ts
@Injectable()
export class BruteForceProtectionGuard implements CanActivate {
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const ipAddress = request.ip;
    const endpoint = request.route.path;

    // Проверка блокировки IP
    if (await this.isIPBlocked(ipAddress)) {
      throw new TooManyRequestsException('IP временно заблокирован');
    }

    // Проверка блокировки аккаунта
    if (endpoint.includes('/auth/login')) {
      const { email } = request.body;
      if (await this.isAccountLocked(email)) {
        throw new UnauthorizedException('Аккаунт временно заблокирован');
      }
    }

    return true;
  }

  private async isIPBlocked(ip: string): Promise<boolean> {
    return !!(await this.redis.get(`blocked:ip:${ip}`));
  }

  private async isAccountLocked(email: string): Promise<boolean> {
    return !!(await this.redis.get(`locked:account:${email}`));
  }
}
```

### Progressive Delay

```typescript
// src/auth/services/progressive-delay.service.ts
@Injectable()
export class ProgressiveDelayService {
  
  async applyDelay(email: string, ipAddress: string): Promise<void> {
    const attempts = await this.getFailedAttempts(email, ipAddress);
    
    // Progressive delay: 0s, 2s, 5s, 10s, 30s, 60s
    const delays = [0, 2000, 5000, 10000, 30000, 60000];
    const delay = delays[Math.min(attempts, delays.length - 1)];

    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

## 9.5. Rate Limiting

### Многоуровневый rate limiting

```typescript
// src/common/config/rate-limit.config.ts
export const RATE_LIMIT_TIERS = {
  ip_anonymous: {
    global: { limit: 100, window: 60 },
    auth: { limit: 5, window: 900 },
    registration: { limit: 3, window: 3600 },
  },
  authenticated: {
    global: { limit: 300, window: 60 },
    ai: { limit: 20, window: 3600 },
    bookings: { limit: 10, window: 3600 },
  },
  operator: {
    global: { limit: 500, window: 60 },
    warehouses: { limit: 100, window: 3600 },
    uploads: { limit: 50, window: 3600 },
  },
  admin: {
    global: { limit: 1000, window: 60 },
  },
};
```

### Сервис rate limiting

```typescript
// src/common/services/rate-limit.service.ts
@Injectable()
export class RateLimitService {
  
  async checkRateLimit(key: string, limit: number, window: number): Promise<boolean> {
    const current = await this.redis.incr(key);
    if (current === 1) {
      await this.redis.expire(key, window);
    }
    return current <= limit;
  }

  async getRemainingRequests(key: string, limit: number): Promise<number> {
    const current = await this.redis.get(key);
    return Math.max(0, limit - (current ? parseInt(current) : 0));
  }

  async applyAggressiveLimit(identifier: string, duration: number): Promise<void> {
    await this.redis.setex(`aggressive:limit:${identifier}`, duration, '1');
  }
}
```

## 9.6. Автоматические ответные действия

```typescript
// src/security/services/automated-response.service.ts
@Injectable()
export class AutomatedResponseService {
  
  async respondToThreat(threat: {
    type: string;
    severity: string;
    metadata: Record<string, any>;
  }): Promise<void> {
    
    switch (threat.type) {
      case 'BRUTE_FORCE_ATTACK_IP':
        await this.blockIP(threat.metadata.ipAddress, this.getBlockDuration(threat.metadata.attempts));
        break;

      case 'RAPID_ACCOUNT_CREATION':
        await this.blockRegistrations(threat.metadata.ipAddress, 86400);
        break;

      case 'SCRAPING_DETECTED':
        await this.applyAggressiveLimit(threat.metadata.ipAddress, 3600);
        break;

      case 'SQL_INJECTION_ATTEMPT':
        await this.blockIP(threat.metadata.ipAddress, 86400 * 7);
        if (threat.metadata.userId) {
          await this.suspendAccount(threat.metadata.userId, 'sql_injection_attempt');
        }
        break;

      case 'PRIVILEGE_ESCALATION_ATTEMPT':
        await this.suspendAccount(threat.metadata.userId, 'privilege_escalation');
        break;

      case 'MASS_DATA_EXPORT':
        await this.restrictExportPrivileges(threat.metadata.userId, 86400);
        break;
    }
  }

  private getBlockDuration(attempts: number): number {
    if (attempts > 50) return 86400; // 24 часа
    if (attempts > 20) return 14400; // 4 часа
    return 7200; // 2 часа
  }

  private async suspendAccount(userId: number, reason: string): Promise<void> {
    await this.usersRepository.update(userId, {
      is_active: false,
      suspension_reason: reason,
      suspended_at: new Date(),
    });

    await this.redis.del(`sessions:user:${userId}`);

    await this.emailService.send(userId, {
      subject: 'Аккаунт приостановлен',
      body: `Ваш аккаунт приостановлен: ${reason}. Свяжитесь с security@selfstorage.com`,
    });
  }
}
```

---

# 10. План реагирования на инциденты

## 10.1. Классификация инцидентов

### Типы инцидентов

| Категория | Примеры | Severity |
|-----------|---------|----------|
| **Data Breach** | Утечка БД, эксфильтрация данных | CRITICAL |
| **Account Compromise** | Компрометация admin/operator/user | CRITICAL/HIGH |
| **Attacks** | SQL injection, XSS, DDoS | CRITICAL/HIGH |
| **Infrastructure** | Компрометация сервера, БД | CRITICAL |
| **Insider Threat** | Злонамеренные действия сотрудника | CRITICAL |
| **Service Disruption** | Полный/частичный outage | CRITICAL/HIGH |

### Матрица severity

| Severity | Impact | Время реакции | Уведомления |
|----------|--------|--------------|-------------|
| **CRITICAL** | High - PII exposed, full control compromised | < 15 мин | Users, Authority, Management, Legal |
| **HIGH** | Medium - Limited breach, service affected | < 1 час | Management, Security Team |
| **MEDIUM** | Low - Single user, limited scope | < 4 часа | Security Team |
| **LOW** | Minimal - Attempt blocked, no impact | < 24 часа | Security Team |

## 10.2. Процесс реагирования

### Фазы инцидента

```
1. DETECTION (< 15 мин)
   - Верификация инцидента
   - Классификация severity
   - Активация алертов
   - Сбор response team

2. TRIAGE (< 1 час)
   - Определение scope
   - Оценка затронутых систем/пользователей
   - Идентификация вектора атаки
   - Оценка бизнес-impact

3. CONTAINMENT (переменное)
   - Изоляция систем
   - Блокировка IP
   - Отзыв credentials
   - Emergency patches

4. ERADICATION (переменное)
   - Удаление malware/backdoors
   - Закрытие уязвимостей
   - Сброс credentials
   - Верификация очистки

5. RECOVERY (переменное)
   - Восстановление из бэкапов
   - Поэтапное включение сервисов
   - Мониторинг реинфекции
   - Валидация данных

6. POST-INCIDENT (1-2 недели)
   - Root Cause Analysis
   - Lessons Learned
   - Обновление controls
   - Update IR plan
```

### Сервис управления инцидентами

```typescript
// src/security/services/incident-response.service.ts
@Injectable()
export class IncidentResponseService {
  
  async initiateResponse(incident: {
    type: string;
    description: string;
    detectedBy: string;
    metadata?: Record<string, any>;
  }): Promise<SecurityIncident> {
    const severity = INCIDENT_SEVERITY_MATRIX[incident.type].severity;

    // Создание записи инцидента
    const record = await this.incidentsRepository.save({
      type: incident.type,
      description: incident.description,
      detected_by: incident.detectedBy,
      detected_at: new Date(),
      severity,
      phase: 'DETECTION',
      status: 'ACTIVE',
      metadata: incident.metadata,
    });

    // Аудит
    await this.auditService.logAction({
      action: 'INCIDENT_INITIATED',
      changes: { incident_id: record.id, type: incident.type, severity },
    });

    // Алерт
    await this.alertService.triggerAlert({
      severity,
      type: `INCIDENT_${incident.type}`,
      description: incident.description,
      source: 'incident_response',
      metadata: { incident_id: record.id, ...incident.metadata },
    });

    // Уведомление команды
    await this.notifyIncidentTeam(record);

    // Переход в TRIAGE
    await this.transitionPhase(record.id, 'TRIAGE');

    return record;
  }

  async transitionPhase(incidentId: number, phase: string): Promise<void> {
    await this.incidentsRepository.update(incidentId, {
      phase,
      [`${phase.toLowerCase()}_started_at`]: new Date(),
    });

    await this.executePhaseActions(incidentId, phase);
  }

  private async executePhaseActions(incidentId: number, phase: string): Promise<void> {
    const incident = await this.incidentsRepository.findOne({ where: { id: incidentId } });

    switch (phase) {
      case 'CONTAINMENT':
        await this.executeContainmentActions(incident);
        break;
      case 'ERADICATION':
        await this.executeEradicationActions(incident);
        break;
      case 'RECOVERY':
        await this.executeRecoveryActions(incident);
        break;
      case 'POST_INCIDENT':
        await this.schedulePostIncidentReview(incident);
        break;
    }
  }

  private async executeContainmentActions(incident: SecurityIncident): Promise<void> {
    switch (incident.type) {
      case 'ADMIN_ACCOUNT_COMPROMISED':
        await this.revokeAllAdminSessions();
        await this.disableCompromisedAccount(incident.metadata?.userId);
        await this.requirePasswordResetForAllAdmins();
        break;

      case 'SQL_INJECTION_SUCCESSFUL':
        await this.enableDatabaseReadOnlyMode();
        await this.blockSuspiciousIPs(incident.metadata?.sourceIPs);
        break;

      case 'DDOS_ATTACK':
        await this.enableDDoSMitigation();
        await this.enableCloudflareUnderAttackMode();
        break;

      case 'DATA_BREACH_CONFIRMED':
        await this.disableDataExports();
        await this.notifyAffectedUsers(incident.metadata?.affectedUserIds);
        break;
    }
  }
}
```

## 10.3. Матрица эскалации

### Уровни эскалации

```typescript
export const ESCALATION_MATRIX = {
  CRITICAL: {
    initial: {
      team: ['on-call-engineer', 'security-lead'],
      response_time: '< 15 мин',
    },
    level_1: {
      trigger: 'Немедленно',
      team: ['cto', 'devops-lead', 'backend-lead'],
      notify: ['email', 'sms', 'slack'],
    },
    level_2: {
      trigger: 'Если не сдержано за 30 мин',
      team: ['ceo', 'legal'],
      notify: ['email', 'sms', 'phone'],
    },
    level_3: {
      trigger: 'Если подтверждена утечка данных',
      team: ['board', 'external-counsel', 'pr-team'],
      external: ['data-protection-authority', 'law-enforcement'],
    },
  },

  HIGH: {
    initial: {
      team: ['security-team', 'backend-team'],
      response_time: '< 1 час',
    },
    level_1: {
      trigger: 'Немедленно',
      team: ['security-lead', 'devops-lead'],
      notify: ['email', 'slack'],
    },
    level_2: {
      trigger: 'Если не решено за 2 часа',
      team: ['cto'],
      notify: ['email', 'sms'],
    },
  },
};
```

## 10.4. Root Cause Analysis (RCA)

### Шаблон RCA

```markdown
# Root Cause Analysis: [Тип инцидента]

**Incident ID:** [ID]
**Дата:** [Дата]
**Подготовлено:** Security Team

## Executive Summary
**Что произошло:** [Краткое описание]
**Impact:** [Затронутые пользователи/системы]
**Root Cause:** [Коренная причина]
**Решение:** [Как решено]

## Timeline
- **[Время]**: [Событие]
- ...

## 5 Whys Analysis
1. **Почему это произошло?** [Ответ]
2. **Почему?** [Ответ]
3. **Почему?** [Ответ]
4. **Почему?** [Ответ]
5. **Root Cause:** [Коренная причина]

## Contributing Factors
**Technical:** [Список]
**Process:** [Список]
**Human:** [Список]

## Impact Analysis
- Users Affected: [Число]
- Data Exposed: [Типы данных]
- Services Disrupted: [Сервисы]
- Financial Impact: [Оценка]

## What Went Well
- [Пункт]

## What Could Be Improved
- [Пункт]

## Action Items
| # | Задача | Owner | Приоритет | Deadline | Status |
|---|--------|-------|-----------|----------|--------|
| 1 | [Задача] | [Owner] | High | [Дата] | Open |

## Prevention Measures
**Immediate (0-7 дней):** [Меры]
**Short-term (1-3 месяца):** [Меры]
**Long-term (3-12 месяцев):** [Меры]
```

## 10.5. Уведомление о нарушениях

### Требования по срокам

| Регламент | Срок уведомления органа | Срок уведомления пользователей |
|-----------|------------------------|-------------------------------|
| **GDPR** | 72 часа | Без задержки (если высокий риск) |
| **PDPA** | 72 часа | Если вероятен ущерб |

### Сервис уведомлений

```typescript
// src/security/services/breach-notification.service.ts
@Injectable()
export class BreachNotificationService {
  
  async notifyAffectedUsers(userIds: number[], incident: SecurityIncident): Promise<void> {
    for (const userId of userIds) {
      await this.emailService.send(userId, {
        subject: 'Важное уведомление о безопасности',
        template: 'security-incident',
        data: {
          incident_type: incident.type,
          description: this.getUserFriendlyDescription(incident),
          actions_taken: incident.containment_actions,
          user_actions: [
            'Рекомендуем сменить пароль',
            'Проверьте активность аккаунта',
            'При подозрительной активности свяжитесь с нами',
          ],
          contact_email: 'security@selfstorage.com',
        },
      });
    }
  }

  async notifyDataProtectionAuthority(incident: SecurityIncident): Promise<void> {
    const report = {
      organization: 'Self-Storage Aggregator LLC',
      incident_type: incident.type,
      detected_at: incident.detected_at,
      affected_users: incident.metadata?.affected_users_count,
      data_types: incident.metadata?.exposed_data_types,
      containment_actions: incident.containment_actions,
      preventive_measures: incident.preventive_measures,
    };

    // Отправка команде Legal для подачи в орган
    await this.emailService.sendToLegal({
      subject: `[URGENT] Data Breach Report - ${incident.type}`,
      body: `72-hour deadline for authority notification.\n\nReport:\n${JSON.stringify(report, null, 2)}`,
    });
  }
}
```

## 10.6. Метрики инцидентов

```typescript
// src/security/services/incident-metrics.service.ts
@Injectable()
export class IncidentMetricsService {
  
  async getMetrics(period: { start: Date; end: Date }): Promise<IncidentMetrics> {
    const incidents = await this.incidentsRepository.find({
      where: { detected_at: Between(period.start, period.end) },
    });

    return {
      total: incidents.length,
      by_severity: {
        critical: incidents.filter(i => i.severity === 'CRITICAL').length,
        high: incidents.filter(i => i.severity === 'HIGH').length,
        medium: incidents.filter(i => i.severity === 'MEDIUM').length,
        low: incidents.filter(i => i.severity === 'LOW').length,
      },
      mttr: this.calculateMTTR(incidents), // Mean Time To Resolve
      mttd: this.calculateMTTD(incidents), // Mean Time To Detect
      escalation_rate: this.calculateEscalationRate(incidents),
      false_positive_rate: this.calculateFalsePositiveRate(incidents),
    };
  }

  private calculateMTTR(incidents: SecurityIncident[]): number {
    const resolved = incidents.filter(i => i.recovery_completed_at);
    if (resolved.length === 0) return 0;
    
    const times = resolved.map(i => 
      i.recovery_completed_at.getTime() - i.detected_at.getTime()
    );
    
    return times.reduce((a, b) => a + b, 0) / times.length / 1000 / 60; // минуты
  }
}
```

---

# Приложения

## A. Контакты для эскалации

| Роль | Имя | Email | Телефон | Slack |
|------|-----|-------|---------|-------|
| On-Call Engineer | - | oncall@selfstorage.com | - | @oncall |
| Security Lead | - | security-lead@selfstorage.com | - | @security-lead |
| DevOps Lead | - | devops-lead@selfstorage.com | - | @devops-lead |
| CTO | - | cto@selfstorage.com | - | @cto |
| CEO | - | ceo@selfstorage.com | - | @ceo |

## B. Внешние контакты

| Организация | Тип | Контакт |
|-------------|-----|---------|
| Роскомнадзор | Data Protection Authority | - |
| Let's Encrypt | SSL Certificates | https://letsencrypt.org |
| Cloudflare | CDN/DDoS Protection | https://cloudflare.com |

## C. Checklist безопасности для релиза

- [ ] npm audit пройден без high/critical
- [ ] Snyk scan пройден
- [ ] ESLint security rules пройдены
- [ ] Gitleaks scan пройден
- [ ] Все endpoints защищены аутентификацией
- [ ] Rate limiting настроен
- [ ] CORS настроен
- [ ] SSL сертификаты валидны
- [ ] Secrets в environment variables
- [ ] Бэкапы настроены и протестированы
- [ ] Мониторинг и алерты настроены
- [ ] Incident response plan актуален

---

**Конец документа**

Версия: 1.0  
Дата: 09 декабря 2025 г.  
Статус: Утверждено для реализации MVP
