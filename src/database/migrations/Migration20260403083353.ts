import { Migration } from '@mikro-orm/migrations'

export class Migration20260403083353 extends Migration {
  override up(): void | Promise<void> {
    this.addSql(
      `create table "users" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "email" varchar(255) not null, "password" varchar(255) not null, "name" varchar(255) not null);`,
    )
    this.addSql(`alter table "users" add constraint "users_email_unique" unique ("email");`)
  }
}
