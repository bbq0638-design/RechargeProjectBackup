import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import IconButton from '../../components/common/iconButton';

export default function BoardItem({ item, onPress }) {

    const isLiked = true;

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            {/* 썸네일 이미지 */}
            <Image source={{ uri: item?.imageUrl }} style={styles.thumbnail}/>
            {/* 제목 */}
            <View style={styles.textContainer}>
                <Text style={styles.title} numberOfLines={1}>
                    {item?.title}
                </Text>
                <Text style={styles.metaInfo}>
                    {item.nickname||item.author} · {item.time}
                </Text>
            </View>

            {/* 하트 */}
            <View style={styles.likeContainer}>
                <View pointerEvents="none">
                    <IconButton
                        type="like"
                        toggled={isLiked}
                        style={styles.iconButtonFix}
                    />
                </View>
                <Text style={styles.likeCount}>{item.likes}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 12,
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 12,
        flexDirection: 'row',
        borderColor: '#eee',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    thumbnail: {
      width: 60,
      height: 60,
      borderRadius: 8,
      backgroundColor: '#ddd',
      marginRight: 12,
    },
    textContainer: {
        flex: 1,
        marginRight: 8,
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111',
        marginBottom: 6,
    },
    metaInfo: {
        fontSize: 12,
        color: '#777',
    },
    likeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 40,
    },
    iconButtonFix: {
        padding: 0,
        margin: 0,
        marginRight: 2,
    },
    likeCount: {
        fontSize: 12,
        color: '#555',
        marginLeft: 4,
    },
});