
import { pgTable, uuid, varchar, timestamp, jsonb, boolean } from 'drizzle-orm/pg-core';

// Tabla de Tenants (Empresas)
export const tenants = pgTable("tenants", {
  id: uuid("id").primaryKey().defaultRandom(),
  nombre: varchar("nombre", { length: 255 }).unique().notNull(),
  descripcion: varchar("descripcion", { length: 1000 }),
  logo_url: varchar("logo_url", { length: 500 }),
  activo: boolean("activo").default(true),
  fecha_creacion: timestamp("fecha_creacion").defaultNow(),
  fecha_actualizacion: timestamp("fecha_actualizacion").defaultNow().$onUpdate(() => new Date()),
});

// Tabla de Usuarios
export const usuarios = pgTable("usuarios", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 320 }).unique().notNull(),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  rol: varchar("rol", { length: 20 }).default("tecnico"), // tecnico, admin, super_admin
  tenant_id: uuid("tenant_id").notNull().references(() => tenants.id),
  activo: boolean("activo").default(true),
  fecha_creacion: timestamp("fecha_creacion").defaultNow(),
  fecha_actualizacion: timestamp("fecha_actualizacion").defaultNow().$onUpdate(() => new Date()),
});

// Tabla de Nodos
export const nodos = pgTable("nodos", {
  id: uuid("id").primaryKey().defaultRandom(),
  codigo_unico: varchar("codigo_unico", { length: 50 }).unique().notNull(),
  categoria: varchar("categoria", { length: 20 }).notNull(),
  color_cable: varchar("color_cable", { length: 30 }),
  integrador: varchar("integrador", { length: 100 }),
  ubicacion_area: varchar("ubicacion_area", { length: 100 }),
  ubicacion_faceplate: varchar("ubicacion_faceplate", { length: 50 }),
  foto_url: varchar("foto_url", { length: 500 }),
  estado: varchar("estado", { length: 20 }).default("activo"),
  tecnico_id: uuid("tecnico_id").references(() => usuarios.id),
  fecha_creacion: timestamp("fecha_creacion").defaultNow(),
  fecha_actualizacion: timestamp("fecha_actualizacion").defaultNow().$onUpdate(() => new Date()),
  datos_json: jsonb("datos_json"),
  tenant_id: uuid("tenant_id").notNull().references(() => tenants.id),
});

// Tabla de Cambios de Nodos
export const cambios_nodos = pgTable("cambios_nodos", {
  id: uuid("id").primaryKey().defaultRandom(),
  nodo_id: uuid("nodo_id").notNull().references(() => nodos.id, { onDelete: "cascade" }),
  tipo_cambio: varchar("tipo_cambio", { length: 50 }),
  datos_anteriores: jsonb("datos_anteriores"),
  datos_nuevos: jsonb("datos_nuevos"),
  tecnico_id: uuid("tecnico_id").references(() => usuarios.id),
  fecha_cambio: timestamp("fecha_cambio").defaultNow(),
  sincronizado: boolean("sincronizado").default(false),
  tenant_id: uuid("tenant_id").notNull().references(() => tenants.id),
});

// Tabla de Etiquetas RFID
export const etiquetas_rfid = pgTable("etiquetas_rfid", {
  id: uuid("id").primaryKey().defaultRandom(),
  nodo_id: uuid("nodo_id").notNull().references(() => nodos.id),
  codigo_rfid: varchar("codigo_rfid", { length: 100 }).unique().notNull(),
  datos_etiqueta: jsonb("datos_etiqueta"),
  fecha_generacion: timestamp("fecha_generacion").defaultNow(),
  impresa: boolean("impresa").default(false),
  fecha_impresion: timestamp("fecha_impresion"),
  tenant_id: uuid("tenant_id").notNull().references(() => tenants.id),
});
