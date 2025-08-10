export const getOrderMail = ({ selectedShop, user, books }) => ({
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
${books.map(book => `- ${book?.volumeInfo?.title} (${book?.volumeInfo?.authors?.join?.(', ')})`).join('\n')}

Their address is:
${user.address?.firstLine && user.address.firstLine}
${user.address?.secondLine && user.address.secondLine}
${user.address?.city && `${user.address.city}, `}${user.address?.postcode}
${user.address?.country ? user.address.country : 'United Kingdom'}

Please get in touch with them directly to arrange payment and delivery at ${user.contactEmail}.

Thank you,
Bertie`,
  },
});

export const isInvalidEmail = (email?: string) =>
  !email || email.includes('@privaterelay.appleid.com');
