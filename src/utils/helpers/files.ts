import * as fs from "fs";

const PDFJS = require("pdfjs-dist");

export const getPdfPageCount = async (pdfFilePath: string): Promise<number> => {
  const dataBuffer: Buffer = fs.readFileSync(pdfFilePath);
  const doc = await PDFJS.getDocument(dataBuffer).promise;
  return doc.numPages;
};
