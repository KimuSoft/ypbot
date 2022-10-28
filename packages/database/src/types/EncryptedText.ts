import { Type }     from '@mikro-orm/core'
import { dbSecret } from '@ypbot/database/src/constants.js'

export class EncryptedText extends Type<string, string> {
  getColumnType (): string {
    return 'bytea'
  }

  convertToDatabaseValue (value: string): string {
    return value
  }

  convertToJSValue (value: string): string {
    return value
  }

  convertToDatabaseValueSQL (key: string): string {
    return `encrypt(${key}, '${dbSecret}', 'aes')`
  }

  convertToJSValueSQL (key: string): string {
    return `convert_from(decrypt(${key}, '${dbSecret}', 'aes'), 'utf-8')`
  }
}
