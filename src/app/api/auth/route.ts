import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const { username, password, rememberMe } = await request.json();

    const credRef = doc(db, 'admin', 'credentials');
    const credSnap = await getDoc(credRef);
    
    let validUsername = 'perdens';
    let validPassword = 'Gvs002515';

    if (credSnap.exists()) {
      const data = credSnap.data();
      validUsername = data.username;
      validPassword = data.password;
    } else {
      // Document doesn't exist, create it with defaults
      await setDoc(credRef, {
        username: validUsername,
        password: validPassword,
      });
    }

    if (username === validUsername && password === validPassword) {
      const response = NextResponse.json({ success: true });
      
      const cookieOptions: any = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      };
      
      if (rememberMe) {
        cookieOptions.maxAge = 30 * 24 * 60 * 60; // 30 days
      }

      response.cookies.set('honurs_admin_session', 'authenticated', cookieOptions);
      return response;
    }

    return NextResponse.json({ success: false, message: 'Geçersiz kullanıcı adı veya şifre' }, { status: 401 });
  } catch (error) {
    console.error('Auth API Error:', error);
    return NextResponse.json({ success: false, message: 'Sunucu hatası' }, { status: 500 });
  }
}
