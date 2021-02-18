import { BinaryType } from '../binary-type'
import { BitStream } from '../bit-stream'

var boundsCheck = function (value: string) {
  return value.length < 256
}

/**
 * Serializes value and writes it to the buffer as an ascii string.
 * The first byte will be the length of the string, and the subsequent
 * bytes will be the character codes.
 */
var write = function (bitStream: BitStream, value: any) {
  var byteArray = convertASCIIStringToByteArray(value)

  for (var i = 0; i < byteArray.length; i++) {
    bitStream.write(BinaryType.UInt8, byteArray[i])
  }
}

var read = function (bitStream: BitStream) {
  var length = bitStream.read(BinaryType.UInt8)
  var string = ''
  for (var i = 0; i < length; i++) {
    string += String.fromCharCode(bitStream.read(BinaryType.UInt8))
  }
  return string
}

var countBits = function (str: string) {
  var bits = 8 // will represent the string length
  bits += str.length * 8
  return bits
}

var convertASCIIStringToByteArray = function (str: string) {
  //console.log('convertASCIIStringToByteArray', string)
  var arr = []
  if (str.length < 256) {
    arr.push(str.length)
  } else {
    throw new Error('ASCIIString exceeded 255 character limit: ' + str)
  }
  for (var i = 0; i < str.length; i++) {
    arr.push(str.charCodeAt(i))
  }
  return arr
}

/**
 * Definition of an ASCIIString, a string that using 1 byte per character
 * the string may be up to 255 characters long
 * uses BitBuffer UInt8 functions for write/read
 */
var ASCIIString = {
  bits: 0,
  boundsCheck: boundsCheck,
  customBits: true,
  countBits: countBits,
  customWrite: true,
  write: write,
  customRead: true,
  read: read,
  offset: 0,
}

// @ts-ignore
ASCIIString.compare = function (a, b) {
  return {
    a: a,
    b: b,
    isChanged: a !== b,
  }
}

export default ASCIIString
