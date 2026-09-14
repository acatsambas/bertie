import { Icon as RNEIcon, makeStyles, useTheme } from '@rneui/themed';
import React, { useState } from 'react';
import {
  Image,
  ImageLoadEventData,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import Text from 'components/Text';

export const TILE_COLUMN_GAP = 20;
export const TILE_ROW_GAP = 28;
const MIN_TILE_WIDTH = 150;

/** How many tiles fit across `width`, and how wide each one is. */
export const tileGrid = (width: number) => {
  const columns = Math.max(
    2,
    Math.floor((width + TILE_COLUMN_GAP) / (MIN_TILE_WIDTH + TILE_COLUMN_GAP)),
  );
  // Floored so rounding can never push the last tile in a row onto the next.
  const tileWidth = Math.floor(
    (width - TILE_COLUMN_GAP * (columns - 1)) / columns,
  );
  return { columns, tileWidth };
};

// Books in Bertie are Google Books volumes, so a cover can come straight from
// Google's image endpoint by volume id, with no API call and no key.
const coverUri = (bookId: string) =>
  `https://books.google.com/books/content?id=${encodeURIComponent(bookId)}&printsec=frontcover&img=1&zoom=1&source=gbs_api`;

// For a volume with no cover Google doesn't return an error, it returns a
// 128×170 "image not available" picture, so that exact size means no cover.
const isGooglePlaceholder = (width?: number, height?: number) =>
  width === 128 && height === 170;

// Tiles for books without a cover, picked per book so a shelf of them isn't
// one flat colour.
const FALLBACK_COLORS = [
  '#565EAF',
  '#A85C42',
  '#3D4A5C',
  '#6B3F53',
  '#8C6B2E',
  '#4B5A3A',
  '#7A4B4B',
  '#2E2E2E',
];

const fallbackColor = (bookId: string) => {
  let hash = 0;
  for (let i = 0; i < bookId.length; i++) {
    hash = (hash * 31 + bookId.charCodeAt(i)) | 0;
  }
  return FALLBACK_COLORS[Math.abs(hash) % FALLBACK_COLORS.length];
};

/** The control in the cover's corner: read status on My list, on-your-list on Discover. */
export interface BookTileToggle {
  checked: boolean;
  /** A material-community icon name. */
  icon: string;
  color: string;
  label: string;
  onPress(): void;
}

interface BookTileProps {
  bookId: string;
  title?: string;
  author?: string;
  width: number;
  onPress(): void;
  toggle: BookTileToggle;
}

/** One book in a desktop grid: its cover, a corner toggle, title and author. */
const BookTile = ({
  bookId,
  title = '',
  author = '',
  width,
  onPress,
  toggle,
}: BookTileProps) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const [hasCover, setHasCover] = useState(true);

  const handleLoad = ({
    nativeEvent,
  }: NativeSyntheticEvent<ImageLoadEventData>) => {
    // react-native-web passes the DOM load event through as nativeEvent, so
    // the size is on its target <img> rather than on `source`.
    const img = (
      nativeEvent as unknown as {
        target?: { naturalWidth?: number; naturalHeight?: number };
      }
    ).target;
    const width = nativeEvent.source?.width ?? img?.naturalWidth;
    const height = nativeEvent.source?.height ?? img?.naturalHeight;

    if (isGooglePlaceholder(width, height)) {
      setHasCover(false);
    }
  };

  return (
    <View style={{ width }}>
      <View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={title}
          onPress={onPress}
          style={state => [
            styles.cover,
            { backgroundColor: fallbackColor(bookId) },
            (state as { hovered?: boolean }).hovered && styles.coverHovered,
          ]}
        >
          {/* Sits under the cover image, so it shows while the image loads
              and stays when there turns out to be no cover. */}
          <Text
            kind="header"
            text={title}
            numberOfLines={5}
            color={theme.colors.white}
            style={styles.fallbackTitle}
          />
          {hasCover && (
            <Image
              source={{ uri: coverUri(bookId) }}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
              onLoad={handleLoad}
              onError={() => setHasCover(false)}
            />
          )}
        </Pressable>
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: toggle.checked }}
          accessibilityLabel={toggle.label}
          hitSlop={6}
          onPress={toggle.onPress}
          style={styles.toggle}
        >
          <RNEIcon
            type="material-community"
            name={toggle.icon}
            size={20}
            color={toggle.color}
          />
        </Pressable>
      </View>
      <Pressable onPress={onPress} style={styles.caption}>
        <Text
          kind="header"
          text={title}
          numberOfLines={2}
          style={styles.title}
        />
        {!!author && (
          <Text
            kind="littleText"
            text={author}
            numberOfLines={1}
            color={theme.colors.grey2}
          />
        )}
      </Pressable>
    </View>
  );
};

const useStyles = makeStyles(() => ({
  cover: {
    aspectRatio: 2 / 3,
    borderRadius: 6,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: 12,
    boxShadow:
      '0 1px 2px rgba(0, 0, 0, 0.12), 0 8px 16px -10px rgba(0, 0, 0, 0.35)',
  },
  coverHovered: {
    transform: [{ translateY: -2 }],
    boxShadow:
      '0 2px 4px rgba(0, 0, 0, 0.14), 0 14px 24px -12px rgba(0, 0, 0, 0.4)',
  },
  fallbackTitle: {
    fontSize: 17,
    lineHeight: 21,
  },
  toggle: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 2,
    borderRadius: 6,
    backgroundColor: 'rgba(253, 249, 246, 0.92)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.25)',
  },
  caption: {
    marginTop: 10,
    gap: 3,
  },
  title: {
    fontSize: 17,
    lineHeight: 21,
  },
}));

export default BookTile;
