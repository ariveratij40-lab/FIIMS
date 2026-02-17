import { router, protectedProcedure } from '../_core/trpc';
import { db } from '../db';
import { cambios_nodos } from '../../drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const cambiosRouter = router({
  // Listar cambios de un nodo
  listByNodo: protectedProcedure
    .input(z.object({ nodo_id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.tenantId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Tenant ID is required',
        });
      }

      const cambios = await db.query.cambios_nodos.findMany({
        where: and(
          eq(cambios_nodos.nodo_id, input.nodo_id),
          eq(cambios_nodos.tenant_id, ctx.tenantId)
        ),
        orderBy: (cambios_nodos, { desc }) => [desc(cambios_nodos.fecha_cambio)],
      });

      return cambios;
    }),

  // Listar todos los cambios del tenant
  listAll: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.tenantId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Tenant ID is required',
      });
    }

    const cambios = await db.query.cambios_nodos.findMany({
      where: eq(cambios_nodos.tenant_id, ctx.tenantId),
      orderBy: (cambios_nodos, { desc }) => [desc(cambios_nodos.fecha_cambio)],
    });

    return cambios;
  }),

  // Obtener cambios pendientes de sincronización
  getPendingSync: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.tenantId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Tenant ID is required',
      });
    }

    const cambios = await db.query.cambios_nodos.findMany({
      where: and(
        eq(cambios_nodos.tenant_id, ctx.tenantId),
        eq(cambios_nodos.sincronizado, false)
      ),
    });

    return cambios;
  }),

  // Marcar cambios como sincronizados
  markAsSynced: protectedProcedure
    .input(z.object({ ids: z.array(z.string().uuid()) }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.tenantId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Tenant ID is required',
        });
      }

      for (const id of input.ids) {
        await db
          .update(cambios_nodos)
          .set({ sincronizado: true })
          .where(
            and(eq(cambios_nodos.id, id), eq(cambios_nodos.tenant_id, ctx.tenantId))
          );
      }

      return { success: true };
    }),
});
