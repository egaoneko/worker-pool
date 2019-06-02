// https://github.com/mapbox/mapbox-gl-js/blob/master/src/util/web_worker_transfer.js

export type SerializedType =
    | null
    | void
    | boolean
    | number
    | string
    | Boolean
    | Number
    | String
    | Object
    | Date
    | RegExp
    | ArrayBuffer
    | ImageData
    | ArrayBufferView;

export type Serialized = SerializedType | Array<SerializedType>;

export function serialize(input: any, transferables?: any): Serialized | never {
  if (input === null ||
    input === undefined ||
    typeof input === 'boolean' ||
    typeof input === 'number' ||
    typeof input === 'string' ||
    typeof input === 'object' ||
    input instanceof Boolean ||
    input instanceof Number ||
    input instanceof String ||
    input instanceof Date ||
    input instanceof RegExp) {
    return input;
  }

  if (input instanceof ArrayBuffer) {
    if (transferables) {
      transferables.push(input);
    }
    return input;
  }

  if (ArrayBuffer.isView(input)) {
    const view: ArrayBufferView = input;
    if (transferables) {
      transferables.push(view.buffer);
    }
    return view;
  }

  if (input instanceof ImageData) {
    if (transferables) {
      transferables.push(input.data.buffer);
    }
    return input;
  }

  if (Array.isArray(input)) {
    const serialized: Array<Serialized> = [];
    for (const item of input) {
      serialized.push(serialize(item, transferables));
    }
    return serialized;
  }

  throw new Error(`can't serialize object of type ${typeof input}`);
}
  
export function deserialize(input: any): Serialized | never {
  if (input === null ||
    input === undefined ||
    typeof input === 'boolean' ||
    typeof input === 'number' ||
    typeof input === 'string' ||
    typeof input === 'object' ||
    input instanceof Boolean ||
    input instanceof Number ||
    input instanceof String ||
    input instanceof Date ||
    input instanceof RegExp ||
    input instanceof ArrayBuffer ||
    ArrayBuffer.isView(input) ||
    input instanceof ImageData) {
    return input;
  }

  if (Array.isArray(input)) {
    return input.map(deserialize);
  }

  throw new Error(`can't deserialize object of type ${typeof input}`);
}