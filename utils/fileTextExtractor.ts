import * as pdfjsLib from 'pdfjs-dist';

import JSZip from 'jszip';
import mammoth from 'mammoth';
import { parseStringPromise } from 'xml2js';

if (typeof window !== 'undefined') {
  import('pdfjs-dist/build/pdf.worker.min.mjs')
    .then((worker) => {
      pdfjsLib.GlobalWorkerOptions.workerSrc = worker.default || worker;
    })
    .catch((error) => {
      console.error('Error loading pdf worker:', error);
    });
}

const parsePptx = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onload = async (e: ProgressEvent<FileReader>) => {
      try {
        // Проверяем, что e.target существует и имеет свойство result
        const target = e.target;
        if (!target || !(target.result instanceof ArrayBuffer)) {
          throw new Error('File reading error: result is not an ArrayBuffer');
        }

        const arrayBuffer = target.result; // Прочитанный файл как ArrayBuffer

        const zip = await JSZip.loadAsync(arrayBuffer);

        const slideFiles = Object.keys(zip.files).filter(
          (fileName) =>
            fileName.startsWith('ppt/slides/slide') && fileName.endsWith('.xml')
        );

        let fullText = '';

        for (const slideFile of slideFiles) {
          const slideContent = await zip.file(slideFile).async('string');
          const slideXml = await parseStringPromise(slideContent);

          const textElements = extractTextFromSlide(slideXml);
          fullText += textElements.join('\n');
        }

        resolve(fullText);
      } catch (error) {
        if (error instanceof Error) {
          reject('Error processing PPTX file: ' + error.message);
        } else {
          reject('Unknown error occurred');
        }
      }
    };

    fileReader.onerror = (error) => reject('Error reading PPTX file: ' + error);

    fileReader.readAsArrayBuffer(file);
  });
};

const extractTextFromSlide = (slideXml: any) => {
  const textElements: any = [];

  const shapes = slideXml['p:sld']['p:spTree'][0]['p:sp'];
  shapes.forEach((shape: any) => {
    if (shape['p:txBody'] && shape['p:txBody'][0]['a:p']) {
      shape['p:txBody'][0]['a:p'].forEach((p: any) => {
        if (p['a:r']) {
          p['a:r'].forEach((r: any) => {
            if (r['a:t']) {
              textElements.push(r['a:t'][0]);
            }
          });
        }
      });
    }
  });

  return textElements;
};

const parseDocx = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onload = async (e: ProgressEvent<FileReader>) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;

        const result = await mammoth.extractRawText({ arrayBuffer });

        resolve(result.value);
      } catch (error) {
        reject(
          'Error processing DOCX file: ' +
            (error instanceof Error ? error.message : error)
        );
      }
    };

    fileReader.onerror = (error: ProgressEvent<FileReader>) =>
      reject('Error reading DOCX file: ' + error);
    fileReader.readAsArrayBuffer(file);
  });
};

const parseTxt = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onload = (e: ProgressEvent<FileReader>) => {
      resolve(e.target?.result as string);
    };

    fileReader.onerror = (error: ProgressEvent<FileReader>) =>
      reject('Error reading TXT file: ' + error);

    fileReader.readAsText(file);
  });
};

const parseHtml = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onload = (e: ProgressEvent<FileReader>) => {
      resolve(e.target?.result as string);
    };

    fileReader.onerror = (error: ProgressEvent<FileReader>) =>
      reject('Error reading HTML file: ' + error);

    fileReader.readAsText(file);
  });
};

const extractPdfText = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onload = async (e: ProgressEvent<FileReader>) => {
      e.preventDefault();

      const pdfData = new Uint8Array(e.target?.result as ArrayBuffer);

      try {
        const pdf = await pdfjsLib.getDocument(pdfData).promise;
        const numPages = pdf.numPages;

        let fullText = '';

        for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
          const page = await pdf.getPage(pageNumber);
          const textContent = await page.getTextContent();

          textContent.items.forEach((item: any) => {
            if ('str' in item) {
              fullText += item.str;
            }
          });
        }

        resolve(fullText);
      } catch (error) {
        reject('Error extracting PDF text: ' + error);
      }
    };

    fileReader.onerror = (error: ProgressEvent<FileReader>) =>
      reject('Error reading file: ' + error);
    fileReader.readAsArrayBuffer(file);
  });
};

export const fileExtractor = async (file: File) => {
  const fileType = file.type || file.name.split('.').pop();

  try {
    if (fileType === 'application/pdf' || file.name.endsWith('.pdf')) {
      return await extractPdfText(file);
    } else if (
      fileType ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.name.endsWith('.docx')
    ) {
      return await parseDocx(file);
    } else if (
      fileType ===
        'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
      file.name.endsWith('.pptx')
    ) {
      return await parsePptx(file);
    } else if (fileType === 'text/plain' || file.name.endsWith('.txt')) {
      return await parseTxt(file);
    } else if (fileType === 'text/html' || file.name.endsWith('.html')) {
      return await parseHtml(file);
    } else {
      throw new Error('Unsupported file type');
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error extracting file content: ' + error.message);
    } else {
      throw new Error('Unknown error occurred');
    }
  }
};
