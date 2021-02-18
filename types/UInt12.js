/**
 * Definition of an UInt12, an unsigned 12 bit integer
 * range: 0 to 4095
 * uses BitBuffer functions for write/read
 */
import compareInts from './compare/compareIntegers'

var UInt12 = {
  min: 0,
  max: 4095,
  bits: 12,
  compare: compareInts,
  write: 'writeUInt12',
  read: 'readUInt12',
  offset: 0,
}

UInt12.boundsCheck = function (value) {
  return value >= UInt12.min && value <= UInt12.max
}

export default UInt12
