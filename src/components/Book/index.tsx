import { CheckBox, makeStyles } from '@rneui/themed';
import { useEffect, useState } from 'react';
import {
  Pressable,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';

import Icon from '../Icon';
import Text from '../Text';

interface BookProps extends TouchableOpacityProps {
  author?: string;
  title?: string;
  kind?: 'library' | 'search' | 'order';
  isChecked?: boolean;
  defaultValue?: boolean;
  onChange?: (value: boolean) => void;
}

const truncateTitle = (title: string | undefined, max = 58) => {
  if (!title) return '';
  return title.length > max ? `${title.slice(0, max)}...` : title;
};

const Book = ({
  author = '',
  title,
  kind,
  isChecked,
  defaultValue = false,
  onPress,
  ...props
}: BookProps) => {
  const styles = useStyles();

  const [checked, setChecked] = useState<boolean | undefined>(
    isChecked || defaultValue,
  );

  useEffect(() => {
    setChecked(isChecked);
  }, [isChecked]);

  const handlePressCheck = () => {
    if (props.disabled) return;

    const newValue = !checked;
    setChecked(newValue);
    props.onChange?.(newValue);
  };

  const displayTitle = truncateTitle(title);
  const muted = checked && kind === 'library' ? 'grey' : undefined;

  return (
    <View>
      {kind !== 'order' ? (
        <View style={styles.container}>
          <CheckBox
            disabled={props.disabled}
            containerStyle={{ backgroundColor: 'transparent' }}
            checked={!!checked}
            onPress={handlePressCheck}
            iconType="material-design"
            checkedIcon={
              kind === 'library' ? 'checkbox-outline' : 'plus-circle-outline'
            }
            uncheckedIcon={
              kind === 'library'
                ? 'checkbox-blank-outline'
                : 'plus-circle-outline'
            }
            checkedColor={kind === 'library' ? 'gray' : '#38AD59'}
            uncheckedColor={kind === 'search' ? 'black' : undefined}
            {...props}
          />
          <TouchableOpacity
            style={styles.content}
            onPress={onPress}
            disabled={props.disabled}
          >
            <View style={{ width: '90%', gap: 5 }}>
              <Text text={displayTitle} kind="paragraph" color={muted} />
              <Text text={author} kind="littleText" color={muted} />
            </View>
            <Icon icon="right" color={muted} />
          </TouchableOpacity>
        </View>
      ) : (
        <Pressable
          style={styles.removeBookContainer}
          onPress={handlePressCheck}
          disabled={props.disabled}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: Boolean(checked) }}
        >
          <View style={{ width: '80%' }}>
            <Text text={displayTitle} kind="paragraph" />
            <Text text={author} kind="littleText" />
          </View>
          <View pointerEvents="none">
            <CheckBox
              iconType="material-design"
              checkedIcon="checkbox-outline"
              uncheckedIcon="checkbox-blank-outline"
              checkedColor="#38AD59"
              containerStyle={{ backgroundColor: 'transparent' }}
              checked={!!checked}
            />
          </View>
        </Pressable>
      )}
    </View>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    paddingRight: 20,
    flexDirection: 'row',
    minWidth: '100%',
    alignItems: 'center',
  },

  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  removeBookContainer: {
    minWidth: '100%',
    backgroundColor: '#F8EBDD',
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
  },
}));

export default Book;
