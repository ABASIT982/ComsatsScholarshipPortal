import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, access } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;
    const regno = formData.get('regno') as string;

    console.log('📤 Upload request:', { type, regno, fileName: file?.name });

    // Validate required fields
    if (!file || !type || !regno) {
      return NextResponse.json(
        { error: 'Missing required fields: file, type, and regno are required' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const allowedDocumentTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    
    const allowedTypes = type === 'avatar' ? allowedImageTypes : allowedDocumentTypes;
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate file size (5MB for images, 10MB for documents)
    const maxSize = type === 'avatar' ? 5 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Maximum size: ${maxSize / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine file path based on type
    let filePath: string;
    let fileName: string;

    if (type === 'avatar') {
      // Avatar: store in avatars folder with regno as filename
      const extension = file.type.split('/')[1] || 'jpg';
      fileName = `${regno}.${extension}`;
      filePath = join(process.cwd(), 'public', 'uploads', 'avatars', fileName);
    } else {
      // Documents: store in documents/regno/ folder
      const documentTypes = [
        'student_cnic_front', 'student_cnic_back',
        'father_cnic_front', 'father_cnic_back', 
        'student_card_front', 'student_card_back'
      ];

      if (!documentTypes.includes(type)) {
        return NextResponse.json(
          { error: `Invalid document type. Allowed: ${documentTypes.join(', ')}` },
          { status: 400 }
        );
      }

      const extension = file.type === 'application/pdf' ? 'pdf' : file.type.split('/')[1];
      fileName = `${type}.${extension}`;
      const studentFolder = join(process.cwd(), 'public', 'uploads', 'documents', regno);
      
      // Create student folder if it doesn't exist
      if (!existsSync(studentFolder)) {
        await mkdir(studentFolder, { recursive: true });
        console.log('📁 Created folder:', studentFolder);
      }
      
      filePath = join(studentFolder, fileName);
    }

    // Ensure parent directory exists
    const parentDir = join(filePath, '..');
    if (!existsSync(parentDir)) {
      await mkdir(parentDir, { recursive: true });
    }

    // Write file
    await writeFile(filePath, buffer);
    console.log('✅ File saved:', filePath);

    // Return public URL for accessing the file
    const publicUrl = type === 'avatar' 
      ? `/uploads/avatars/${fileName}`
      : `/uploads/documents/${regno}/${fileName}`;

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      url: publicUrl,
      fileName: fileName,
      fileSize: file.size
    });

  } catch (error) {
    console.error('❌ Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file: ' + (error as Error).message },
      { status: 500 }
    );
  }
}