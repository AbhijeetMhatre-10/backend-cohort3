import ImageKit, { toFile } from "@imagekit/nodejs";
import config from "../config/config.js";

const client = new ImageKit({
  privateKey: config.IK_PRIVATE_KEY,
});

const uploadFile = async ({ buffer, fileName }) => {
  const response = await client.files.upload({
    file: await toFile(Buffer.from(buffer), "file"),
    fileName,
    folder: "/snitch",
  });

  return response;
};

export { uploadFile };
