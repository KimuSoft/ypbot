import { Collection, Entity, ManyToMany, PrimaryKey, Property } from '@mikro-orm/core'
import { Rule }                                                 from '@ypbot/database/src/entities/Rule.js'
import { EncryptedText }                                        from '@ypbot/database/src/types/EncryptedText.js'
import { UserFlags }                                            from 'ypbot-api-types'
import type { YPUser }                                          from 'ypbot-api-types'

@Entity({ tableName: 'users' })
export class User {
  @PrimaryKey({ type: 'varchar' })
    id!: string

  @Property()
    username!: string

  @Property()
    discriminator!: string

  @Property({ nullable: true, type: 'string' })
    avatar!: string | null

  @Property({ nullable: true, type: 'string' })
    banner!: string | null

  @Property({ nullable: true })
    accentColor?: number

  @Property({
    type: EncryptedText
  })
    discordAccessToken!: string

  @Property({
    type: EncryptedText
  })
    discordRefreshToken!: string

  @Property()
    discordTokenExpiresAt!: Date

  @Property({ default: 0, type: 'int' })
    flags!: UserFlags

  @ManyToMany(() => Rule, (r) => r.authors)
    rules = new Collection<Rule>(this)

  get avatarURL (): string {
    if (this.avatar === null) return `https://cdn.discordapp.com/embed/avatars/${+this.discriminator % 4}.png`

    return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.${
      this.avatar.startsWith('a_') ? 'gif' : 'webp'
    }?size=512`
  }

  get bannerURL (): string | null {
    if (this.banner === null) return null

    return `https://cdn.discordapp.com/banners/${this.id}/${this.banner}.${
      this.banner.startsWith('a_') ? 'gif' : 'webp'
    }?size=4096`
  }

  get tag (): string {
    return `${this.username}#${this.discriminator}`
  }

  toJSON (): YPUser {
    return {
      id: this.id,
      username: this.username,
      discriminator: this.discriminator,
      avatar: this.avatarURL,
      tag: this.tag,
      flags: this.flags,
      banner: this.bannerURL,
      accentColor: this.accentColor ?? null
    }
  }
}
