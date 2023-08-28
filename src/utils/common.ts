import Sonyflake, { Epoch } from 'sonyflake'

export const snowflake = new Sonyflake({
  machineId: 1,
  epoch: Epoch.DISCORD, // timestamp
})
