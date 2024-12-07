const PDFDocument = require('pdfkit');
const fs = require('fs');

const generateCertificate = (userName, paperTitle) => {
  const doc = new PDFDocument();
  const filePath = `certificates/${userName}-certificate.pdf`;

  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(25).text('Certificate of Acceptance', 100, 100);
  doc
    .fontSize(18)
    .text(`This is to certify that ${userName}'s paper titled`, 100, 150);
  doc.fontSize(18).text(`"${paperTitle}" has been accepted.`, 100, 180);

  doc.end();

  return filePath;
};

module.exports = generateCertificate;
