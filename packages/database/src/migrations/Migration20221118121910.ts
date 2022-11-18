import { Migration } from '@mikro-orm/migrations'

export class Migration20221118121910 extends Migration {
  async up (): Promise<void> {
    this.addSql('create extension pgcrypto;')

    this.addSql('create table "guilds" ("id" varchar(255) not null, constraint "guilds_pkey" primary key ("id"));')

    this.addSql('create table "channels" ("id" varchar(255) not null, "guild_id" varchar(255) not null, constraint "channels_pkey" primary key ("id"));')

    this.addSql('create table "rules" ("id" serial primary key, "name" varchar(255) not null, "brief" varchar(255) not null, "description" text not null, "visibility" smallint not null default 1);')

    this.addSql('create table "ruleElements" ("id" serial primary key, "name" varchar(255) not null, "advanced" boolean not null, "keyword" varchar(255) not null, "rule_id" int not null);')

    this.addSql('create table "rules_channels" ("rule_id" int not null, "channel_id" varchar(255) not null, constraint "rules_channels_pkey" primary key ("rule_id", "channel_id"));')

    this.addSql('create table "users" ("id" varchar(255) not null, "username" varchar(255) not null, "discriminator" varchar(255) not null, "avatar" varchar(255) null, "banner" varchar(255) null, "accent_color" int null, "discord_access_token" bytea not null, "discord_refresh_token" bytea not null, "discord_token_expires_at" timestamptz(0) not null, "flags" int not null default 0, constraint "users_pkey" primary key ("id"));')

    this.addSql('create table "rules_authors" ("rule_id" int not null, "user_id" varchar(255) not null, constraint "rules_authors_pkey" primary key ("rule_id", "user_id"));')

    this.addSql('alter table "channels" add constraint "channels_guild_id_foreign" foreign key ("guild_id") references "guilds" ("id") on update cascade;')

    this.addSql('alter table "ruleElements" add constraint "ruleElements_rule_id_foreign" foreign key ("rule_id") references "rules" ("id") on update cascade;')

    this.addSql('alter table "rules_channels" add constraint "rules_channels_rule_id_foreign" foreign key ("rule_id") references "rules" ("id") on update cascade on delete cascade;')
    this.addSql('alter table "rules_channels" add constraint "rules_channels_channel_id_foreign" foreign key ("channel_id") references "channels" ("id") on update cascade on delete cascade;')

    this.addSql('alter table "rules_authors" add constraint "rules_authors_rule_id_foreign" foreign key ("rule_id") references "rules" ("id") on update cascade on delete cascade;')
    this.addSql('alter table "rules_authors" add constraint "rules_authors_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;')
  }

  async down (): Promise<void> {
    this.addSql('alter table "channels" drop constraint "channels_guild_id_foreign";')

    this.addSql('alter table "rules_channels" drop constraint "rules_channels_channel_id_foreign";')

    this.addSql('alter table "ruleElements" drop constraint "ruleElements_rule_id_foreign";')

    this.addSql('alter table "rules_channels" drop constraint "rules_channels_rule_id_foreign";')

    this.addSql('alter table "rules_authors" drop constraint "rules_authors_rule_id_foreign";')

    this.addSql('alter table "rules_authors" drop constraint "rules_authors_user_id_foreign";')

    this.addSql('drop table if exists "guilds" cascade;')

    this.addSql('drop table if exists "channels" cascade;')

    this.addSql('drop table if exists "rules" cascade;')

    this.addSql('drop table if exists "ruleElements" cascade;')

    this.addSql('drop table if exists "rules_channels" cascade;')

    this.addSql('drop table if exists "users" cascade;')

    this.addSql('drop table if exists "rules_authors" cascade;')

    this.addSql('drop extension pgcrypto;')
  }
}
