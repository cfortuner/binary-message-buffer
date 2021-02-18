export class BitBuffer {
  bitLength: any
  byteLength: any
  byteArray: any

  getScratch() {
    return new DataView(new ArrayBuffer(8))
  }

  constructor(sourceOrLength: any) {
    this.bitLength = null // length in bits (can be less than the bytes/8)
    this.byteLength = null // length in bytes (atleast enough to hold the bits)
    this.byteArray = null // Uint8Array holding the underlying bytes

    if (typeof sourceOrLength === 'number') {
      // create a bitBuffer with *length* bits
      this.bitLength = sourceOrLength
      this.byteLength = Math.ceil(sourceOrLength / 8)
      this.byteArray = new Uint8Array(this.byteLength)
    } else if (
      sourceOrLength instanceof ArrayBuffer ||
      sourceOrLength instanceof Uint8Array
    ) {
      // create a bitBuffer from an ArrayBuffer (Uint8Array, etc)
      this.bitLength = sourceOrLength.byteLength * 8
      this.byteLength = sourceOrLength.byteLength
      this.byteArray = new Uint8Array(sourceOrLength)
    } else {
      throw new Error(
        'Unable to create BitBuffer, expected length (in bits), ArrayBuffer, or Buffer'
      )
    }
  }

  // Used to massage fp values so we can operate on them
  // at the bit level.

  static combine = (bitBuffers: BitBuffer[]): BitBuffer => {
    var bitLength = 0
    for (var i = 0; i < bitBuffers.length; i++) {
      bitLength += bitBuffers[i].bitLength
    }

    // Create the buffer
    var bitBuffer = new BitBuffer(new Uint8Array(Math.ceil(bitLength / 8)))

    // set the bits
    var offset = 0
    for (var i = 0; i < bitBuffers.length; i++) {
      for (var j = 0; j < bitBuffers[i].bitLength; j++) {
        bitBuffer._setBit(bitBuffers[i]._getBit(j), offset)
        offset++
      }
    }

    // Set the actual bit length
    bitBuffer.bitLength = bitLength

    // return the new buffer
    return bitBuffer
  }

  get arrayBuffer() {
    return this.byteArray //new Buffer(this.byteArray, this.byteLength)
  }

  _getBit = (offset: any) => {
    return (this.byteArray[offset >> 3] >> (offset & 7)) & 0x1
  }

  _setBit = (on: any, offset: any) => {
    if (on) {
      this.byteArray[offset >> 3] |= 1 << (offset & 7)
    } else {
      this.byteArray[offset >> 3] &= ~(1 << (offset & 7))
    }
  }

  getBits = (offset: any, bits: any, signed: any) => {
    var available = this.byteArray.length * 8 - offset

    if (bits > available) {
      throw new Error(
        'Cannot get ' +
          bits +
          ' bit(s) from offset ' +
          offset +
          ', ' +
          available +
          ' available'
      )
    }

    var value = 0
    for (var i = 0; i < bits; ) {
      /*
      var read

      // Read an entire byte if we can.
      if ((bits - i) >= 8 && ((offset & 7) === 0)) {
        value |= (this.byteArray[offset >> 3] << i)
        read = 8
      } else {
        value |= (this._getBit(offset: any) => << i)
        read = 1
      }
      */

      var remaining = bits - i
      var bitOffset = offset & 7
      var currentByte = this.byteArray[offset >> 3]
      var read = Math.min(remaining, 8 - bitOffset)
      var mask = (1 << read) - 1
      var readBits = (currentByte >> bitOffset) & mask
      value |= readBits << i

      offset += read
      i += read
    }

    if (signed) {
      // If we're not working with a full 32 bits, check the
      // imaginary MSB for this bit count and convert to a
      // valid 32-bit signed value if set.
      if (bits !== 32 && value & (1 << (bits - 1))) {
        value |= -1 ^ ((1 << bits) - 1)
      }

      return value
    }

    return value >>> 0
  }

  setBits = (value: any, offset: any, bits: any) => {
    var available = this.byteArray.length * 8 - offset

    if (bits > available) {
      throw new Error(
        'Cannot set ' +
          bits +
          ' bit(s) from offset ' +
          offset +
          ', ' +
          available +
          ' available'
      )
    }

    for (var i = 0; i < bits; ) {
      var wrote

      // Write an entire byte if we can.
      if (bits - i >= 8 && (offset & 7) === 0) {
        this.byteArray[offset >> 3] = value & 0xff
        wrote = 8
      } else {
        this._setBit(value & 0x1, offset)
        wrote = 1
      }

      value = value >> wrote

      offset += wrote
      i += wrote
    }
  }

  // true, false
  readBoolean = (offset: any) => {
    return this.getBits(offset, 1, false) !== 0
  }
  // 0 to 1
  readUInt1 = (offset: any) => {
    return this.getBits(offset, 1, false)
  }

  // -2 to 1
  readInt2 = (offset: any) => {
    return this.getBits(offset, 2, true)
  }
  // 0 to 3
  readUInt2 = (offset: any) => {
    return this.getBits(offset, 2, false)
  }
  // -4 to 3
  readInt3 = (offset: any) => {
    return this.getBits(offset, 3, true)
  }
  // 0 to 7
  readUInt3 = (offset: any) => {
    return this.getBits(offset, 3, false)
  }
  // -8 to 7
  readInt4 = (offset: any) => {
    return this.getBits(offset, 4, true)
  }
  // 0 to 15
  readUInt4 = (offset: any) => {
    return this.getBits(offset, 4, false)
  }
  // -16 to 15
  readInt5 = (offset: any) => {
    return this.getBits(offset, 5, true)
  }
  // 0 to 31
  readUInt5 = (offset: any) => {
    return this.getBits(offset, 5, false)
  }
  // -32 to 31
  readInt6 = (offset: any) => {
    return this.getBits(offset, 6, true)
  }
  // 0 to 63
  readUInt6 = (offset: any) => {
    return this.getBits(offset, 6, false)
  }
  // -64 to 63
  readInt7 = (offset: any) => {
    return this.getBits(offset, 7, true)
  }
  // 0 to 127
  readUInt7 = (offset: any) => {
    return this.getBits(offset, 7, false)
  }
  // -128 to 127
  readInt8 = (offset: any) => {
    return this.getBits(offset, 8, true)
  }
  // 0 to 255
  readUInt8 = (offset: any) => {
    return this.getBits(offset, 8, false)
  }
  // -256 to 255
  readInt9 = (offset: any) => {
    return this.getBits(offset, 9, true)
  }
  // 0 to 511
  readUInt9 = (offset: any) => {
    return this.getBits(offset, 9, false)
  }
  // -512 to 511
  readInt10 = (offset: any) => {
    return this.getBits(offset, 10, true)
  }
  // 0 to 1023
  readUInt10 = (offset: any) => {
    return this.getBits(offset, 10, false)
  }
  // -1024 to 1023
  readInt11 = (offset: any) => {
    return this.getBits(offset, 11, true)
  }
  // 0 to 2047
  readUInt11 = (offset: any) => {
    return this.getBits(offset, 11, false)
  }
  // -2048 to 2047
  readInt12 = (offset: any) => {
    return this.getBits(offset, 12, true)
  }
  // 0 to 4095
  readUInt12 = (offset: any) => {
    return this.getBits(offset, 12, false)
  }
  // -32768 to 32767
  readInt16 = (offset: any) => {
    return this.getBits(offset, 16, true)
  }
  // 0 to 65535
  readUInt16 = (offset: any) => {
    return this.getBits(offset, 16, false)
  }
  // -2147483648 to 2147483647
  readInt32 = (offset: any) => {
    return this.getBits(offset, 32, true)
  }
  // 0 to 4294967295
  readUInt32 = (offset: any) => {
    return this.getBits(offset, 32, false)
  }
  readFloat32 = (offset: any) => {
    const scratch = this.getScratch()
    scratch.setUint32(0, this.readUInt32(offset))
    return scratch.getFloat32(0)
  }
  readFloat64 = (offset: any) => {
    const scratch = this.getScratch()
    scratch.setUint32(0, this.readUInt32(offset))
    // DataView offset is in bytes.
    scratch.setUint32(4, this.readUInt32(offset + 32))
    return scratch.getFloat64(0)
  }

  writeBoolean = (value: any, offset: any) => {
    this.setBits(value ? 1 : 0, offset, 1)
  }
  writeUInt1 = (value: any, offset: any) => {
    this.setBits(value, offset, 1)
  }

  writeInt2 = (value: any, offset: any) => {
    this.setBits(value, offset, 2)
  }
  writeUInt2 = (value: any, offset: any) => {
    this.setBits(value, offset, 2)
  }
  writeInt3 = (value: any, offset: any) => {
    this.setBits(value, offset, 3)
  }
  writeUInt3 = (value: any, offset: any) => {
    this.setBits(value, offset, 3)
  }

  writeInt4 = (value: any, offset: any) => {
    this.setBits(value, offset, 4)
  }
  writeUInt4 = (value: any, offset: any) => {
    this.setBits(value, offset, 4)
  }
  writeInt5 = (value: any, offset: any) => {
    this.setBits(value, offset, 5)
  }
  writeUInt5 = (value: any, offset: any) => {
    this.setBits(value, offset, 5)
  }
  writeInt6 = (value: any, offset: any) => {
    this.setBits(value, offset, 6)
  }
  writeUInt6 = (value: any, offset: any) => {
    this.setBits(value, offset, 6)
  }
  writeInt7 = (value: any, offset: any) => {
    this.setBits(value, offset, 7)
  }
  writeUInt7 = (value: any, offset: any) => {
    this.setBits(value, offset, 7)
  }
  writeInt8 = (value: any, offset: any) => {
    this.setBits(value, offset, 8)
  }
  writeUInt8 = (value: any, offset: any) => {
    this.setBits(value, offset, 8)
  }
  writeInt9 = (value: any, offset: any) => {
    this.setBits(value, offset, 9)
  }
  writeUInt9 = (value: any, offset: any) => {
    this.setBits(value, offset, 9)
  }
  writeInt10 = (value: any, offset: any) => {
    this.setBits(value, offset, 10)
  }
  writeUInt10 = (value: any, offset: any) => {
    this.setBits(value, offset, 10)
  }
  writeInt11 = (value: any, offset: any) => {
    this.setBits(value, offset, 11)
  }
  writeUInt11 = (value: any, offset: any) => {
    this.setBits(value, offset, 11)
  }
  writeInt12 = (value: any, offset: any) => {
    this.setBits(value, offset, 12)
  }
  writeUInt12 = (value: any, offset: any) => {
    this.setBits(value, offset, 12)
  }
  writeInt16 = (value: any, offset: any) => {
    this.setBits(value, offset, 16)
  }
  writeUInt16 = (value: any, offset: any) => {
    this.setBits(value, offset, 16)
  }
  writeInt32 = (value: any, offset: any) => {
    this.setBits(value, offset, 32)
  }
  writeUInt32 = (value: any, offset: any) => {
    this.setBits(value, offset, 32)
  }
  writeFloat32 = (value: any, offset: any) => {
    const scratch = this.getScratch()
    scratch.setFloat32(0, value)
    this.setBits(scratch.getUint32(0), offset, 32)
  }

  writeFloat64 = (value: any, offset: any) => {
    const scratch = this.getScratch()
    scratch.setFloat64(0, value)
    this.setBits(scratch.getUint32(0), offset, 32)
    this.setBits(scratch.getUint32(4), offset + 32, 32)
  }
}
