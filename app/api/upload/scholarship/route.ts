import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const scholarshipId = formData.get('scholarshipId') as string;
    const studentRegno = formData.get('studentRegno') as string;
    const fieldName = formData.get('fieldName') as string;

    console.log('📤 Scholarship Upload:', { scholarshipId, studentRegno, fieldName, fileCount: files.length });

    if (!files || files.length === 0 || !scholarshipId || !studentRegno || !fieldName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // CREATE FOLDER STRUCTURE LIKE DOCUMENTS: /uploads/scholarships/FA21-BCS-001/
    const studentFolder = join(process.cwd(), 'public', 'uploads', 'scholarships', studentRegno);
    if (!existsSync(studentFolder)) {
      await mkdir(studentFolder, { recursive: true });
      console.log('📁 Created student scholarship folder:', studentFolder);
    }

    const uploadedFiles = [];

    for (const file of files) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        console.log(`❌ Invalid file type: ${file.type}`);
        continue;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        console.log(`❌ File too large: ${file.size}`);
        continue;
      }

      // Convert file to buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate filename LIKE DOCUMENTS: fieldName_timestamp.extension
      const timestamp = Date.now();
      const originalName = file.name.replace(/\s+/g, '_');
      const fileExtension = file.type === 'application/pdf' ? 'pdf' : file.type.split('/')[1];
      const fileName = `${fieldName}_${timestamp}.${fileExtension}`;
      const filePath = join(studentFolder, fileName);

      // Write file to student's scholarship folder (like documents)
      await writeFile(filePath, buffer);

      // Store file info WITH CORRECT URL PATH
      uploadedFiles.push({
  name: file.name,
  url: `/uploads/scholarships/${studentRegno}/${fileName}`, // This should match your folder
  type: file.type,
  size: file.size,
  fieldName: fieldName,
  uploadedAt: new Date().toISOString()
});

      console.log('✅ File saved to student scholarship folder:', filePath);
    }

    return NextResponse.json({
      success: true,
      message: `${uploadedFiles.length} files uploaded successfully`,
      files: uploadedFiles
    });

  } catch (error) {
    console.error('❌ Scholarship upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}