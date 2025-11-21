import { Migration } from '@mikro-orm/migrations';

export class Migration20251121083241 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "todos" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "completed" boolean not null default false, "description" text null, "title" varchar(255) not null);`);
  }

}
