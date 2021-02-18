import UInt8 from './UInt8'
import { BinaryType } from '../binary-type'

// compare not used yet
var compare = function (a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2]
}

var boundsCheck = function (value) {
  return (
    value[0] >= UInt8.min &&
    value[0] <= UInt8.max &&
    value[1] >= UInt8.min &&
    value[1] <= UInt8.max &&
    value[2] >= UInt8.min &&
    value[2] <= UInt8.max
  )
}

var write = function (bitStream, value) {
  bitStream.write(BinaryType.UInt8, value[0])
  bitStream.write(BinaryType.UInt8, value[1])
  bitStream.write(BinaryType.UInt8, value[2])
}

var read = function (bitStream) {
  var r = bitStream.read(BinaryType.UInt8)
  var g = bitStream.read(BinaryType.UInt8)
  var b = bitStream.read(BinaryType.UInt8)
  return [r, g, b]
}

/**
 * Definition of an RGB888, a 3-component color with 1 byte per component
 * range
 *	 value[0]: 0 to 255
 *	 value[1]: 0 to 255
 *	 value[2]: 0 to 255
 * uses BitBuffer functions for write/read
 */
var RGB888 = {
  customCompare: true,
  compare: compare,
  boundsCheck: boundsCheck,
  bits: 24,
  customWrite: true,
  write: write,
  customRead: true,
  read: read,
  offset: 0,
}

export default RGB888
