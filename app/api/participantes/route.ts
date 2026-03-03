import { NextResponse } from 'next/server';

/**
 * Interface defining the expected data structure for an event participant.
 * This contract should be aligned with the future database schema.
 */
interface Participant {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  paymentStatus: 'PAGO' | 'PENDENTE';
  isCheckedIn: boolean;
}

/**
 * Handles HTTP GET requests to retrieve the dynamic list of participants.
 * Currently returns an empty array, acting as a placeholder until the database integration is finalized.
 * * @returns {NextResponse} JSON response containing the participant array.
 */
export async function GET() {
  try {
    // TODO: Implement the actual database query here in the future.
    // Example using an ORM: const participants = await prisma.participant.findMany();
    
    const participants: Participant[] = []; // Starts empty, awaiting real data

    return NextResponse.json(participants, { status: 200 });
  } catch (error) {
    // Logs the error internally for debugging purposes without exposing sensitive data to the client.
    console.error('Data fetching error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error during data retrieval.' },
      { status: 500 }
    );
  }
}