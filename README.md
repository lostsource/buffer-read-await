# buffer-read-await
Asynchronously read data from incoming buffer stream

## Installation

```
npm install buffer-read-await
```

## Usage
### Create a reader

```
const BufferReadAwait = require('buffer-read-await');
bfrReader = BufferReadAwait.alloc(1024);
```

### Append data
```
bfrReader.append(buffer);
```
### Read data
Any of the standard NodeJS Buffer readers can be used. (readInt8, readUInt8, readInt16BE, readInt16LE, readUInt16BE, readUInt16LE, readInt32BE, readInt32LE, readUInt32BE, readUInt32LE, readBigInt64BE, readBigInt64LE, readBigUInt64BE, readBigUInt64LE)
```
let testbyte = await bfrReader.readUInt8();
```
The promise will resolve once enough data has been appended. 
