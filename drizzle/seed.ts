import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { tenants, usuarios } from './schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function seed() {
  console.log('🌱 Iniciando seed de datos...');

  try {
    // Crear tenant de ejemplo
    const [tenant] = await db
      .insert(tenants)
      .values({
        nombre: 'Empresa Demo',
        descripcion: 'Empresa de ejemplo para FIIMS Fase 1',
        activo: true,
      })
      .returning();

    console.log('✅ Tenant creado:', tenant.id);

    // Crear usuarios de ejemplo
    const [adminUser] = await db
      .insert(usuarios)
      .values({
        email: 'admin@fiims.local',
        nombre: 'Administrador',
        rol: 'admin',
        tenant_id: tenant.id,
        activo: true,
      })
      .returning();

    console.log('✅ Usuario admin creado:', adminUser.id);

    const [tecnicoUser] = await db
      .insert(usuarios)
      .values({
        email: 'tecnico@fiims.local',
        nombre: 'Técnico de Campo',
        rol: 'tecnico',
        tenant_id: tenant.id,
        activo: true,
      })
      .returning();

    console.log('✅ Usuario técnico creado:', tecnicoUser.id);

    console.log('✨ Seed completado exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante seed:', error);
    process.exit(1);
  }
}

seed();
