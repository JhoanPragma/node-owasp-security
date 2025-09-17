# 🛡️ Node OWASP Security

Un middleware de seguridad para Express.js(Node.js) que aplica de manera transversal las recomendaciones de seguridad de OWASP Top 10
Incluye validaciones, middlewares y headers de seguridad listos para usar: HSTS, CSP, validación de payloads, SSRF protection, rate limiting, correlation IDs, métricas, etc.

## Características

✅ Middlewares de seguridad automáticos:
    - Correlation IDs (X-Correlation-Id) para trazabilidad.
    - Validación de payloads JSON contra JSON Schemas.
    - Protección contra SSRF (validación de hosts permitidos).
✅ Headers de seguridad con Helmet: HSTS, CSP, X-Frame-Options.
✅ Rate limiting con rate-limiter-flexible.
✅ Métricas de seguridad con Prometheus client
✅ Compatible con Node.js 18+.
✅ Integración automática en proyectos Express.js.


## 📦 Instalación

### 1. Configurar GitHub Packages

En la raíz de tu proyecto crea un .npmrc:

`@jhoanpragma:registry=https://npm.pkg.github.com`
`//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}`

`npm install @pragma/node-owasp-security`


### ⚙️ Configuración básica

En tu API Express, activa el middleware:

const express = require("express");
const security = require("@pragma/node-owasp-security");

const app = express();

// Middleware de seguridad (usa config por defecto o personalizada)
app.use(security({
  csp: "default-src 'self'",
  hsts: true,
  rateLimit: { points: 200, duration: 60 }, // 200 req/min
  ssrfAllowedHosts: ["api.pragma.com", "auth.pragma.com"]
}));

app.get("/api/test", (req, res) => {
  res.json({ message: "OK con seguridad OWASP ✅" });
});

app.listen(3000, () => console.log("Servidor en puerto 3000"));


### 📝 Ejemplos de uso


1. Correlation ID automático

Cada request incluye un header X-Correlation-Id.
Este ID se puede loguear:

`[INFO] Request 123e4567-e89b-12d3-a456-426614174000 GET /api/users`

2. Validación de payloads JSON

Define tus JSON Schemas en tu proyecto y pásalos al middleware:
const schema = {
  type: "object",
  properties: {
    username: { type: "string" },
    age: { type: "integer", minimum: 18 }
  },
  required: ["username", "age"]
};

app.post("/api/users", security.validatePayload(schema), (req, res) => {
  res.json({ user: req.body });
});

👉 Si el request no cumple con el schema → retorna 400 Bad Request.

3. Protección contra SSRF

Uso del cliente HTTP seguro:

const { safeFetch } = require("@jhoanpragma/node-owasp-security");

(async () => {
  // ✅ permitido
  await safeFetch("https://api.pragma.com/data", ["api.pragma.com"]);

  // ❌ bloqueado
  await safeFetch("http://malicious.com", ["api.pragma.com"]);
})();

4. Métricas de seguridad

El paquete expone métricas en formato Prometheus:
const { metrics } = require("@jhoanpragma/node-owasp-security");

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", metrics.contentType);
  res.end(await metrics.metrics());
});

Incluye contadores como:

    security_payload_invalid_count → requests rechazados por payload inválido.

    security_ratelimit_blocked_count → requests bloqueados por rate limiting.

## 📖 Configuración avanzada

Parámetros del middleware principal:

| Propiedad          | Descripción                                            |
| ------------------ | ------------------------------------------------------ |
| `enabled`          | Habilita/deshabilita toda la librería de seguridad.    |
| `csp`              | Configuración de Content Security Policy.              |
| `hsts`             | Activa HTTP Strict Transport Security.                 |
| `rateLimit`        | Configuración de rate limiting (`points`, `duration`). |
| `ssrfAllowedHosts` | Lista de hosts permitidos para prevenir SSRF.          |

### 📦 Publicación

Este paquete se publica en GitHub Packages en:
👉 https://github.com/JhoanPragma/node-owasp-security/packages