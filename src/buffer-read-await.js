/*
The MIT License (MIT)

Copyright (c) 2019 Joseph Portelli (joseph@lostsource.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

'use strict';

class BufferReadAwait {
  constructor(initialBfrSize) {
    this._buffer = Buffer.alloc(initialBfrSize);
    this._rp = 0;
    this._wp = 0;
    this._onDataAppend = () => {};
  }

  append(buffer) {
    this._copyDataToBuffer(buffer);
    this._onDataAppend();
  }

  _moveBufferBack() {
    if(this._rp === 0) {
      return false;
    }
    this._buffer.copy(this._buffer, 0, this._rp);
    this._wp -= this._rp;
    this._rp = 0;
    return true;
  }

  _resizeBufferIfNeeded(reqByteLength) {
    if(reqByteLength > this._writeSpaceLeft) {
      // move buffer back
      this._moveBufferBack();      
    }

    if(reqByteLength > this._writeSpaceLeft) {
      const newBfr = Buffer.alloc(reqByteLength + this._buffer.length);
      this._buffer.copy(newBfr);
      this._buffer = newBfr;
    }
  }

  _copyDataToBuffer(data) {
    this._resizeBufferIfNeeded(data.length);
    data.copy(this._buffer, this._wp);
    this._wp += data.length;
  }
  
  get _writeSpaceLeft() {
    return this._buffer.length - this._wp;
  }

  get _remainingData() {
    return this._wp - this._rp;
  }

  async _waitForData(ammount) {
    const remainingData = this._wp - this._rp;
    if(remainingData >= ammount) {
      return Promise.resolve();
    }

    const that = this;
    return new Promise((resolve) => {
      that._onDataAppend = () => {
        const remainingData = this._wp - this._rp;
        if(remainingData >= ammount) {                  
          resolve();
        }
      }
    });
  }

  async readBytes(length) {
    if(length > this._remainingData) {
      await this._waitForData(length);
    }
    
    const bytes = Buffer.from(this._buffer.subarray(this._rp, this._rp + length));
    this._rp += length;
    return bytes;
  }  

  async skip(ammount) {
    await this._waitForData(ammount);
    this._rp += ammount;
  }

  async readInt8() {
    await this._waitForData(1);
    const val = this._buffer.readInt8(this._rp);
    this._rp += 1;
    return val;
  }

  async readUInt8() {
    await this._waitForData(1);
    const val = this._buffer.readUInt8(this._rp);
    this._rp += 1;
    return val;
  }
  
  async readInt16BE() {
    await this._waitForData(2);
    const val = this._buffer.readInt16BE(this._rp);
    this._rp += 2;
    return val;
  }
  
  async readInt16LE() {
    await this._waitForData(2);
    const val = this._buffer.readInt16LE(this._rp);
    this._rp += 2;
    return val;
  }
  
  async readUInt16BE() {
    await this._waitForData(2);
    const val = this._buffer.readUInt16BE(this._rp);
    this._rp += 2;
    return val;
  }
  
  async readUInt16LE() {
    await this._waitForData(2);
    const val = this._buffer.readUInt16LE(this._rp);
    this._rp += 2;
    return val;
  }
  
  async readInt32BE() {
    await this._waitForData(4);
    const val = this._buffer.readInt32BE(this._rp);
    this._rp += 4;
    return val;
  }
  
  async readInt32LE() {
    await this._waitForData(4);
    const val = this._buffer.readInt32LE(this._rp);
    this._rp += 4;
    return val;
  }
  
  async readUInt32BE() {
    await this._waitForData(4);
    const val = this._buffer.readUInt32BE(this._rp);
    this._rp += 4;
    return val;
  }
  
  async readUInt32LE() {
    await this._waitForData(4);
    const val = this._buffer.readUInt32LE(this._rp);
    this._rp += 4;
    return val;
  }
  
  async readBigInt64BE() {
    await this._waitForData(8);
    const val = this._buffer.readBigInt64BE(this._rp);
    this._rp += 8;
    return val;
  }
  
  async readBigInt64LE() {
    await this._waitForData(8);
    const val = this._buffer.readBigInt64LE(this._rp);
    this._rp += 8;
    return val;
  }
  
  async readBigUInt64BE() {
    await this._waitForData(8);
    const val = this._buffer.readBigUInt64BE(this._rp);
    this._rp += 8;
    return val;
  }
  
  async readBigUInt64LE() {
    await this._waitForData(8);
    const val = this._buffer.readBigUInt64LE(this._rp);
    this._rp += 8;
    return val;
  }
}

exports.alloc = (size) => {
  return new BufferReadAwait(size);
};