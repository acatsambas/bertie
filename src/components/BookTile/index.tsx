import { Icon as RNEIcon, makeStyles, useTheme } from '@rneui/themed';
import React, { useState } from 'react';
import {
  Image,
  type ImageLoadEvent,
  Pressable,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';

import Text from 'components/Text';

export const TILE_COLUMN_GAP = 20;
export const TILE_ROW_GAP = 28;
/** Horizontal room inside the scrollport so cover shadows aren't clipped by overflowX:hidden. */
export const TILE_SHADOW_PAD = 20;
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

// Mirrors the CodePen CustomEase "bookEase": cubic-bezier(0.25, 1, 0.5, 1).
const BOOK_EASE = 'cubic-bezier(0.25, 1, 0.5, 1)';
const HOVER_MS = 700;

/** Web-only CSS that RN's ViewStyle type doesn't model. */
type WebStyle = ViewStyle & Record<string, string | number | undefined>;

const pageTransition: WebStyle = {
  transition: `transform ${HOVER_MS}ms ease-in-out`,
};

const imageRest: WebStyle = {
  transformOrigin: 'left center',
  transition: `transform ${HOVER_MS}ms ${BOOK_EASE}, box-shadow ${HOVER_MS}ms ${BOOK_EASE}`,
  transform: 'perspective(2000px) rotateY(0deg) translateX(0px) scaleX(1)',
  boxShadow:
    '0 8px 16px rgba(0, 0, 0, 0.14), 0 16px 28px -12px rgba(0, 0, 0, 0.2)',
};

const imageHover: WebStyle = {
  transform: 'perspective(2000px) rotateY(-12deg) translateX(0px) scaleX(0.97)',
  boxShadow:
    '6px 8px 16px rgba(0, 0, 0, 0.18), 12px 14px 28px -10px rgba(0, 0, 0, 0.2)',
};

const effectWeb: WebStyle = {
  backgroundImage:
    'linear-gradient(90deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%)',
  transition: `margin-left ${HOVER_MS}ms ${BOOK_EASE}`,
};

const lightWeb: WebStyle = {
  backgroundImage:
    'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.5) 100%)',
  mixBlendMode: 'overlay',
  transition: `opacity ${HOVER_MS}ms ${BOOK_EASE}`,
};

/** The control in the cover's corner: read status on My list, on-your-list on Discover. */
export interface BookTileToggle {
  checked: boolean;
  /** A material-design icon name. */
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
  /** Soften finished books when Current and Past share one grid. */
  muted?: boolean;
}

/** One book in a desktop grid: 3D cover shell, corner toggle, title and author. */
const BookTile = ({
  bookId,
  title = '',
  author = '',
  width,
  onPress,
  toggle,
  muted = false,
}: BookTileProps) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const [hasCover, setHasCover] = useState(true);
  const [hovered, setHovered] = useState(false);
  const frontColor = fallbackColor(bookId);

  const handleLoad = ({ nativeEvent }: ImageLoadEvent) => {
    // react-native-web passes the DOM load event through as nativeEvent, so
    // the size is on its target <img> rather than on `source`.
    const img = (
      nativeEvent as unknown as {
        target?: { naturalWidth?: number; naturalHeight?: number };
      }
    ).target;
    const loadWidth = nativeEvent.source?.width ?? img?.naturalWidth;
    const loadHeight = nativeEvent.source?.height ?? img?.naturalHeight;

    if (isGooglePlaceholder(loadWidth, loadHeight)) {
      setHasCover(false);
    }
  };

  return (
    <View style={[{ width, overflow: 'visible' }, muted && styles.muted]}>
      <View
        style={styles.bookSlot}
        {...({
          onMouseEnter: () => setHovered(true),
          onMouseLeave: () => setHovered(false),
        } as object)}
      >
        <View style={styles.cover}>
          <View style={styles.backCover} pointerEvents="none" />
          <View style={styles.inside} pointerEvents="none">
            <View
              style={[
                styles.page,
                pageTransition,
                { transform: [{ translateX: hovered ? 4 : 0 }] },
              ]}
            />
            <View
              style={[
                styles.page,
                pageTransition,
                { transform: [{ translateX: hovered ? 2 : 0 }] },
              ]}
            />
            <View style={[styles.page, pageTransition]} />
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={title}
            onPress={onPress}
            style={[styles.imageShell, imageRest, hovered ? imageHover : null]}
          >
            {/* Clip the art only — shadow lives on the shell so it isn't cut off. */}
            <View style={styles.imageClip}>
              <View style={[styles.front, { backgroundColor: frontColor }]}>
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
              </View>
              <View
                pointerEvents="none"
                style={[
                  styles.effect,
                  effectWeb,
                  hovered ? styles.effectHovered : null,
                ]}
              />
              <View
                pointerEvents="none"
                style={[
                  styles.light,
                  lightWeb,
                  hovered ? styles.lightHovered : null,
                ]}
              />
            </View>
          </Pressable>
        </View>
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: toggle.checked }}
          accessibilityLabel={toggle.label}
          hitSlop={6}
          onPress={toggle.onPress}
          style={styles.toggle}
        >
          <RNEIcon
            type="material-design"
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
  muted: { opacity: 0.65 },
  // Outer cell keeps the grid width; inset gives the drop-shadow room so
  // FlatList / neighbouring tiles don't clip the left edge.
  bookSlot: {
    position: 'relative' as const,
    overflow: 'visible' as const,
    paddingTop: 4,
    paddingHorizontal: 4,
    paddingBottom: 16,
  },
  cover: {
    position: 'relative' as const,
    aspectRatio: 2 / 3,
    overflow: 'visible' as const,
  },
  backCover: {
    position: 'absolute' as const,
    width: '96%' as const,
    height: '96%' as const,
    top: '2%' as const,
    left: '2%' as const,
    backgroundColor: '#111',
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    zIndex: 1,
  },
  inside: {
    position: 'absolute' as const,
    width: '90%' as const,
    height: '94%' as const,
    top: '3%' as const,
    left: '5%' as const,
    zIndex: 2,
    overflow: 'visible' as const,
  },
  page: {
    position: 'absolute' as const,
    top: 0,
    right: 0,
    width: '98%' as const,
    height: '100%' as const,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    zIndex: 2,
  },
  // Shadow + 3D transform live here — must stay overflow:visible.
  imageShell: {
    position: 'absolute' as const,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    borderBottomLeftRadius: 2,
    overflow: 'visible' as const,
    zIndex: 3,
  },
  imageClip: {
    flex: 1,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    borderBottomLeftRadius: 2,
    overflow: 'hidden' as const,
  },
  front: {
    flex: 1,
    justifyContent: 'flex-end' as const,
    padding: 12,
  },
  effect: {
    position: 'absolute' as const,
    width: 20,
    height: '100%' as const,
    marginLeft: 16,
    top: 0,
    borderLeftWidth: 2,
    borderLeftColor: '#00000010',
    zIndex: 5,
  },
  effectHovered: {
    marginLeft: 10,
  },
  light: {
    ...StyleSheet.absoluteFill,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    borderBottomLeftRadius: 2,
    opacity: 0.1,
    zIndex: 4,
  },
  lightHovered: {
    opacity: 0.2,
  },
  fallbackTitle: {
    fontSize: 17,
    lineHeight: 21,
  },
  toggle: {
    position: 'absolute' as const,
    top: 12,
    right: 12,
    zIndex: 20,
    padding: 2,
    borderRadius: 6,
    backgroundColor: 'rgba(253, 249, 246, 0.92)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.25)',
  },
  caption: {
    marginTop: 8,
    paddingHorizontal: 4,
    gap: 3,
  },
  title: {
    fontSize: 17,
    lineHeight: 21,
  },
}));

export default BookTile;
