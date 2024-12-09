// const PDFDocument = require('pdfkit');
// const fs = require('fs');

// const generateCertificate = (userName, paperTitle) => {
//   const doc = new PDFDocument();
//   const filePath = `certificates/${userName}-certificate.pdf`;

//   doc.pipe(fs.createWriteStream(filePath));

//   doc.fontSize(25).text('Certificate of Acceptance', 100, 100);
//   doc
//     .fontSize(18)
//     .text(`This is to certify that ${userName}'s paper titled`, 100, 150);
//   doc.fontSize(18).text(`"${paperTitle}" has been accepted.`, 100, 180);

//   doc.end();

//   return filePath;
// };

// module.exports = generateCertificate;

// src/utils/certificateGenerator.js

const handlebars = require('handlebars');
const htmlPdf = require('html-pdf');
const fs = require('fs-extra');
const path = require('path');

const generateCertificatePDF = async (templateData) => {
  try {
    // Read the HTML template
    const templatePath = path.join(__dirname, '../templates/certificate.html');
    const templateHtml = await fs.readFile(templatePath, 'utf-8');

    // Compile template with Handlebars
    const template = handlebars.compile(templateHtml);
    const html = template(templateData);

    // PDF generation options
    const options = {
      format: 'A4',
      orientation: 'landscape',
      border: '0',
      type: 'pdf'
    };

    // Generate PDF
    return new Promise((resolve, reject) => {
      htmlPdf.create(html, options).toBuffer((err, buffer) => {
        if (err) {
          reject(err);
        } else {
          resolve(buffer);
        }
      });
    });
  } catch (error) {
    throw error;
  }
};

module.exports = { generateCertificatePDF };