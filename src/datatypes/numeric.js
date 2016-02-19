var { PartialReadError} = require('../utils');

function readLong(buffer, offset) {
  if(offset + 8 > buffer.length) return null;
  return {
    value: [buffer.readInt32BE(offset), buffer.readInt32BE(offset + 4)],
    size: 8
  };
}

function writeLong(value, buffer, offset) {
  buffer.writeInt32BE(value[0], offset);
  buffer.writeInt32BE(value[1], offset + 4);
  return offset + 8;
}

function generateFunctions(bufferReader,bufferWriter,size)
{
  var reader=function(buffer, offset)
  {
    if(offset + size > buffer.length)
      throw new PartialReadError();
    var value = buffer[bufferReader](offset);
    return {
      value: value,
      size: size
    };
  };
  var writer=function(value, buffer, offset) {
    buffer[bufferWriter](value, offset);
    return offset + size;
  };
  return [reader, writer, size];
}

var nums= {
  'i8': ["readInt8", "writeInt8", 1],
  'u8': ["readUInt8", "writeUInt8", 1],
  'i16': ["readInt16BE", "writeInt16BE", 2],
  'u16': ["readUInt16BE", "writeUInt16BE", 2],
  'i32': ["readInt32BE", "writeInt32BE", 4],
  'u32': ["readUInt32BE", "writeUInt32BE", 4],
  'f32': ["readFloatBE", "writeFloatBE", 4],
  'f64': ["readDoubleBE", "writeDoubleBE", 8]
};

var types=Object.keys(nums).reduce(function(types,num){
  types[num]=generateFunctions(nums[num][0], nums[num][1], nums[num][2]);
  return types;
},{});
types["long"]=[readLong, writeLong, 8];


module.exports = types;
