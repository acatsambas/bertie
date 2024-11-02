// Import necessary modules
import { authorize } from 'react-native-app-auth';
import { encode as base64Encode } from 'base-64';

// Google OAuth Configuration
const config = {
  clientId:
    '478743508904-u15j767hvl8oo6r8d1vali9kkjufnltf.apps.googleusercontent.com',
  redirectUrl: 'com.bertie.app:/oauth2redirect', // Set up a URL scheme for redirects
  scopes: ['https://www.googleapis.com/auth/gmail.send'],
  serviceConfiguration: {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
  },
};

// Authenticate with Google and get access token
async function authenticateWithGoogle() {
  try {
    const result = await authorize(config);
    return result.accessToken;
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}

// Create email content based on the template
function createEmailTemplate(
  bookshopName: string,
  customerName: string,
  bookName: string,
  bookAuthor: string,
  customerAddress: string,
) {
  return `
Dear ${bookshopName} team,

${customerName} would like to order these books:
${bookName} by ${bookAuthor}

Their address is
${customerAddress}

Please get in touch with them directly to arrange payment and delivery. We have copied their email address to this email.

Thank you,
Bertie
`;
}

// Function to send the email using Gmail API
async function sendEmail(
  accessToken,
  recipientEmail,
  bookshopName,
  customerName,
  bookName,
  bookAuthor,
  customerAddress,
) {
  const emailContent = createEmailTemplate(
    bookshopName,
    customerName,
    bookName,
    bookAuthor,
    customerAddress,
  );
  const rawEmail = base64Encode(
    `To: ${recipientEmail}\nSubject: Book Order\n\n${emailContent}`,
  );

  try {
    const response = await fetch(
      'https://www.googleapis.com/gmail/v1/users/me/messages/send',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          raw: rawEmail,
        }),
      },
    );

    if (response.ok) {
      console.log('Email sent successfully!');
    } else {
      const errorText = await response.text();
      console.error('Error sending email:', errorText);
    }
  } catch (error) {
    console.error('Error in email sending:', error);
  }
}

// Main function to authenticate and send email
export default async function handleSendEmail() {
  try {
    // Step 1: Authenticate and get access token
    const accessToken = await authenticateWithGoogle();

    // Step 2: Send email with template details
    await sendEmail(
      accessToken,
      'cristianm.manolescu96@gmail.com', // Replace with recipient's email
      'Your Bookshop Name', // Replace with the bookshop's name
      'Customer Name', // Replace with the customer's name
      'Book Title', // Replace with the book's title
      'Book Author', // Replace with the book's author
      'Customer Address', // Replace with the customer's address
    );
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}
