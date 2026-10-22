# ERP Bloquera — Sistema de Gestión y Previsión Comercial

Mini-ERP y CRM comercial en React 19 + Vite 8 para bloqueras y fábricas de prefabricados rurales (bloques de cemento, estantillos y esquineros para potreros).

## Módulos y Funcionalidades

- **Jornada de Hoy:** Planificación matutina según el prefabricado seleccionado, verificación de existencias de materias primas con alertas de proveedores sugeridos y cierre de turno con recalibración automática de rendimiento por saco.
- **Cola de Pedidos & MRP:** Al ingresar un pedido evalúa existencias en patio para despacho inmediato o ingreso a cola de producción. Calcula los sacos de cemento, m³ de arena y arrocillo requeridos para cubrir todos los pedidos pendientes contra el inventario de bodega.
- **Goodwill & Previsión Comercial:** Índice de fidelidad por cliente y alertas predictivas que calculan la fecha estimada del próximo pedido según la frecuencia histórica de compras para tener stock listo con anticipación.
- **Bodega & Materia Prima:** Medidores visuales de existencias de cemento, arena y arrocillo con umbrales mínimos, valoración de stock en patio y registro de compras.
- **Ventas & Clientes (CRM):** Directorio de obras y clientes con balance de cartera, cuentas por cobrar e historial de despachos.
- **Proveedores & Abastecimiento:** CRUD completo para gestionar canteras y cementeras con precios pactados y enlaces directos a WhatsApp y llamada.
- **Catálogo & Recetas:** Configuración independiente de rendimiento por saco, dosificación de tobos y precios de venta para Bloque 12, Bloque 14, Estantillos y Esquineros, con opción de crear nuevos prefabricados.
- **Historial de Producción:** Auditoría de jornadas concluidas y control de mermas.

## Desarrollo

```bash
npm install --legacy-peer-deps
npm run dev                      # http://localhost:5173
```

## Compilar y verificar

```bash
npm run lint                     # oxlint
npm run build                    # genera dist/
npm run preview                  # prueba el build
```

## Despliegue con Docker

```bash
docker build -t bloquera-erp .
docker run -d --name bloquera-erp -p 80:80 --restart unless-stopped bloquera-erp
```
