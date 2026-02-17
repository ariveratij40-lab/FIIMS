-- Script de inicialización de base de datos para FIIMS Fase 1
-- Este script se ejecuta automáticamente cuando se crea el contenedor PostgreSQL

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Crear esquema
CREATE SCHEMA IF NOT EXISTS fiims;

-- Comentarios
COMMENT ON SCHEMA fiims IS 'Esquema principal para FIIMS - Gestión de Infraestructura Física';

-- Crear tipos de datos
CREATE TYPE fiims.categoria_cable AS ENUM ('Cat5e', 'Cat6', 'Cat6a', 'OM3', 'OM4', 'OS2');
CREATE TYPE fiims.estado_nodo AS ENUM ('activo', 'libre', 'reservado', 'defectuoso');
CREATE TYPE fiims.rol_usuario AS ENUM ('tecnico', 'admin', 'super_admin');
CREATE TYPE fiims.tipo_cambio AS ENUM ('creacion', 'actualizacion', 'escaneo');

-- Crear tablas (serán creadas por Drizzle, pero dejamos comentarios)
COMMENT ON TYPE fiims.categoria_cable IS 'Categoría de cable de cableado estructurado';
COMMENT ON TYPE fiims.estado_nodo IS 'Estado del nodo en el sistema';
COMMENT ON TYPE fiims.rol_usuario IS 'Rol del usuario en el sistema';
COMMENT ON TYPE fiims.tipo_cambio IS 'Tipo de cambio registrado en auditoría';

-- Crear índices para búsquedas rápidas (serán creados por Drizzle)
-- CREATE INDEX idx_nodos_codigo_unico ON fiims.nodos(codigo_unico);
-- CREATE INDEX idx_nodos_tenant_id ON fiims.nodos(tenant_id);
-- CREATE INDEX idx_cambios_nodo_id ON fiims.cambios_nodos(nodo_id);
-- CREATE INDEX idx_cambios_tenant_id ON fiims.cambios_nodos(tenant_id);

-- Crear vista para estadísticas
CREATE OR REPLACE VIEW fiims.estadisticas_nodos AS
SELECT 
    t.id as tenant_id,
    t.nombre as tenant_nombre,
    COUNT(n.id) as total_nodos,
    COUNT(CASE WHEN n.estado = 'activo' THEN 1 END) as nodos_activos,
    COUNT(CASE WHEN n.estado = 'libre' THEN 1 END) as nodos_libres,
    COUNT(CASE WHEN n.estado = 'reservado' THEN 1 END) as nodos_reservados,
    COUNT(CASE WHEN n.estado = 'defectuoso' THEN 1 END) as nodos_defectuosos
FROM fiims.tenants t
LEFT JOIN fiims.nodos n ON t.id = n.tenant_id
GROUP BY t.id, t.nombre;

COMMENT ON VIEW fiims.estadisticas_nodos IS 'Vista de estadísticas de nodos por tenant';

-- Crear vista para auditoría
CREATE OR REPLACE VIEW fiims.auditoria_cambios AS
SELECT 
    c.id,
    c.nodo_id,
    n.codigo_unico,
    c.tipo_cambio,
    c.fecha_cambio,
    u.nombre as tecnico_nombre,
    u.email as tecnico_email,
    c.sincronizado
FROM fiims.cambios_nodos c
LEFT JOIN fiims.nodos n ON c.nodo_id = n.id
LEFT JOIN fiims.usuarios u ON c.tecnico_id = u.id
ORDER BY c.fecha_cambio DESC;

COMMENT ON VIEW fiims.auditoria_cambios IS 'Vista de auditoría de cambios realizados';

-- Crear función para actualizar timestamp
CREATE OR REPLACE FUNCTION fiims.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION fiims.update_timestamp() IS 'Función para actualizar automáticamente el timestamp de actualización';

-- Crear función para registrar cambios
CREATE OR REPLACE FUNCTION fiims.registrar_cambio_nodo()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO fiims.cambios_nodos (
            nodo_id,
            tipo_cambio,
            datos_nuevos,
            tenant_id,
            fecha_cambio,
            sincronizado
        ) VALUES (
            NEW.id,
            'creacion'::fiims.tipo_cambio,
            row_to_json(NEW),
            NEW.tenant_id,
            NOW(),
            false
        );
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO fiims.cambios_nodos (
            nodo_id,
            tipo_cambio,
            datos_anteriores,
            datos_nuevos,
            tenant_id,
            fecha_cambio,
            sincronizado
        ) VALUES (
            NEW.id,
            'actualizacion'::fiims.tipo_cambio,
            row_to_json(OLD),
            row_to_json(NEW),
            NEW.tenant_id,
            NOW(),
            false
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION fiims.registrar_cambio_nodo() IS 'Función para registrar automáticamente cambios en nodos';

-- Crear trigger para auditoría (será creado después que Drizzle cree las tablas)
-- CREATE TRIGGER trigger_registrar_cambio_nodo
-- AFTER INSERT OR UPDATE ON fiims.nodos
-- FOR EACH ROW
-- EXECUTE FUNCTION fiims.registrar_cambio_nodo();

-- Crear índices de búsqueda de texto completo (opcional)
-- CREATE INDEX idx_nodos_search ON fiims.nodos USING gin(to_tsvector('spanish', codigo_unico || ' ' || integrador));

-- Establecer permisos (opcional)
-- GRANT USAGE ON SCHEMA fiims TO fiims_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA fiims TO fiims_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA fiims TO fiims_user;

-- Crear tabla de logs de sistema (opcional)
CREATE TABLE IF NOT EXISTS fiims.system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nivel VARCHAR(20) NOT NULL,
    mensaje TEXT NOT NULL,
    contexto JSONB,
    fecha_creacion TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_system_logs_fecha ON fiims.system_logs(fecha_creacion DESC);
CREATE INDEX idx_system_logs_nivel ON fiims.system_logs(nivel);

COMMENT ON TABLE fiims.system_logs IS 'Tabla para registrar logs del sistema';

-- Insertar log de inicialización
INSERT INTO fiims.system_logs (nivel, mensaje, contexto)
VALUES ('INFO', 'Base de datos inicializada', '{"version": "1.0.0", "timestamp": "' || NOW() || '"}');

-- Mostrar información
SELECT 'Base de datos FIIMS inicializada correctamente' as mensaje;
