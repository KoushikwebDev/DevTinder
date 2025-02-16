const Tesseract = require('tesseract.js');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const asyncHandler = require('../utils/asyncHandler');
const CustomError = require('../utils/customError');

// Define the temp directory for storing uploaded files
const tempDir = path.join(__dirname, 'temp');

// Regular Expressions for extracting the details
const regexAadharNumber = /\d{4}\s?\d{4}\s?\d{4}/;  // Matches 12-digit Aadhar number with or without spaces
const regexDOB = /\d{2}\/\d{2}\/\d{4}/;  // Matches DD/MM/YYYY format

exports.ocr = asyncHandler(async (req, res) => {
    // Check if file is uploaded
    if (!req.files || !req.files.file) {
        throw new CustomError('No file uploaded', 400);
    }

    const { file } = req.files;
    const filePath = path.join(tempDir, file.name); // Set path for the file in temp folder

    await file.mv(filePath); // Move the uploaded file to the temp directory

    const fileType = path.extname(file.name).toLowerCase(); // Get file extension
    let extractedText = '';

    // Preprocess the image using Sharp
    const preprocessImage = async (imagePath) => {
        const preprocessedImagePath = path.join(tempDir, 'preprocessed_image.jpg');
        await sharp(imagePath)
            .resize(1024) // Resize image to enhance text extraction
            .grayscale() // Convert to grayscale
            .threshold(120) // Apply binary thresholding to improve contrast
            .toFile(preprocessedImagePath);
        return preprocessedImagePath;
    };

    // Function to process images using Tesseract OCR
    const processImage = async (imagePath) => {
        const preprocessedImagePath = await preprocessImage(imagePath);

        const { data: { text } } = await Tesseract.recognize(preprocessedImagePath, 'eng', {
            logger: (m) => console.log(m), // To see the progress of OCR
            tessedit_char_whitelist: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/ ', // Limit to Aadhar-related characters
            preserve_interword_spaces: '1', // Ensure spaces are preserved between words
        });
        
        // Clean up preprocessed image
        fs.unlinkSync(preprocessedImagePath);

        return text;
    };

    // Process based on file type
    try {
        if (fileType === '.jpg' || fileType === '.jpeg' || fileType === '.png') {
            extractedText = await processImage(filePath);
        } else {
            throw new CustomError('Unsupported file type. Only images (jpg, png) are supported.', 400);
        }
    } catch (error) {
        fs.unlinkSync(filePath); // Clean up the file if an error occurs
        throw new CustomError('Error processing the file', 500);
    }

    // Debugging - Log the raw extracted text
    console.log('Extracted Text:', extractedText);

    // Extract specific details from the OCR text using Regex
    const aadharNumber = extractedText.match(regexAadharNumber);
    const dob = extractedText.match(regexDOB);

    // Extract name by looking for potential patterns around it
    let name = '';
    const lines = extractedText.split('\n');
    
    // Check for name in specific patterns (can be customized as needed)
    for (let line of lines) {
        if (line.includes('Name') || line.length > 3) {  // Assuming 'Name' keyword or long line might contain name
            name = line.trim();
            break;
        }
    }

    // Cleanup: Delete the uploaded file after processing
    fs.unlinkSync(filePath);

    // Send response with extracted details
    res.status(200).json({
        success: true,
        data: {
            name: name || 'Not found',
            aadharNumber: aadharNumber ? aadharNumber[0] : 'Not found',
            dob: dob ? dob[0] : 'Not found',
        },
    });
});



