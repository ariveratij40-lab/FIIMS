import { router, protectedProcedure } from '../_core/trpc';
import { db } from '../db';
import { etiquetas_rfid, nodos } from '../../drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { generateEPC, validateRfidCode } from '../_core/rfid';
import { TRPCError } from '@trpc/server';

export const etiquetasRouter = router({
  // Generar una nueva etiqueta RFID para un nodo
  generate: protectedProcedure
    .input(z.object({ nodo_id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.tenantId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Tenant ID is required',
        });
      }

      // Verificar que el nodo existe
      const nodo = await db.query.nodos.findFirst({
        where: and(eq(nodos.id, input.nodo_id), eq(nodos.tenant_id, ctx.tenantId)),
      });

      if (!nodo) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Nodo not found',
        });
      }

      // Generar código EPC
      const codigo_rfid = generateEPC(nodo.codigo_unico);

      // Crear etiqueta
      const [etiqueta] = await db
        .insert(etiquetas_rfid)
        .values({
          nodo_id: input.nodo_id,
          codigo_rfid,
          datos_etiqueta: {
            codigo_unico: nodo.codigo_unico,
            categoria: nodo.categoria,
            integrador: nodo.integrador,
            ubicacion: `${nodo.ubicacion_area} - ${nodo.ubicacion_faceplate}`,
            fecha_generacion: new Date().toISOString(),
          },
          tenant_id: ctx.tenantId,
        })
        .returning();

      return etiqueta;
    }),

  // Obtener etiqueta por código RFID
  getByCode: protectedProcedure
    .input(z.object({ codigo_rfid: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.tenantId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Tenant ID is required',
        });
      }

      if (!validateRfidCode(input.codigo_rfid)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid RFID code format',
        });
      }

      const etiqueta = await db.query.etiquetas_rfid.findFirst({
        where: and(
          eq(etiquetas_rfid.codigo_rfid, input.codigo_rfid),
          eq(etiquetas_rfid.tenant_id, ctx.tenantId)
        ),
      });

      return etiqueta || null;
    }),

  // Listar etiquetas de un nodo
  listByNodo: protectedProcedure
    .input(z.object({ nodo_id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.tenantId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Tenant ID is required',
        });
      }

      const etiquetas = await db.query.etiquetas_rfid.findMany({
        where: and(
          eq(etiquetas_rfid.nodo_id, input.nodo_id),
          eq(etiquetas_rfid.tenant_id, ctx.tenantId)
        ),
      });

      return etiquetas;
    }),

  // Marcar etiqueta como impresa
  markAsPrinted: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.tenantId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Tenant ID is required',
        });
      }

      const [etiqueta] = await db
        .update(etiquetas_rfid)
        .set({
          impresa: true,
          fecha_impresion: new Date(),
        })
        .where(
          and(eq(etiquetas_rfid.id, input.id), eq(etiquetas_rfid.tenant_id, ctx.tenantId))
        )
        .returning();

      return etiqueta;
    }),

  // Obtener etiquetas no impresas
  getUnprinted: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.tenantId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Tenant ID is required',
      });
    }

    const etiquetas = await db.query.etiquetas_rfid.findMany({
      where: and(
        eq(etiquetas_rfid.tenant_id, ctx.tenantId),
        eq(etiquetas_rfid.impresa, false)
      ),
    });

    return etiquetas;
  }),
});
