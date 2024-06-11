declare module '*.protobuf' {
  const content: Uint8Array;
  export default content;
}

declare module '*.proto' {
  const content: string;
  export default content;
}
