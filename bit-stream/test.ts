import { BitStream } from '.'
import { BinaryType } from '../binary-type'
import BinaryTypeConfig from '../binary-type-config'

describe('BitStream', () => {
  describe('its BitBuffer can be used to create an identical bitstream', () => {
    it('when it is empty', () => {
      const a = new BitStream()
      const b = new BitStream(a)

      expect(a.toUInt8Array()).toEqual(b.toUInt8Array())
    })

    it('when it has data', () => {
      const bits = BinaryTypeConfig[BinaryType.ASCIIString].countBits(
        'dogs, dogs'
      )
      const a = new BitStream(bits)
      a.write(BinaryType.ASCIIString, 'dogs dogs')
      a.offset = 0

      const b = new BitStream(a)

      expect(a.toUInt8Array()).toEqual(b.toUInt8Array())
    })

    it('when it has lots of different ', () => {
      const data = [
        {
          type: BinaryType.ASCIIString,
          bits: BinaryTypeConfig[BinaryType.ASCIIString].countBits(
            // maybe just make everything use this function
            'dogs, dogs'
          ),
          value: 'dogs, dogs',
        },
        {
          type: BinaryType.Boolean,
          bits: BinaryTypeConfig[BinaryType.Boolean].bits,
          value: true,
        },
        {
          type: BinaryType.Boolean,
          bits: BinaryTypeConfig[BinaryType.Boolean].bits,
          value: true,
        },
        {
          type: BinaryType.Boolean,
          bits: BinaryTypeConfig[BinaryType.Boolean].bits,
          value: true,
        },
        {
          type: BinaryType.Float32,
          compare: BinaryTypeConfig[BinaryType.Float32].compare,
          bits: BinaryTypeConfig[BinaryType.Float32].bits,
          value: -25.52002,
        },
        {
          type: BinaryType.Int32,
          bits: BinaryTypeConfig[BinaryType.Int32].bits,
          value: 50223523,
        },
        {
          type: BinaryType.UInt32,
          bits: BinaryTypeConfig[BinaryType.UInt32].bits,
          value: 12322252,
        },
        {
          type: BinaryType.Boolean,
          bits: BinaryTypeConfig[BinaryType.Boolean].bits,
          value: true,
        },
        {
          type: BinaryType.ASCIIString,
          bits: BinaryTypeConfig[BinaryType.ASCIIString].countBits(
            // maybe just make everything use this function
            'dogs, dogs'
          ),
          value: 'dogs, dogs',
        },
      ]

      const bits = data
        .map((v: any) => {
          return v.bits
        })
        .reduce((prevValue: any, currentValue: any) => {
          return prevValue + currentValue
        }, 0)

      const a = new BitStream(bits)

      data.forEach((v: any) => {
        a.write(v.type, v.value)
      })

      a.offset = 0

      const b = new BitStream(a)

      // console.log(a.buffer)
      // console.log(b.buffer)

      // Check that the buffers are the same (types may be different)
      expect(a.toUInt8Array()).toEqual(b.toUInt8Array())

      let out: any = []

      // super quick code to check equality
      data.forEach((v: any) => {
        const r = Object.assign(v, {})
        r.value = b.read(v.type)
        out.push(r)
      })

      out.forEach((v: any, index: number) => {
        let equal: boolean
        if (v.compare) {
          equal = !v.compare(v.value, data[index].value).isChanged
        } else {
          equal = v.value === data[index].value
        }
        expect(equal).toBe(true)
      })
    })
  })

  describe('its actual ArrayBuffer/BitBuffer byte size will always be divisible by 8', () => {
    it('will be 2 bytes when bits = 15', () => {
      const bs = new BitStream(15)
      expect(bs.buffer.byteLength).toEqual(2)
    })
  })

  describe('fromMultiple creates the correct bit streams', () => {
    const string = 'dogs dogs'
    const bits = BinaryTypeConfig[BinaryType.ASCIIString].countBits(string)
    const a = new BitStream(bits)
    a.write(BinaryType.ASCIIString, string)
    a.offset = 0

    const b = new BitStream(a)

    const res = BitStream.fromMultiple([a, b])

    // reset the offset so we can read this
    res.offset = 0

    expect(res.length).toEqual(a.length + b.length)

    const aValue = res.read(BinaryType.ASCIIString)
    const bValue = res.read(BinaryType.ASCIIString)

    expect(aValue).toEqual(bValue)
  })
})
