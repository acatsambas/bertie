import { translations } from 'locales/translations';

import { SECTIONS_IDS } from './constants';

type SectionHeaderItem = {
  type: 'section-header';
  id: string;
  title: string;
};

type BookItem = {
  type: 'book';
  id: string;
  isRead?: boolean;
  volumeInfo?: {
    title?: string;
    authors?: string[];
  };
  [key: string]: any;
};

export type LibraryListItem = SectionHeaderItem | BookItem;

export const categorizeBooks = (rawBooks, t): LibraryListItem[] => {
  const allBooks = rawBooks?.pages.flatMap(page => page.books) ?? [];

  const sections = allBooks.reduce(
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

  const flattened: LibraryListItem[] = [];

  sections.forEach(section => {
    flattened.push({
      type: 'section-header',
      id: section.id,
      title: section.title,
    });

    section.data.forEach(book => {
      flattened.push({
        type: 'book',
        ...book,
      });
    });
  });

  return flattened;
};
