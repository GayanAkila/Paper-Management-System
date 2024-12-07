const validateSubmission = (req, res, next) => {
    const { type, title, authors } = req.body;
    const file = req.file;
  
    if (!type || !title || !authors || !file) {
      return res
        .status(400)
        .json({ message: "All fields are required: type, title, authors, and file." });
    }
  
    const allowedTypes = ["Research Paper", "Project"];
    if (!allowedTypes.includes(type)) {
      return res
        .status(400)
        .json({ message: `Invalid type. Allowed values are: ${allowedTypes.join(", ")}.` });
    }
  
    next();
  };

  const uploadFileToDrive = async (file) => {
    const tempFilePath = path.join(__dirname, `../temp/${uuidv4()}_${file.originalname}`);
    fs.writeFileSync(tempFilePath, file.buffer);
  
    try {
      const response = await drive.files.create({
        requestBody: {
          name: `${uuidv4()}_${file.originalname}`,
          mimeType: file.mimetype,
        },
        media: {
          mimeType: file.mimetype,
          body: fs.createReadStream(tempFilePath),
        },
      });
  
      const fileId = response.data.id;
  
      // Make the file public
      await drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      });
  
      const result = await drive.files.get({
        fileId: fileId,
        fields: "webViewLink, webContentLink",
      });
  
      return result.data.webViewLink;
    } catch (error) {s
      throw new Error("File upload failed");
    } finally {
      fs.unlinkSync(tempFilePath);
    }
  };
  

  const parseAuthors = (authors) => {
    try {
      const parsed = Array.isArray(authors) ? authors : JSON.parse(authors);
      if (!Array.isArray(parsed) || parsed.length < 1) {
        throw new Error("Authors must be an array with at least one author.");
      }
      return parsed;
    } catch {
      throw new Error("Invalid authors format. Must be a valid JSON array.");
    }
  };
  