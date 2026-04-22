import { NextResponse } from 'next/server';
import { ScholarshipBot } from '@/lib/chatbot-logic';

// Create a single instance of the bot (so it doesn't reload every time)
const bot = new ScholarshipBot();

export async function POST(request: Request) {
  try {
    // Get the message from the request body
    const body = await request.json();
    const { message } = body;
    
    // Validate message exists
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { 
          error: 'Message is required',
          response: 'Please ask a valid question about scholarships.'
        },
        { status: 400 }
      );
    }
    
    // Trim and check if message is empty
    const trimmedMessage = message.trim();
    if (trimmedMessage.length === 0) {
      return NextResponse.json(
        { 
          error: 'Empty message',
          response: 'Please ask me something about scholarships!'
        },
        { status: 400 }
      );
    }
    
    // Get response from chatbot
    const botResponse = bot.getResponse(trimmedMessage);
    
    // Return the response
    return NextResponse.json({
      success: true,
      response: botResponse,
      timestamp: new Date().toISOString(),
      messageLength: trimmedMessage.length
    });
    
  } catch (error) {
    console.error('Chatbot API Error:', error);
    
    // Return a friendly error message
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        response: 'Sorry, I encountered an error. Please try again later.'
      },
      { status: 500 }
    );
  }
}

// Optional: Add GET method for testing
export async function GET() {
  return NextResponse.json({
    status: 'active',
    message: 'Scholarship Chatbot API is running',
    version: '1.0.0',
    endpoints: {
      POST: '/api/chat - Send a message to the chatbot'
    }
  });
}