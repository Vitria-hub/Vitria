import { NextRequest, NextResponse } from 'next/server';
import { ObjectStorageService, ObjectNotFoundError } from '@/server/objectStorage';
import { ObjectPermission } from '@/server/objectAcl';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const objectPath = `/objects/${params.path.join('/')}`;
    const objectStorageService = new ObjectStorageService();
    
    const objectFile = await objectStorageService.getObjectEntityFile(objectPath);
    
    const authHeader = request.headers.get('authorization');
    let userId: string | undefined;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabaseAdmin.auth.getUser(token);
      userId = user?.id;
    }
    
    const canAccess = await objectStorageService.canAccessObjectEntity({
      objectFile,
      userId,
      requestedPermission: ObjectPermission.READ,
    });
    
    if (!canAccess) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    
    const [metadata] = await objectFile.getMetadata();
    const contentType = metadata.contentType || 'application/octet-stream';
    const contentLength = metadata.size;
    
    const chunks: Buffer[] = [];
    const stream = objectFile.createReadStream();
    
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }
    
    const buffer = Buffer.concat(chunks);
    
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': contentLength.toString(),
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error serving object:', error);
    
    if (error instanceof ObjectNotFoundError) {
      return new NextResponse('Not Found', { status: 404 });
    }
    
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
