// @flow

import Transport from "@ledgerhq/hw-transport";

export default async (
  transport: Transport<*>,
  config: string
): Promise<string> => {
  const unwrappedBuffer = Buffer.from(config);
  let wrappedChunks = [];
  const { length } = unwrappedBuffer;
  const chunkSize = 240;
  let start = 0;

  while (start < length) {
    const end = start + chunkSize;
    const chunk = unwrappedBuffer.slice(start, end);
    const last = end > length ? 0x80 : 0x00;

    const wrappedChunk = await transport.send(
      0xe0,
      0x03,
      last,
      chunk.length,
      chunk
    );

    wrappedChunks.push(wrappedChunk.slice(0, wrappedChunk.length - 2));

    start = end;
  }

  const res = Buffer.concat(wrappedChunks);

  return res.toString("hex");
};
