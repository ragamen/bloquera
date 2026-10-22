# Memoria del proyecto — Manejador de Costos (Bloquera)

App en React 19 + Vite 8 para calcular el costo de producción de bloques de
cemento (tipo "12 de 3 huecos", 12×20×40 cm) hechos a mano o con bloqueadora.
Aptitudes del usuario: habla español, despliega en servidor propio.
Todo el texto visible de la app está en español (es-EC, precios en dólares).

## Estado (última revisión: 2026-10-21)

- App evolucionada a Mini-ERP industrial y CRM con previsión comercial para bloquera y fábrica de prefabricados rurales:
  1) Pestañas de gestión: Jornada de Hoy, Cola de Pedidos & MRP, Bodega & Materia Prima, Ventas & Clientes (CRM), Proveedores & Pedidos, Goodwill & Previsión, Catálogo & Recetas, Historial de Producción.
  2) Cola de Pedidos & Planificación MRP: Al tomar un pedido, se evalúa si hay existencia suficiente en patio. Si hay stock, permite despachar de inmediato; si no alcanza o se programa para entrega futura, entra a la Cola de Pedidos y calcula los sacos de cemento, m³ de arena y arrocillo necesarios para fabricar toda la cola contra el inventario de bodega.
  3) Goodwill & Previsión de Necesidades: Análisis de recurrencia y lealtad por cliente (frecuencia de compra, volumen y puntualidad). Alertas predictivas que anticipan la fecha estimada del próximo pedido para tener prefabricados listos antes de que el cliente llame.
  4) Proveedores con CRUD completo: Crear, editar (nombre, material, teléfono, precio de referencia, unidad, nota) y eliminar proveedores, con enlaces directos a WhatsApp y llamada.
  5) Multi-producto en catálogo: Bloque 12 (12×20×40), Bloque 14 (14×20×40), Estantillos para cercas (2.0 m) y Esquineros reforzados para potreros, con recetas independientes y rendimientos calibrables por saco.
- Lint y build OK (0 errores, 0 advertencias), `dist/` regenerado. NO es repo git (sin inicializar); nunca pidió commits.

## Comandos

```bash
npm install --legacy-peer-deps   # OBLIGATORIO: bug de peer deps en npm 10 sin este flag
npm run dev                      # http://localhost:5173
npm run build                    # genera dist/
npm run preview                  # probar el build
npm run lint                     # oxlint (linter del proyecto, NO eslint)
```

## Arquitectura

Todo en `src/App.jsx` + `src/index.css`.

- **Claves de localStorage** (respetadas y compatibles):
  - `bloquera-config-v1` — fórmula general, precios unitarios, umbrales de alerta
  - `bloquera-historial-v1` — registros de jornadas concluidas
  - `bloquera-estado-v1` — bodega: invSacos, invArena, invArrocillo, invBloques y desglose `invPorProducto`
  - `bloquera-dia-v1` — jornada en curso: productoId, sacosPlan, sacosReal, bloquesReal, roturas, otras, nota
  - `bloquera-pedidos-v1` (NUEVA) — cola de pedidos con evaluación de stock, prioridad, fechas y avance
  - `bloquera-proveedores-v1` — lista de proveedores con contacto, material y precio pactado (CRUD completo)
  - `bloquera-clientes-v1` — directorio de clientes y obras
  - `bloquera-productos-v1` — catálogo de prefabricados (Bloques, Estantillos, Esquineros)
  - `bloquera-ventas-v1` — historial de despachos y estado de cobranza
- Datos SOLO en el navegador (localStorage); sin backend.

## Convenciones

- Español en UI y nombres de funciones (ej. `registrarCierreJornada`, `ejecutarCompra`, `crearOPonerEnColaPedido`).
- Sin comentarios en el código; sin emojis.
- Linter: oxlint (`.oxlintrc.json`, plugins react + oxc).
- Despliegue: `Dockerfile` (node:20-alpine → nginx:1.27-alpine) + `nginx.conf` (SPA fallback).
