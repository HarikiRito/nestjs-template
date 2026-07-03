'use strict'

const path = require('node:path')

async function main() {
  const { MikroORM } = require('@mikro-orm/core')
  const { Migrator } = require('@mikro-orm/migrations')
  const { PostgreSqlDriver } = require('@mikro-orm/postgresql')

  const schema = process.env.DATABASE_SCHEMA
  if (!schema) {
    console.error('DATABASE_SCHEMA env var is required')
    process.exit(1)
  }
  console.log(`Using schema: "${schema}"`)

  const orm = await MikroORM.init({
    driver: PostgreSqlDriver,
    clientUrl: process.env.DATABASE_URI,
    schema: schema,
    driverOptions: {
      options: `-c search_path=${schema}`,
    },
    migrations: {
      path: path.join(__dirname, '../dist/src/database/migrations'),
      glob: '!(*.d).js',
      allOrNothing: false,
      transactional: true,
      disableForeignKeys: false,
    },
    extensions: [Migrator],
    discovery: { warnWhenNoEntities: false },
  })

  const conn = orm.em.getConnection()

  try {
    if (schema !== 'public') {
      await conn.execute(`CREATE SCHEMA IF NOT EXISTS "${schema}"`)
      console.log(`Schema "${schema}" ensured.`)
    }

    // Detect orphaned state: tables exist but no migration records
    const orphaned = await conn.execute(`
      SELECT COUNT(*) AS table_count
      FROM information_schema.tables
      WHERE table_schema = '${schema}'
        AND table_name != 'mikro_orm_migrations'
    `)
    const tableCount = parseInt(orphaned[0].table_count, 10)

    if (tableCount > 0) {
      const tracked = await conn
        .execute(`
        SELECT COUNT(*) AS record_count
        FROM "${schema}"."mikro_orm_migrations"
      `)
        .catch(() => [{ record_count: 0 }])
      const recordCount = parseInt(tracked[0].record_count, 10)

      if (recordCount === 0) {
        console.log(
          `Detected ${tableCount} orphaned table(s) with no migration records. Resetting schema...`,
        )
        await conn.execute(`DROP SCHEMA "${schema}" CASCADE`)
        await conn.execute(`CREATE SCHEMA "${schema}"`)
        console.log(`Schema "${schema}" reset.`)
      }
    }

    const pending = await orm.migrator.getPending()
    if (pending.length === 0) {
      console.log('No pending migrations.')
      return
    }
    console.log(`Running ${pending.length} pending migration(s)...`)
    await orm.migrator.up()
    console.log('Migrations complete.')
  } finally {
    await orm.close(true)
  }
}

main().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
