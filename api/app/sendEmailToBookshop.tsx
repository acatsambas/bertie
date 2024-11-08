import { GoogleSignin } from '@react-native-google-signin/google-signin';
import base64 from 'base-64';

// Initialize Google Sign-In
GoogleSignin.configure({
  scopes: ['https://www.googleapis.com/auth/gmail.send'], // Scope to send Gmail
  webClientId: process.env.EXPO_PUBLIC_ANDROID_BERTIE_WEB_CLIENT_ID,
  // '478743508904-u15j767hvl8oo6r8d1vali9kkjufnltf.apps.googleusercontent.com',
});

export const sendEmailToBookshop = async (
  bookshopName: string,
  customerName: string,
  bookName: string,
  bookAuthor: string,
  customerAddress: string,
  recipientEmail: string,
) => {
  try {
    // Check if the user is signed in
    const userInfo = await GoogleSignin.getCurrentUser();
    if (!userInfo) {
      throw new Error('User not signed in');
    }

    // await GoogleSignin.revokeAccess();
    // await GoogleSignin.signIn();

    // Get the access token
    const tokens = await GoogleSignin.getTokens();
    const accessToken = tokens.accessToken;

    // Create the email content
    const emailContent = `
      From: "Bertie App" <acatsambas@bertieapp.com>
      To: ${recipientEmail}
      Subject: New Book Order

      Dear ${bookshopName} team,

      ${customerName} would like to order these books:
      ${bookName} by ${bookAuthor}

      Their address is:
      ${customerAddress}

      Please get in touch with them directly to arrange payment and delivery. We have copied their email address to this email.

      Thank you,
      Bertie
    `;

    // Encode the email content in Base64 for Gmail API
    const encodedEmail = base64
      .encode(emailContent)
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    // Send the email via Gmail API
    const response = await fetch(
      'https://www.googleapis.com/gmail/v1/users/me/messages/send',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          raw: encodedEmail,
        }),
      },
    );

    if (response.ok) {
      console.log('Email sent successfully!');
      return 'Email sent successfully!';
    } else {
      const errorData = await response.json();
      console.error('Error sending email:', errorData.error.message);
      return `Error sending email: ${errorData.error.message}`;
    }
  } catch (error) {
    console.error('Error:', error);
    return `Error: ${error.message}`;
  }
};
