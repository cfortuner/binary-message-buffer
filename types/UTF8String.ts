import utf8 from 'utf8'
import { BinaryType } from '../binary-type'
import { BitStream } from '../bit-stream'

var boundsCheck = function (value: any) {
  return value.length <= 4294967295
}

var write = (bitStream: BitStream, value: any) => {
  var encoded = utf8.encode(value)

  bitStream.write(BinaryType.UInt32, encoded.length)

  for (var i = 0; i < encoded.length; i++) {
    //@ts-ignore
    bitStream.write(BinaryType.UInt8, encoded.charCodeAt(i))
  }
}

var read = function (bitStream: BitStream) {
  //@ts-ignore
  var length = bitStream.read(BinaryType.UInt32)
  var encoded = ''
  for (var i = 0; i < length; i++) {
    //@ts-ignore
    encoded += String.fromCharCode(bitStream.read(BinaryType.UInt8))
  }
  return utf8.decode(encoded)
}

var countBits = function (value: string) {
  var bits = 32 // will represent the string length
  bits += utf8.encode(value).length * 8
  return bits
}

const UTF8String: any = {
  bits: 0,
  boundsCheck: boundsCheck,
  customBits: true,
  countBits: countBits,
  customWrite: true,
  write: write,
  customRead: true,
  read: read,
  offset: 0,
  compare: (a: any, b: any) => {
    return {
      a: a,
      b: b,
      isChanged: a !== b,
    }
  },
}

export default UTF8String
