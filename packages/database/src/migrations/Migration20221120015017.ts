import { Migration } from '@mikro-orm/migrations'

export class Migration20221120015017 extends Migration {
  async up (): Promise<void> {
    this.addSql('alter table "ruleElements" add column "type" smallint not null;')
  }

  async down (): Promise<void> {
    this.addSql('alter table "ruleElements" drop column "type";')
  }
}
