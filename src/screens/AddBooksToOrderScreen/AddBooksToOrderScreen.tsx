import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CheckBox, makeStyles, useTheme } from '@rneui/themed';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from 'components/Button';
import Icon from 'components/Icon';
import Text from 'components/Text';

import { Routes } from 'navigation/routes';
import { NavigationType } from 'navigation/types';

import { translations } from 'locales/translations';

import { useAddBooksToOrder } from './hooks/useAddBooksToOrder';

const BookSelectItem = ({
    title,
    author,
    isSelected,
    onToggle,
}: {
    title?: string;
    author?: string;
    isSelected: boolean;
    onToggle?: () => void;
}) => {
    const styles = useStyles();
    const { theme } = useTheme();

    return (
        <TouchableOpacity
            style={[
                styles.bookCard,
                isSelected && { borderColor: theme.colors.primary, borderWidth: 2 },
            ]}
            onPress={onToggle}
            activeOpacity={onToggle ? 0.7 : 1}
            disabled={!onToggle}
        >
            <View style={styles.bookInfo}>
                <Text
                    text={title?.length > 50 ? `${title.slice(0, 50)}...` : title || ''}
                    kind="paragraph"
                />
                <Text text={author || ''} kind="littleText" />
            </View>
            {onToggle && (
                <CheckBox
                    checked={isSelected}
                    onPress={onToggle}
                    iconType="material-community"
                    checkedIcon="checkbox-outline"
                    uncheckedIcon="checkbox-blank-outline"
                    checkedColor={theme.colors.primary}
                    containerStyle={{ backgroundColor: 'transparent', padding: 0 }}
                />
            )}
        </TouchableOpacity>
    );
};

export const AddBooksToOrderScreen = () => {
    const styles = useStyles();
    const { t } = useTranslation();
    const { navigate, replace, goBack } =
        useNavigation<
            StackNavigationProp<NavigationType, typeof Routes.ORDER_00_ADD_BOOKS>
        >();

    const {
        initialBook,
        otherBooks,
        hasOtherBooks,
        selectedIds,
        toggleBook,
        selectedBooks,
        fetchMoreBooks,
        loading,
    } = useAddBooksToOrder();

    const handleNext = () => {
        navigate(Routes.ORDER_02_ORDER_SHOP, {
            books: selectedBooks,
        });
    };

    // With nothing to choose between, this screen has nothing to show, so skip
    // to the bookshop picker. It has to `replace` rather than `navigate`:
    // pushing would leave an empty screen in the stack that Back returns to,
    // and leave this component mounted underneath the rest of the order flow,
    // where a later refetch of the book list would re-run this effect and yank
    // the user back to the picker from wherever they had got to. The ref keeps
    // it to one attempt even before the replace unmounts us.
    const hasSkipped = useRef(false);

    useEffect(() => {
        if (loading || hasOtherBooks || hasSkipped.current) return;

        hasSkipped.current = true;
        replace(Routes.ORDER_02_ORDER_SHOP, { books: selectedBooks });
    }, [loading, hasOtherBooks, selectedBooks, replace]);

    return (
        <SafeAreaView edges={['left', 'right', 'top']} style={styles.safeAreaView}>
            <View style={styles.backHeader}>
                <Icon icon="back" onPress={() => goBack()} />
            </View>
            <FlatList
                data={otherBooks}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View style={styles.headerContainer}>
                        <Text
                            text={t(translations.order.addMoreTitle)}
                            kind="bigHeader"
                        />
                        <Text
                            text={t(translations.order.addMoreDescription)}
                            kind="paragraph"
                        />
                        <View style={styles.sectionLabel}>
                            <Text text="In your order" kind="description" />
                        </View>
                        <BookSelectItem
                            title={initialBook.volumeInfo?.title}
                            author={initialBook.volumeInfo?.authors?.join?.(', ')}
                            isSelected
                        />
                        <View style={styles.sectionLabel}>
                            <Text text="Also in your list" kind="description" />
                        </View>
                    </View>
                }
                renderItem={({ item }) => (
                    <BookSelectItem
                        title={item.volumeInfo?.title}
                        author={item.volumeInfo?.authors?.join?.(', ')}
                        isSelected={selectedIds.has(item.id)}
                        onToggle={() => toggleBook(item.id)}
                    />
                )}
                onEndReached={fetchMoreBooks}
                onEndReachedThreshold={0.5}
            />
            <View style={styles.bottomArea}>
                <Button
                    kind="primary"
                    text={t(translations.order.next)}
                    onPress={handleNext}
                />
            </View>
        </SafeAreaView>
    );
};

const useStyles = makeStyles(theme => ({
    safeAreaView: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: theme.colors.white,
    },
    container: {
        paddingTop: 10,
        paddingBottom: 120,
        gap: 12,
    },
    backHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 5,
    },
    headerContainer: {
        gap: 8,
        marginBottom: 4,
    },
    sectionLabel: {
        marginTop: 12,
        marginBottom: 4,
    },
    bookCard: {
        backgroundColor: '#F8EBDD',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    bookInfo: {
        flex: 1,
        gap: 4,
        marginRight: 8,
    },
    bottomArea: {
        backgroundColor: theme.colors.white,
        justifyContent: 'flex-end',
        paddingVertical: 20,
        gap: 20,
        position: 'absolute',
        bottom: 0,
        right: 20,
        left: 20,
    },
}));

export default AddBooksToOrderScreen;
