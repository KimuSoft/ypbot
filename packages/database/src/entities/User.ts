import { Column, Entity, PrimaryColumn } from 'typeorm'
import { EncryptionTransformer } from 'typeorm-encrypted'

import { dbSecret } from '../constants.js'
import { UserFlags } from '../flags/UserFlags.js'

@Entity({ name: 'users' })
export class User {
  @PrimaryColumn()
  id!: string

  @Column()
  username!: string

  @Column()
  discriminator!: string

  @Column({ nullable: true })
  avatar?: string

  @Column({ nullable: true })
  banner?: string

  @Column({ nullable: true })
  accentColor?: number

  @Column({
    type: 'varchar',
    nullable: false,
    transformer: new EncryptionTransformer({
      algorithm: 'aes-256-gcm',
      ivLength: 10,
      key: dbSecret,
    }),
  })
  discordAccessToken!: string

  @Column({
    type: 'varchar',
    nullable: false,
    transformer: new EncryptionTransformer({
      algorithm: 'aes-256-gcm',
      ivLength: 10,
      key: dbSecret,
    }),
  })
  discordRefreshToken!: string

  @Column({ select: false })
  discordTokenExpiresAt!: Date

  @Column({ default: 0, type: 'int' })
  flags!: UserFlags

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
