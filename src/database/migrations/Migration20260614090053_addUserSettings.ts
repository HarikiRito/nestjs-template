import { Migration } from '@mikro-orm/migrations'

export class Migration20260614090053_addUserSettings extends Migration {
  override up(): void | Promise<void> {
    this.addSql(`alter table "users" add "settings" jsonb null;`)
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "users" drop column "settings";`)
  }
}
