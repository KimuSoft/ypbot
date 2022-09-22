import { Column, Entity, PrimaryColumn } from 'typeorm'
import { EncryptionTransformer } from 'typeorm-encrypted'

import { dbSecret } from '../constants.js'

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

  @Column()
  discordTokenExpiresAt!: Date
}
