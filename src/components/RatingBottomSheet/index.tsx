import React from 'react';
import { Modal, Pressable, View } from 'react-native';
import { makeStyles, useTheme } from '@rneui/themed';
import { useTranslation } from 'react-i18next';

import Text from 'components/Text';

import { RatingValue } from 'api/app/book/mutations/useRateBookMutation';
import { translations } from 'locales/translations';

interface RatingBottomSheetProps {
    visible: boolean;
    currentRating: RatingValue | null;
    onRate: (rating: RatingValue) => void;
    onClose: () => void;
}

const options: { value: RatingValue; labelKey: string }[] = [
    { value: 1, labelKey: translations.library.rating.option1 },
    { value: 2, labelKey: translations.library.rating.option2 },
    { value: 3, labelKey: translations.library.rating.option3 },
    { value: 4, labelKey: translations.library.rating.option4 },
];

const RatingBottomSheet = ({
    visible,
    currentRating,
    onRate,
    onClose,
}: RatingBottomSheetProps) => {
    const styles = useStyles();
    const { theme } = useTheme();
    const { t } = useTranslation();

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <Pressable style={styles.backdrop} onPress={onClose}>
                <Pressable style={styles.sheet} onPress={e => e.stopPropagation()}>
                    <Text
                        kind="header"
                        text={t(translations.library.rating.sheetTitle)}
                    />
                    <View style={styles.optionsList}>
                        {options.map(({ value, labelKey }) => {
                            const isSelected = currentRating === value;
                            return (
                                <Pressable
                                    key={value}
                                    style={[
                                        styles.optionRow,
                                        isSelected && {
                                            backgroundColor: theme.colors.primary,
                                        },
                                    ]}
                                    onPress={() => onRate(value)}
                                >
                                    <Text
                                        kind="paragraph"
                                        text={`${value}. ${t(labelKey)}`}
                                        color={isSelected ? theme.colors.white : undefined}
                                    />
                                    {isSelected && (
                                        <Text kind="paragraph" text="●" color={theme.colors.white} />
                                    )}
                                </Pressable>
                            );
                        })}
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const useStyles = makeStyles(theme => ({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: theme.colors.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
        gap: 20,
    },
    optionsList: {
        gap: 8,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.greyOutline,
    },
}));

export default RatingBottomSheet;
