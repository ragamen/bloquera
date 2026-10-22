-- ==============================================================================
-- Schema: bloquera
-- Sistema ERP Bloquera & CRM de Prefabricados
-- Compatible con PostgREST y Supabase
-- ==============================================================================

CREATE SCHEMA IF NOT EXISTS bloquera;

-- Permisos para roles estándar de Supabase y PostgREST
GRANT USAGE ON SCHEMA bloquera TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA bloquera TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA bloquera TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA bloquera TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA bloquera GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA bloquera GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA bloquera GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

-- ------------------------------------------------------------------------------
-- 1. Tabla: configuracion
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bloquera.configuracion (
    id TEXT PRIMARY KEY DEFAULT 'general',
    tipo_bloque TEXT NOT NULL DEFAULT '12 de 3 huecos (12×20×40 cm)',
    formula JSONB NOT NULL DEFAULT '{
        "tobosArena": "5",
        "tobosArrocillo": "5",
        "tobosAgua": "1.125",
        "toboLitros": "20",
        "bloquesPorSaco": "60"
    }'::jsonb,
    precios JSONB NOT NULL DEFAULT '{
        "sacoCemento": "10",
        "arenaM3": "30",
        "arrocilloM3": "55"
    }'::jsonb,
    mano_obra_saco NUMERIC(10,2) NOT NULL DEFAULT 5.50,
    otros_saco NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    precio_venta NUMERIC(10,2) NOT NULL DEFAULT 0.65,
    umbrales JSONB NOT NULL DEFAULT '{
        "sacos": "15",
        "arena": "2.0",
        "arrocillo": "2.0"
    }'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. Tabla: productos (Catálogo de prefabricados con recetas)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bloquera.productos (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    categoria TEXT NOT NULL DEFAULT 'Bloques',
    rendimiento NUMERIC(10,2) NOT NULL DEFAULT 50.0,
    precio_venta NUMERIC(10,2) NOT NULL DEFAULT 0.65,
    tobos_arena NUMERIC(10,2) NOT NULL DEFAULT 5.0,
    tobos_arrocillo NUMERIC(10,2) NOT NULL DEFAULT 5.0,
    tobos_agua NUMERIC(10,3) NOT NULL DEFAULT 1.125,
    mano_obra_saco NUMERIC(10,2) NOT NULL DEFAULT 5.50,
    otros_saco NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. Tabla: inventario (Bodega central de materia prima y stock en patio)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bloquera.inventario (
    id TEXT PRIMARY KEY DEFAULT 'bodega_central',
    inv_sacos NUMERIC(12,3) NOT NULL DEFAULT 0,
    inv_arena NUMERIC(12,3) NOT NULL DEFAULT 0,
    inv_arrocillo NUMERIC(12,3) NOT NULL DEFAULT 0,
    inv_bloques NUMERIC(12,0) NOT NULL DEFAULT 0,
    inv_por_producto JSONB NOT NULL DEFAULT '{
        "b12": "0",
        "b14": "0",
        "estantillo": "0",
        "esquinero": "0"
    }'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. Tabla: proveedores
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bloquera.proveedores (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    material TEXT NOT NULL, -- cemento, arena, arrocillo, general
    contacto TEXT,
    precio_ref NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    unidad TEXT NOT NULL DEFAULT 'unidad',
    nota TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. Tabla: clientes
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bloquera.clientes (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    contacto TEXT,
    ubicacion TEXT,
    nota TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. Tabla: pedidos (Cola de pedidos y planificación MRP)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bloquera.pedidos (
    id TEXT PRIMARY KEY,
    fecha TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    cliente_id TEXT REFERENCES bloquera.clientes(id) ON DELETE SET NULL,
    cliente_nombre TEXT NOT NULL,
    producto_id TEXT REFERENCES bloquera.productos(id) ON DELETE RESTRICT,
    producto_nombre TEXT NOT NULL,
    cantidad NUMERIC(12,2) NOT NULL,
    precio_unitario NUMERIC(10,2) NOT NULL,
    total NUMERIC(12,2) NOT NULL,
    estado TEXT NOT NULL DEFAULT 'en_cola', -- en_cola, en_produccion, entregado, cancelado
    prioridad TEXT NOT NULL DEFAULT 'media', -- alta, media, baja
    fecha_entrega_estimada TIMESTAMPTZ,
    nota TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. Tabla: ventas (Historial de despachos comerciales)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bloquera.ventas (
    id TEXT PRIMARY KEY,
    fecha TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    cliente_id TEXT REFERENCES bloquera.clientes(id) ON DELETE SET NULL,
    cliente_nombre TEXT NOT NULL,
    producto_id TEXT REFERENCES bloquera.productos(id) ON DELETE RESTRICT,
    producto_nombre TEXT NOT NULL,
    cantidad NUMERIC(12,2) NOT NULL,
    precio_unitario NUMERIC(10,2) NOT NULL,
    total NUMERIC(12,2) NOT NULL,
    estado_pago TEXT NOT NULL DEFAULT 'pagado', -- pagado, pendiente
    nota TEXT,
    pedido_id TEXT REFERENCES bloquera.pedidos(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. Tabla: historial_produccion (Jornadas cerradas y rendimiento)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bloquera.historial_produccion (
    id TEXT PRIMARY KEY,
    fecha TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    producto_id TEXT REFERENCES bloquera.productos(id) ON DELETE SET NULL,
    producto_nombre TEXT NOT NULL,
    sacos_plan NUMERIC(10,2) NOT NULL DEFAULT 0,
    unidades_plan NUMERIC(10,0) NOT NULL DEFAULT 0,
    sacos NUMERIC(10,2) NOT NULL DEFAULT 0,
    bloques NUMERIC(10,0) NOT NULL DEFAULT 0,
    roturas NUMERIC(10,0) NOT NULL DEFAULT 0,
    otras NUMERIC(10,0) NOT NULL DEFAULT 0,
    costo_produccion NUMERIC(12,2) NOT NULL DEFAULT 0,
    perdidas_valor NUMERIC(12,2) NOT NULL DEFAULT 0,
    rend_real NUMERIC(10,2) NOT NULL DEFAULT 0,
    nota TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 9. Tabla: recepcion_compras (Entrada de materia prima a bodega)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bloquera.recepcion_compras (
    id TEXT PRIMARY KEY,
    fecha TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    proveedor_id TEXT REFERENCES bloquera.proveedores(id) ON DELETE SET NULL,
    sacos NUMERIC(10,2) NOT NULL DEFAULT 0,
    arena NUMERIC(10,2) NOT NULL DEFAULT 0,
    arrocillo NUMERIC(10,2) NOT NULL DEFAULT 0,
    costo_total NUMERIC(12,2) NOT NULL DEFAULT 0,
    nota TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 10. Tabla: lotes_curado (Maduración de prefabricados: 7 y 28 días ASTM)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bloquera.lotes_curado (
    id TEXT PRIMARY KEY,
    producto_id TEXT REFERENCES bloquera.productos(id) ON DELETE RESTRICT,
    producto_nombre TEXT NOT NULL,
    cantidad_inicial NUMERIC(12,0) NOT NULL,
    cantidad_disponible NUMERIC(12,0) NOT NULL,
    fecha_produccion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ultimo_riego TIMESTAMPTZ,
    nota TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- Políticas de Seguridad RLS (Row Level Security)
-- Habilitar acceso de lectura y escritura para PostgREST / anon / authenticated
-- ==============================================================================

ALTER TABLE bloquera.configuracion ENABLE ROW LEVEL SECURITY;
ALTER TABLE bloquera.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE bloquera.inventario ENABLE ROW LEVEL SECURITY;
ALTER TABLE bloquera.proveedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE bloquera.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bloquera.pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE bloquera.ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE bloquera.historial_produccion ENABLE ROW LEVEL SECURITY;
ALTER TABLE bloquera.recepcion_compras ENABLE ROW LEVEL SECURITY;
ALTER TABLE bloquera.lotes_curado ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir todo en configuracion" ON bloquera.configuracion FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo en productos" ON bloquera.productos FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo en inventario" ON bloquera.inventario FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo en proveedores" ON bloquera.proveedores FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo en clientes" ON bloquera.clientes FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo en pedidos" ON bloquera.pedidos FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo en ventas" ON bloquera.ventas FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo en historial_produccion" ON bloquera.historial_produccion FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo en recepcion_compras" ON bloquera.recepcion_compras FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo en lotes_curado" ON bloquera.lotes_curado FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);

-- ==============================================================================
-- Datos Iniciales (Seed Data)
-- ==============================================================================

-- Configuración inicial
INSERT INTO bloquera.configuracion (id, tipo_bloque, formula, precios, mano_obra_saco, otros_saco, precio_venta, umbrales)
VALUES (
    'general',
    '12 de 3 huecos (12×20×40 cm)',
    '{"tobosArena": "5", "tobosArrocillo": "5", "tobosAgua": "1.125", "toboLitros": "20", "bloquesPorSaco": "60"}'::jsonb,
    '{"sacoCemento": "10", "arenaM3": "30", "arrocilloM3": "55"}'::jsonb,
    5.50,
    0.00,
    0.65,
    '{"sacos": "15", "arena": "2.0", "arrocillo": "2.0"}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Catálogo de productos
INSERT INTO bloquera.productos (id, nombre, categoria, rendimiento, precio_venta, tobos_arena, tobos_arrocillo, tobos_agua, mano_obra_saco, otros_saco)
VALUES 
    ('b12', 'Bloque 12 (12×20×40 cm)', 'Bloques', 60.0, 0.65, 5.0, 5.0, 1.125, 5.50, 0.00),
    ('b14', 'Bloque 14 (14×20×40 cm)', 'Bloques', 48.0, 0.80, 5.0, 5.0, 1.125, 5.50, 0.00),
    ('estantillo', 'Estantillo para cerca (2.0 m)', 'Postes y Potreros', 7.0, 4.80, 4.0, 4.0, 1.000, 4.00, 0.50),
    ('esquinero', 'Esquinero reforzado para potrero', 'Postes y Potreros', 3.5, 9.50, 4.5, 4.5, 1.000, 4.50, 1.00)
ON CONFLICT (id) DO NOTHING;

-- Inventario inicial
INSERT INTO bloquera.inventario (id, inv_sacos, inv_arena, inv_arrocillo, inv_bloques, inv_por_producto)
VALUES (
    'bodega_central',
    25.0,
    4.5,
    3.8,
    350,
    '{"b12": "350", "b14": "120", "estantillo": "30", "esquinero": "15"}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Proveedores iniciales
INSERT INTO bloquera.proveedores (id, nombre, material, contacto, precio_ref, unidad, nota)
VALUES 
    ('prov-cemento', 'Distribuidora Cemento Unión', 'cemento', '0991234567', 10.00, 'saco 42.5 kg', 'Entrega en 24h a pie de patio'),
    ('prov-arena', 'Cantera San Pedro', 'arena', '0987654321', 30.00, 'm³ volqueta', 'Arena gruesa de río lavada'),
    ('prov-arrocillo', 'Agregados El Valle', 'arrocillo', '0995551234', 55.00, 'm³ volqueta', 'Piedra triturada 3/8 limpia')
ON CONFLICT (id) DO NOTHING;

-- Clientes iniciales
INSERT INTO bloquera.clientes (id, nombre, contacto, ubicacion, nota)
VALUES 
    ('cli-1', 'Constructora Andina', '0981112233', 'Obra Vía Perimetral Km 4', 'Pide despacho en camión de 1000 bloques'),
    ('cli-2', 'Hacienda La Fortuna (Don Manuel)', '0994443322', 'Sector San Gabriel - Finca El Bosque', 'Compra estantillos y esquineros para cerca cada 15 a 20 días'),
    ('cli-3', 'Maestro Carlos Mendoza', '0978889900', 'Taller y obras centro', 'Retiro directo en patio con camioneta')
ON CONFLICT (id) DO NOTHING;

-- Pedidos iniciales en cola
INSERT INTO bloquera.pedidos (id, fecha, cliente_id, cliente_nombre, producto_id, producto_nombre, cantidad, precio_unitario, total, estado, prioridad, fecha_entrega_estimada, nota)
VALUES 
    ('ped-1', NOW() - INTERVAL '2 days', 'cli-1', 'Constructora Andina', 'b14', 'Bloque 14 (14×20×40 cm)', 800, 0.80, 640.00, 'en_cola', 'alta', NOW() + INTERVAL '3 days', 'Para vaciado de muros obra Bellavista'),
    ('ped-2', NOW() - INTERVAL '1 day', 'cli-2', 'Hacienda La Fortuna (Don Manuel)', 'estantillo', 'Estantillo para cerca (2.0 m)', 80, 4.80, 384.00, 'en_cola', 'media', NOW() + INTERVAL '5 days', 'Cerca perimetral de potrero nuevo')
ON CONFLICT (id) DO NOTHING;
