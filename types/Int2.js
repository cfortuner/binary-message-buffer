/**
 * Definition of an Int4, a signed 4 bit integer
 * range: -2 to 1
 * uses BitBuffer functions for write/read
 */
import compareInts from './compare/compareIntegers'

var Int2 = {
  min: -2,
  max: 1,
  bits: 2,
  compare: compareInts,
  write: 'writeInt2',
  read: 'readInt2',
  offset: 0,
}

Int2.boundsCheck = function (value) {
  return value >= Int2.min && value <= Int2.max
}

export default Int2
