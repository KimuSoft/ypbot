import { DataSource } from 'typeorm'

import { User } from './entities/User.js'

export { UserFlags } from './flags/UserFlags.js'

export const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.PG_DSN!,
  entities: [User],
  synchronize: true,
})

await dataSource.initialize()

export const UserRepo = dataSource.getRepository(User)

export { User }
