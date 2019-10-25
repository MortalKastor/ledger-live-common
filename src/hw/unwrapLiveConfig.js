// @flow

import Transport from "@ledgerhq/hw-transport";

export default async (
  transport: Transport<*>,
  wrappedConfig: string
): Promise<string> => {
  const wrappedBuffer = Buffer.from(wrappedConfig, "hex");
  let unwrappedChunks = [];
  const { length } = wrappedBuffer;
  const chunkSize = 240;
  let start = 0;

  while (start < length) {
    const end = start + chunkSize;
    const chunk = wrappedBuffer.slice(start, end);
    const last = end > length ? 0x80 : 0x00;

    const unwrappedChunk = await transport.send(
      0xe0,
      0x04,
      last,
      chunk.length,
      chunk
    );

    unwrappedChunks.push(unwrappedChunk.slice(0, unwrappedChunk.length - 2));

    start = end;
  }

  const res = Buffer.concat(unwrappedChunks);

  return res.toString("utf8");
};
