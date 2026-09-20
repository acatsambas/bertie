import { makeStyles, useTheme } from '@rneui/themed';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  Modal,
  Pressable,
  TouchableOpacity,
  View,
} from 'react-native';

import Icon from 'components/Icon';
import Text from 'components/Text';
import { translations } from 'locales/translations';

import { LibraryFilter } from '../hooks/utils';

const OPTIONS: LibraryFilter[] = ['both', 'current', 'past'];

const labelKey = (filter: LibraryFilter) => {
  if (filter === 'current') return translations.library.current;
  if (filter === 'past') return translations.library.past;
  return translations.library.both;
};

interface LibraryShelfFilterProps {
  value: LibraryFilter;
  onChange: (filter: LibraryFilter) => void;
}

/**
 * Button + menu that picks which shelves My list shows: Current, Past, or Both.
 */
export const LibraryShelfFilter = ({
  value,
  onChange,
}: LibraryShelfFilterProps) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const buttonRef = useRef<View>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });

  const openMenu = () => {
    buttonRef.current?.measureInWindow((x, y, width, height) => {
      const windowWidth = Dimensions.get('window').width;
      setMenuPosition({
        top: y + height + 4,
        right: Math.max(12, windowWidth - (x + width)),
      });
      setMenuVisible(true);
    });
  };

  const select = (filter: LibraryFilter) => {
    onChange(filter);
    setMenuVisible(false);
  };

  return (
    <>
      <View ref={buttonRef} collapsable={false}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t(translations.library.filter)}
          onPress={openMenu}
          style={state => [
            styles.button,
            (state as { hovered?: boolean }).hovered && styles.buttonHovered,
          ]}
        >
          <Icon icon="filter" size={18} color={theme.colors.secondary} />
          <Text
            kind="description"
            text={t(labelKey(value))}
            color={theme.colors.secondary}
          />
          <Icon icon="down" size={16} color={theme.colors.grey2} />
        </Pressable>
      </View>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View
            style={[
              styles.menuCard,
              { top: menuPosition.top, right: menuPosition.right },
            ]}
          >
            {OPTIONS.map(option => {
              const selected = option === value;

              return (
                <TouchableOpacity
                  key={option}
                  accessibilityRole="menuitem"
                  accessibilityState={{ selected }}
                  style={[styles.menuItem, selected && styles.menuItemSelected]}
                  onPress={() => select(option)}
                >
                  <Text
                    kind="paragraph"
                    text={t(labelKey(option))}
                    color={
                      selected ? theme.colors.secondary : theme.colors.grey2
                    }
                    style={selected ? styles.menuItemLabelSelected : undefined}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const useStyles = makeStyles(theme => ({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: theme.colors.grey0,
  },
  buttonHovered: { opacity: 0.9 },
  menuOverlay: { flex: 1 },
  menuCard: {
    position: 'absolute',
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 4,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
    minWidth: 160,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  menuItemSelected: {
    backgroundColor: theme.colors.grey0,
  },
  menuItemLabelSelected: {
    fontFamily: 'Commissioner_600SemiBold',
  },
}));

export default LibraryShelfFilter;
