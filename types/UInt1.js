/**
 * Definition of an UInt2, an unsigned 2 bit integer
 * range: 0 to 3
 * uses BitBuffer functions for write/read
 */
import compareInts from './compare/compareIntegers'

var UInt1 = {
  min: 0,
  max: 1,
  bits: 1,
  compare: compareInts,
  write: 'writeUInt1',
  read: 'readUInt1',
  offset: 0,
}

UInt1.boundsCheck = function (value) {
  return value >= UInt1.min && value <= UInt1.max
}

export default UInt1
