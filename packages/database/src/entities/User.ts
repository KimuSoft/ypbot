import { Collection, Entity, ManyToMany, PrimaryKey, Property } from '@mikro-orm/core'

import { UserFlags } from '../flags/UserFlags.js'
import { EncryptedText } from '../types/EncryptedText.js'
import { Rule } from './Rule.js'

@Entity({ tableName: 'users' })
export class User {
  @PrimaryKey({ type: 'varchar' })
  id!: string

  @Property()
  username!: string

  @Property()
  discriminator!: string

  @Property({ nullable: true })
  avatar?: string

  @Property({ nullable: true })
  banner?: string

  @Property({ nullable: true })
  accentColor?: number

  @Property({
    type: EncryptedText,
  })
  discordAccessToken!: string

  @Property({
    type: EncryptedText,
  })
  discordRefreshToken!: string

  @Property()
  discordTokenExpiresAt!: Date

  @Property({ default: 0, type: 'int' })
  flags!: UserFlags

  @ManyToMany(() => Rule, (r) => r.authors)
  rules = new Collection<Rule>(this)

  get avatarURL() {
    if (!this.avatar) {
      return `https://cdn.discordapp.com/embed/avatars/${+this.discriminator % 4}.png`
    }
    return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.${
      this.avatar.startsWith('a_') ? 'gif' : 'webp'
    }?size=512`
  }

  get bannerURL() {
    if (!this.banner) {
      return null
    }
    return `https://cdn.discordapp.com/banners/${this.id}/${this.banner}.${
      this.banner.startsWith('a_') ? 'gif' : 'webp'
    }?size=4096`
  }

  get tag() {
    return `${this.username}#${this.discriminator}`
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      discriminator: this.discriminator,
      avatar: this.avatarURL,
      tag: this.tag,
      flags: this.flags,
      banner: this.bannerURL,
      accentColor: this.accentColor ?? null,
    }
  }
}
