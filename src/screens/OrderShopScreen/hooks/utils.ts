import { Shop } from 'api/app/types';
import { BookResult } from 'api/google-books/search';
import { UserData } from 'api/types';
import {
  DEFAULT_COUNTRY_CODE,
  getCountryDisplayName,
  resolveCountryCode,
} from 'utils/addressCountry';

type GetOrderMailParams = {
  selectedShop: Shop;
  user: UserData;
  books: BookResult[];
};

const formatBookLine = (book: BookResult) => {
  const title = book.volumeInfo?.title;
  const authors = book.volumeInfo?.authors?.join(', ');
  return authors ? `- ${title} (${authors})` : `- ${title}`;
};

const formatAddress = (address: UserData['address']) =>
  [
    address?.firstLine,
    address?.secondLine,
    [address?.city, address?.postcode].filter(Boolean).join(', '),
    getCountryDisplayName(
      resolveCountryCode(address?.country) ?? DEFAULT_COUNTRY_CODE,
    ),
  ]
    .filter(Boolean)
    .join('\n');

export const getOrderMail = ({
  selectedShop,
  user,
  books,
}: GetOrderMailParams) => ({
  from: {
    name: 'Bertie',
    address: 'acatsambas@bertieapp.com',
  },
  to: [selectedShop.email],
  cc: [user.contactEmail],
  message: {
    subject: 'New Book Order',
    text: `Dear ${selectedShop.name} team,

${user.givenName} ${user.familyName} would like to order these books:
${books.map(formatBookLine).join('\n')}

Their address is:
${formatAddress(user.address)}

Please get in touch with them directly to arrange payment and delivery at ${user.contactEmail}.

Thank you,
Bertie`,
  },
});

export const needsRealContactEmail = (email?: string) =>
  !email || email.includes('@privaterelay.appleid.com');
