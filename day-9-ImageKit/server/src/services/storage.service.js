import "dotenv/config";
import ImageKit, { toFile } from "@imagekit/nodejs";

const storage = new ImageKit({
  privateKey: process.env.IK_PRIVATE_KEY,
});

export const sendFiles = async (file, fileName) => {
  return storage.files.upload({
  file: await toFile(file, fileName),
    fileName,
    folder: "cohort-3",
  });
};
