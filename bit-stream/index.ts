import BinaryTypeConfig from '../binary-type-config'
import { BitBuffer } from '../bit-buffer'
import { BinaryType } from '../binary-type'

/**
 * Some notes before using:
 *
 * - Even though this allows you to write bits, the underlying size will always be in bytes.
 * - When you write a number of bits no divisible by 8, the bit stream will round up to be
 *  divisible by 8
 */

/*
 * Offers a stream for writing to a BitBuffer that increments its own offset.
 * Supplying an offset [optional] will start the stream at the specified position.
 */
export class BitStream {
  bitBuffer: BitBuffer
  offset: number = 0

  constructor(
    bitsOrBuffer?: BitStream | BitBuffer | ArrayBuffer | Uint8Array | number
  ) {
    if (typeof bitsOrBuffer === 'undefined') {
      this.bitBuffer = new BitBuffer(0)
    } else if (bitsOrBuffer instanceof BitStream) {
      this.bitBuffer = new BitBuffer(bitsOrBuffer.buffer)
      this.setActualBitsLength(bitsOrBuffer.length)
    } else if (bitsOrBuffer instanceof BitBuffer) {
      this.bitBuffer = bitsOrBuffer
    } else {
      // ArrayBuffer | Uint8Array | number
      this.bitBuffer = new BitBuffer(bitsOrBuffer)
    }
  }

  static fromMultiple(bitStreams: BitStream[]) {
    const bitBuffers = []
    for (let i = 0; i < bitStreams.length; i++){
      bitStreams[i].offset = 0
      bitBuffers.push(bitStreams[i].bitBuffer)
    }

    return new BitStream(
      BitBuffer.combine(bitBuffers)
    )
  }

  get buffer(): any {
    return this.bitBuffer.byteArray
  }

  toUInt8Array() {
    return new Uint8Array(this.bitBuffer.byteArray)
  }

  /**
   * Length in bits
   */
  get length() {
    return this.bitBuffer.bitLength
  }

  /**
   * Useful for cleaning up a bit stream that was created from a buffer
   * when you know the message length
   *
   * @param bits
   */
  setActualBitsLength(bits: number) {
    this.bitBuffer.bitLength = bits
  }

  // map functions from BitStream to BitBuffer
  read = (type: BinaryType) => {
    const typeConfig = BinaryTypeConfig[type]

    let value: any

    if (typeConfig.customRead && typeof typeConfig.read === 'function') {
      value = typeConfig.read(this)
    } else if (typeof typeConfig.read === 'string') {
      if (BitBuffer.hasOwnProperty(typeConfig.read)) {
        throw Error(
          `[${this.constructor.name}] BitBuffer has no property ${typeConfig.read}.`
        )
      }

      //@ts-ignore
      value = this.bitBuffer[typeConfig.read](this.offset)
    } else {
      throw Error(
        `[${this.constructor.name}] Misconfigured Type config ${typeConfig}.`
      )
    }

    this.offset += typeConfig.bits

    return value
  }

  // map functions from BitStream to BitBuffer
  write = (type: BinaryType, value: any) => {
    const typeConfig = BinaryTypeConfig[type]

    if (typeConfig.customWrite && typeof typeConfig.write === 'function') {
      typeConfig.write(this, value)
    } else if (typeof typeConfig.write === 'string') {
      if (BitBuffer.hasOwnProperty(typeConfig.write)) {
        throw Error(
          `[${this.constructor.name}] BitBuffer has no property ${typeConfig.write}.`
        )
      }

      //@ts-ignore
      this.bitBuffer[typeConfig.write](value, this.offset)
    } else {
      throw Error(
        `[${this.constructor.name}] Misconfigured Type config ${typeConfig}.`
      )
    }

    this.offset += typeConfig.bits

    return this
  }
}

export default BitStream
