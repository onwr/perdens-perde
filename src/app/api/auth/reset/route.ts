import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const { action, username, newPassword } = await request.json();

    const credRef = doc(db, 'admin', 'credentials');
    const credSnap = await getDoc(credRef);
    
    let validUsername = 'perdens';

    if (credSnap.exists()) {
      const data = credSnap.data();
      validUsername = data.username;
    } else {
      // Initialize if it does not exist
      await setDoc(credRef, {
        username: 'perdens',
        password: 'Gvs002515',
      });
    }

    if (action === 'verify_username') {
      if (username === validUsername) {
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ success: false, message: 'Kullanıcı adı hatalı.' }, { status: 400 });
    }

    if (action === 'reset_password') {
      if (username !== validUsername) {
        return NextResponse.json({ success: false, message: 'Kullanıcı adı eşleşmiyor.' }, { status: 400 });
      }
      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json({ success: false, message: 'Yeni şifre en az 6 karakter olmalıdır.' }, { status: 400 });
      }
      
      await updateDoc(credRef, {
        password: newPassword
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: 'Geçersiz eylem.' }, { status: 400 });

  } catch (error) {
    console.error('Auth Reset API Error:', error);
    return NextResponse.json({ success: false, message: 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}
