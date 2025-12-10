import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 })
    }

    //------------------------------This is for Simple token verification for testing---------------------------------
    if (token === 'admin-temp-token-123') {
      return NextResponse.json({
        message: 'Admin verified',
        admin: {
          id: 'admin-001',
          email: 'admin@comsats.edu.pk',
          full_name: 'System Administrator',
          role: 'super_admin'
        },
        valid: true
      })
    }

    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}