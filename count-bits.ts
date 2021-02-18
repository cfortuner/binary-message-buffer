import BinaryTypeConfig from "./binary-type-config"
import { BinaryType } from "./binary-type"

export const countBits = (type: BinaryType, value: any) => {
  const typeConfig = BinaryTypeConfig[type]
  if (!typeConfig) {
    throw Error(`[countBits] No Binary type config found for type: ${type} .`)
  }

  if (typeConfig.countBits) {
    return typeConfig.countBits(value)
  } else {
    return typeConfig.bits
  }
}
