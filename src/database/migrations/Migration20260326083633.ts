import { Migration } from '@mikro-orm/migrations'

export class Migration20260326083633 extends Migration {
  override up(): void | Promise<void> {
    this.addSql(
      `create table "todos" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "completed" boolean not null default false, "description" text null, "title" varchar(255) not null);`,
    )
  }
}
