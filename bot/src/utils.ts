import path from "path"
import { Logger } from "tslog"

export const logger = new Logger({
  dateTimeTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
})

export const sqlDir = path.join(__dirname, "..", "sql")
