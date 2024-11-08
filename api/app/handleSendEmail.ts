import { GoogleSignin } from '@react-native-google-signin/google-signin';
import axios from 'axios';
import base64 from 'base-64';

// Initialize Google Sign-In
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_ANDROID_BERTIE_WEB_CLIENT_ID, // Replace with your OAuth Client ID from Google Cloud
  offlineAccess: true,
  scopes: ['https://www.googleapis.com/auth/gmail.send'],
});

async function signInWithGoogle() {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    const tokens = await GoogleSignin.getTokens();
    return tokens.accessToken;
  } catch (error) {
    console.error('Error during Google Sign-In:', error);
    throw error;
  }
}

async function sendEmail(
  accessToken,
  bookshopName,
  customerName,
  bookName,
  bookAuthor,
  customerAddress,
  customerEmail,
) {
  // Email content
  const emailContent = `
    Dear ${bookshopName} team,

    ${customerName} would like to order these books:
    ${bookName} by ${bookAuthor}

    Their address is:
    ${customerAddress}

    Please get in touch with them directly to arrange payment and delivery. We have copied their email address to this email.

    Thank you,
    Bertie;
  `;

  const message = [
    `To: ${bookshopName}@gmail.com`,
    `Cc: ${customerEmail}`,
    'Subject: Book Order',
    '',
    emailContent,
  ].join('\n');

  // Encode the message in Base64 format
  const encodedMessage = base64
    .encode(message)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  try {
    const response = await axios.post(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
      {
        raw: encodedMessage,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );
    console.log('Email sent successfully:', response.data);
  } catch (error) {
    console.error(
      'Error sending email:',
      error.response ? error.response.data : error.message,
    );
  }
}

export async function handleSendEmail() {
  try {
    // Sign in to get the access token
    const accessToken = await signInWithGoogle();

    // Send the email with sample data
    await sendEmail(
      accessToken,
      'Bookshop Name', // Bookshop name placeholder
      'Customer Name', // Customer name placeholder
      'Book Title', // Book name placeholder
      'Book Author', // Book author placeholder
      'Customer Address', // Customer address placeholder
      'cristianm.manolescu96@gmail.com', // Customer email placeholder
    );
  } catch (error) {
    console.error("Couldn't send email:", error);
  }
}
