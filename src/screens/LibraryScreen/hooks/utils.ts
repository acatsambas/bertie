import { SECTIONS_IDS } from 'screens/LibraryScreen/hooks/useLibrary';

import { translations } from 'locales/translations';

export const categorizeBooks = (rawBooks, t) => {
  const allBooks = rawBooks?.pages.flatMap(page => page.books) ?? [];
  return allBooks.reduce(
    (acc, book) => {
      if (book.isRead) {
        acc[1].data.push(book);
      } else {
        acc[0].data.push(book);
      }
      return acc;
    },
    [
      {
        id: SECTIONS_IDS.CURRENT,
        title: t(translations.library.current),
        data: [],
      },
      {
        id: SECTIONS_IDS.PAST,
        title: t(translations.library.past),
        data: [],
      },
    ],
  );
};