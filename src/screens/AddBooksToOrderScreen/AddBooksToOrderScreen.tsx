import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { makeStyles } from '@rneui/themed';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Book from 'components/Book';
import Button from 'components/Button';
import Text from 'components/Text';

import { Routes } from 'navigation/routes';
import { NavigationType } from 'navigation/types';

import { translations } from 'locales/translations';

import { useAddBooksToOrder } from './hooks/useAddBooksToOrder';

export const AddBooksToOrderScreen = () => {
    const styles = useStyles();
    const { t } = useTranslation();
    const { navigate } =
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

    // If the user has no other books in their list, skip straight to bookshop picker
    useEffect(() => {
        if (!loading && !hasOtherBooks) {
            handleNext();
        }
    }, [loading, hasOtherBooks]);

    return (
        <SafeAreaView edges={['left', 'right', 'top']} style={styles.safeAreaView}>
            <FlatList
                data={otherBooks}
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
                        <View style={styles.initialBookContainer}>
                            <Book
                                title={initialBook.volumeInfo?.title}
                                author={initialBook.volumeInfo?.authors?.join?.(', ')}
                                kind="order"
                                isChecked={false}
                            />
                        </View>
                    </View>
                }
                renderItem={({ item }) => (
                    <Book
                        key={item.id}
                        title={item.volumeInfo?.title}
                        author={item.volumeInfo?.authors?.join?.(', ')}
                        kind="order"
                        isChecked={!selectedIds.has(item.id)}
                        onChange={() => toggleBook(item.id)}
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
        paddingTop: 20,
        paddingBottom: 120,
        gap: 20,
    },
    headerContainer: {
        gap: 10,
    },
    initialBookContainer: {
        opacity: 0.6,
        marginTop: 10,
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
