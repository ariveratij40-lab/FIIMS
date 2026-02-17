import { relations } from 'drizzle-orm';
import { nodos, cambios_nodos, etiquetas_rfid, usuarios, tenants } from './schema';

export const nodosRelations = relations(nodos, ({ many, one }) => ({
  cambios: many(cambios_nodos),
  etiquetas: many(etiquetas_rfid),
  tenant: one(tenants, {
    fields: [nodos.tenant_id],
    references: [tenants.id],
  }),
  tecnico: one(usuarios, {
    fields: [nodos.tecnico_id],
    references: [usuarios.id],
  }),
}));

export const cambiosRelations = relations(cambios_nodos, ({ one }) => ({
  nodo: one(nodos, {
    fields: [cambios_nodos.nodo_id],
    references: [nodos.id],
  }),
  tenant: one(tenants, {
    fields: [cambios_nodos.tenant_id],
    references: [tenants.id],
  }),
  tecnico: one(usuarios, {
    fields: [cambios_nodos.tecnico_id],
    references: [usuarios.id],
  }),
}));

export const etiquetasRelations = relations(etiquetas_rfid, ({ one }) => ({
  nodo: one(nodos, {
    fields: [etiquetas_rfid.nodo_id],
    references: [nodos.id],
  }),
  tenant: one(tenants, {
    fields: [etiquetas_rfid.tenant_id],
    references: [tenants.id],
  }),
}));

export const usuariosRelations = relations(usuarios, ({ many, one }) => ({
  nodos: many(nodos),
  cambios: many(cambios_nodos),
  tenant: one(tenants, {
    fields: [usuarios.tenant_id],
    references: [tenants.id],
  }),
}));

export const tenantsRelations = relations(tenants, ({ many }) => ({
  usuarios: many(usuarios),
  nodos: many(nodos),
  cambios: many(cambios_nodos),
  etiquetas: many(etiquetas_rfid),
}));
