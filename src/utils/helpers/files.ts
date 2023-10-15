import * as fs from "fs";

const PDFJS = require("pdfjs-dist");

// uses fileSystem (fs) to get the number of pages in a pdf
export const getPdfPageCount = async (pdfFilePath: string): Promise<number> => {
  const dataBuffer: Buffer = fs.readFileSync(pdfFilePath);
  const doc = await PDFJS.getDocument(dataBuffer).promise;
  return doc.numPages;
};
