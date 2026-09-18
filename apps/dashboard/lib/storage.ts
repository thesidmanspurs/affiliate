import fs from 'fs';
import path from 'path';

/**
 * Storage Service for Innotek Affiliate Platform
 * Supports Dual-Mode:
 * 1. Local Storage (Default for Dev/Staging): Saves files to apps/dashboard/public/uploads/
 * 2. Google Cloud Storage (GCP): Activates when GCS_BUCKET_NAME and GCP credentials are configured.
 */

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  provider: 'local' | 'gcp';
}

const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/svg+xml',
  'image/gif',
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function saveUploadedFile(
  file: File,
  folder: 'logos' | 'avatars' | 'general' = 'logos'
): Promise<UploadResult> {
  // 1. Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds maximum limit of 5MB (${(file.size / (1024 * 1024)).toFixed(1)}MB)`);
  }

  // 2. Validate MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error(`Invalid file format: ${file.type}. Allowed formats: PNG, JPG, WebP, SVG, GIF.`);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const sanitizedOriginalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const finalFilename = `${folder}-${timestamp}-${randomSuffix}-${sanitizedOriginalName}`;

  // 3. Check for GCP Cloud Storage Configuration
  const gcsBucket = process.env.GCS_BUCKET_NAME;
  const gcpProjectId = process.env.GCP_PROJECT_ID;

  if (gcsBucket && gcpProjectId) {
    try {
      // Dynamic import to avoid missing dependency crashes in environments without @google-cloud/storage
      const { Storage } = eval('require')('@google-cloud/storage');
      const storage = new Storage({
        projectId: gcpProjectId,
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      });

      const bucket = storage.bucket(gcsBucket);
      const gcsFile = bucket.file(`${folder}/${finalFilename}`);

      await gcsFile.save(buffer, {
        metadata: {
          contentType: file.type,
          cacheControl: 'public, max-age=31536000',
        },
      });

      // Public GCS URL or CDN URL
      const publicUrl = process.env.GCS_CDN_URL 
        ? `${process.env.GCS_CDN_URL.replace(/\/$/, '')}/${folder}/${finalFilename}`
        : `https://storage.googleapis.com/${gcsBucket}/${folder}/${finalFilename}`;

      return {
        url: publicUrl,
        filename: finalFilename,
        size: file.size,
        provider: 'gcp',
      };
    } catch (gcpErr: any) {
      console.warn('GCP Storage upload failed, falling back to local storage:', gcpErr?.message || gcpErr);
      // Fall through to local storage
    }
  }

  // 4. Default: Local File System Storage (apps/dashboard/public/uploads/)
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, finalFilename);
  fs.writeFileSync(filePath, buffer);

  const localUrl = `/uploads/${finalFilename}`;

  return {
    url: localUrl,
    filename: finalFilename,
    size: file.size,
    provider: 'local',
  };
}
