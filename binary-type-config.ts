import { BinaryType } from './binary-type'

import Bool from './types/Boolean'

import UInt1 from './types/UInt1'
import UInt2 from './types/UInt2'
import UInt3 from './types/UInt3'
import UInt4 from './types/UInt4'
import UInt5 from './types/UInt5'
import UInt6 from './types/UInt6'
import UInt7 from './types/UInt7'
import UInt8 from './types/UInt8'
import UInt9 from './types/UInt9'
import UInt10 from './types/UInt10'
import UInt11 from './types/UInt11'
import UInt12 from './types/UInt12'
import UInt16 from './types/UInt16'
import UInt32 from './types/UInt32'

import Int2 from './types/Int2'
import Int4 from './types/Int4'
import Int6 from './types/Int6'
import Int8 from './types/Int8'
import Int10 from './types/Int10'
import Int16 from './types/Int16'
import Int32 from './types/Int32'

import Float32 from './types/Float32'
import Float64 from './types/Float64'

import Rotation8 from './types/Rotation8'
import RotationFloat32 from './types/RotationFloat32'
import RGB888 from './types/RGB888'
import ASCIIString from './types/ASCIIString'
import UTF8String from './types/UTF8String'

export const BinaryTypeConfig: {
  [binaryType: string]: {
    bits: number
    read: string | Function
    write: string | Function
    offset: number
    [key: string]: any
  }
} = {
  /* unsigned! 0 to n */
  // false or true
  [BinaryType.Boolean]: Bool,
  // 0 to 1
  [BinaryType.UInt1]: UInt1,
  // 0 to 3
  [BinaryType.UInt2]: UInt2,
  // 0 to 7
  [BinaryType.UInt3]: UInt3,
  // 0 to 15
  [BinaryType.UInt4]: UInt4,
  // 0 to 31
  [BinaryType.UInt5]: UInt5,
  // 0 to 63
  [BinaryType.UInt6]: UInt6,
  // 0 to 127
  [BinaryType.UInt7]: UInt7,
  // 0 to 255
  [BinaryType.UInt8]: UInt8,
  // 0 to 511
  [BinaryType.UInt9]: UInt9,
  // 0 to 1023
  [BinaryType.UInt10]: UInt10,
  // 0 to 2047
  [BinaryType.UInt11]: UInt11,
  // 0 to 4095
  [BinaryType.UInt12]: UInt12,
  // 0 to 65535
  [BinaryType.UInt16]: UInt16,
  // 0 to 4294967295
  [BinaryType.UInt32]: UInt32,

  /* signed! includes negative numbers */
  // -2 to 1
  [BinaryType.Int2]: Int2,
  // -8 to 7
  [BinaryType.Int4]: Int4,
  // -32 to 31
  [BinaryType.Int6]: Int6,
  // -128 to 127
  [BinaryType.Int8]: Int8,
  // -512 to 511
  [BinaryType.Int10]: Int10,
  // -32768 to 32767
  [BinaryType.Int16]: Int16,
  // -2147483648 to 2147483647
  [BinaryType.Int32]: Int32,

  [BinaryType.Float32]: Float32,

  [BinaryType.Float64]: Float64,

  // rotation in radians networked in one byte
  [BinaryType.Rotation8]: Rotation8,
  [BinaryType.RotationFloat32]: RotationFloat32,
  // an RGB color, with one byte for each component
  [BinaryType.RGB888]: RGB888,
  // String support, ASCIIStrings up to 255 characters
  [BinaryType.ASCIIString]: ASCIIString,
  // utf8 strings, potentially huge
  [BinaryType.UTF8String]: UTF8String,
}

export const countStringBits = (binaryType: BinaryType, value: string) => {
  const typeConfig = BinaryTypeConfig[binaryType]
  let bits = 0
  if (typeConfig.customBits && typeConfig.countBits) {
    bits += typeConfig.countBits(value) * value.length
  } else {
    bits += typeConfig.bits * value.length
  }
  return bits
}

export default BinaryTypeConfig
