/**
 * Definition of a Boolean
 * size is 1 bit
 * uses BitBuffer functions for write/read
 * should never be interpolated (what is halfway between true and false? so esoteric)
 */
const Bool = {
  bits: 1,
  write: 'writeBoolean',
  read: 'readBoolean',
  offset: 0,
}

Bool.boundsCheck = function (value) {
  return typeof value === 'boolean'
}

Bool.compare = function (a, b) {
  return {
    a: a,
    b: b,
    isChanged: a !== b,
  }
}

export default Bool
