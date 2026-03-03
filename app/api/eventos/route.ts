import { NextRequest, NextResponse } from 'next/server';

/**
 * Handles HTTP POST requests for creating a new academic event.
 * Parses the incoming multipart/form-data payload, extracting text fields and file attachments.
 * * @param {NextRequest} request - The incoming Next.js request object.
 * @returns {NextResponse} A JSON response indicating the status of the operation.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extracting scalar values from the form data
    const titulo = formData.get('titulo');
    const tipo = formData.get('tipo');
    const descricao = formData.get('descricao');
    const dataInicio = formData.get('dataInicio');
    const horaInicio = formData.get('horaInicio');
    const dataFim = formData.get('dataFim');
    const horaFim = formData.get('horaFim');
    const participantes = formData.get('participantes');
    const eventoPago = formData.get('eventoPago');
    
    // Extracting the image file
    const imagem = formData.get('imagem') as File | null;

    // TODO: Implement the actual database insertion logic here using an ORM (e.g., Prisma).
    // TODO: Implement file storage logic (e.g., uploading the image to an S3 bucket or Supabase Storage).

    console.log('Event Data Received:', {
      titulo,
      tipo,
      dataInicio,
      participantes: participantes ? JSON.parse(participantes as string) : [],
      eventoPago: eventoPago === 'true',
      hasImage: !!imagem,
    });

    return NextResponse.json(
      { success: true, message: 'Event successfully created.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing event creation:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error during event creation.' },
      { status: 500 }
    );
  }
}