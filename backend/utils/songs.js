import fs from "fs";

export const getSongs = (directoryPath) => {
  console.log("Current path: ", directoryPath);

  try {
    const files = fs.readdirSync(directoryPath).map((file) => {
      return {
        name: file,
        path: `${directoryPath}\\${file}`,
      };
    });
    console.log(files);
    return files;
  } catch (error) {
    console.error(error);
  }
};
