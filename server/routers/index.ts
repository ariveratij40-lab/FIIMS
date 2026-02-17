import { router } from '../_core/trpc';
import { nodosRouter } from './nodos.router';
import { cambiosRouter } from './cambios.router';
import { etiquetasRouter } from './etiquetas.router';

export const appRouter = router({
  nodos: nodosRouter,
  cambios: cambiosRouter,
  etiquetas: etiquetasRouter,
});

export type AppRouter = typeof appRouter;
