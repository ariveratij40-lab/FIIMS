import { router, protectedProcedure, adminProcedure } from '../_core/trpc';
import { db } from '../db';
import { nodos, cambios_nodos } from '../../drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { CreateNodoSchema, UpdateNodoSchema } from '../../shared/types';
import { generateNodoCode, generateEPC } from '../_core/rfid';
import { TRPCError } from '@trpc/server';

export const nodosRouter = router({
  // Listar todos los nodos del tenant
  list: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.tenantId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Tenant ID is required',
      });
    }

    const result = await db.query.nodos.findMany({
      where: eq(nodos.tenant_id, ctx.tenantId),
    });

    return result;
  }),

  // Obtener un nodo específico
  get: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.tenantId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Tenant ID is required',
        });
      }

      const nodo = await db.query.nodos.findFirst({
        where: and(eq(nodos.id, input.id), eq(nodos.tenant_id, ctx.tenantId)),
      });

      if (!nodo) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Nodo not found',
        });
      }

      return nodo;
    }),

  // Crear un nuevo nodo
  create: protectedProcedure
    .input(CreateNodoSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.tenantId || !ctx.userId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Tenant ID and User ID are required',
        });
      }

      const codigo_unico = generateNodoCode('SITIO-001');

      const [nodo] = await db
        .insert(nodos)
        .values({
          codigo_unico,
          categoria: input.categoria,
          color_cable: input.color_cable,
          integrador: input.integrador,
          ubicacion_area: input.ubicacion_area,
          ubicacion_faceplate: input.ubicacion_faceplate,
          foto_url: input.foto_url,
          tecnico_id: ctx.userId,
          tenant_id: ctx.tenantId,
          estado: 'activo',
        })
        .returning();

      // Registrar el cambio
      await db.insert(cambios_nodos).values({
        nodo_id: nodo.id,
        tipo_cambio: 'creacion',
        datos_nuevos: nodo,
        tecnico_id: ctx.userId,
        tenant_id: ctx.tenantId,
      });

      return nodo;
    }),

  // Actualizar un nodo
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        data: UpdateNodoSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.tenantId || !ctx.userId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Tenant ID and User ID are required',
        });
      }

      const nodoAnterior = await db.query.nodos.findFirst({
        where: and(eq(nodos.id, input.id), eq(nodos.tenant_id, ctx.tenantId)),
      });

      if (!nodoAnterior) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Nodo not found',
        });
      }

      const [nodoActualizado] = await db
        .update(nodos)
        .set(input.data)
        .where(eq(nodos.id, input.id))
        .returning();

      // Registrar el cambio
      await db.insert(cambios_nodos).values({
        nodo_id: nodoActualizado.id,
        tipo_cambio: 'actualizacion',
        datos_anteriores: nodoAnterior,
        datos_nuevos: nodoActualizado,
        tecnico_id: ctx.userId,
        tenant_id: ctx.tenantId,
      });

      return nodoActualizado;
    }),

  // Eliminar un nodo (solo admin)
  delete: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.tenantId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Tenant ID is required',
        });
      }

      const nodo = await db.query.nodos.findFirst({
        where: and(eq(nodos.id, input.id), eq(nodos.tenant_id, ctx.tenantId)),
      });

      if (!nodo) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Nodo not found',
        });
      }

      await db.delete(nodos).where(eq(nodos.id, input.id));

      return { success: true };
    }),

  // Buscar por código único
  findByCode: protectedProcedure
    .input(z.object({ codigo_unico: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.tenantId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Tenant ID is required',
        });
      }

      const nodo = await db.query.nodos.findFirst({
        where: and(
          eq(nodos.codigo_unico, input.codigo_unico),
          eq(nodos.tenant_id, ctx.tenantId)
        ),
      });

      return nodo || null;
    }),
});
