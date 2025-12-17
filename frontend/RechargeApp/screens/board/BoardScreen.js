import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, ActivityIndicator} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import BoardItem from '../../components/board/BoardItem';
import SelectableButton from '../../components/common/SelectableButton';
import Button from '../../components/common/Button';
import IconButton from '../../components/common/iconButton';

import {getCategories, getPosts} from '../../utils/CommunityApi';
import { API_BASE_URL } from '../../utils/api';

export default function BoardScreen({navigation}) {
    
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('전체');

    const [initialLoading, setInitialLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    //데이터 불러오기 함수
    const fetchData = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else if (posts.length === 0) setInitialLoading(true);

        try {
            //카테고리 가져오기
            const catRes = await getCategories();
            const categoryNames = ['전체', ...catRes.map(c => c.categoryName)];
            setCategories(categoryNames);

            //게시글 목록 가져오기
            const postsData = await getPosts();
            setPosts(postsData);
            } catch (error) {
                console.error('데이터 로딩 실패:', error);
            } finally {
                if (isRefresh) setRefreshing(false);
                else setInitialLoading(false);
            }
    };
        //화면이 포커스 될 때마다 데이터 새로고침(글쓰기 후 돌아올 때 반영)
        useFocusEffect(
            useCallback(() => {
                fetchData(false);
            },[])
        );


        //필더팅
        const filteredData = selectedCategory === '전체'
            ? posts
            : posts.filter((item) => item.categoryName === selectedCategory);

        //렌더링용 데이터 변환
        const renderData = filteredData.map(item => {
            const cleanBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
            
            return {
                id: item.communityPostId,
                title: item.communityTitle,
                categoryName: item.categoryName,
                nickname: item.userNickname,
                author: item.userId,
                time: item.createDate,
                likes: item.communityLikeCount,
                // /api가 중복되지 않도록 경로 확인
                imageUrl: `${cleanBaseUrl}/community/image/${item.communityPostId}?t=${new Date().getTime()}`
            };
        });
    const renderEmptyComponent = () => (
        <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="file-search-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>등록된 게시글이 없습니다.</Text>
            <Text style={styles.emptySubText}>첫 번째 글을 작성해보세요!</Text>
        </View>
    );

    if (initialLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#004E89" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
            <View style={styles.pageHeader}>
                <View style={styles.headerTitleContainer}>
                    <MaterialCommunityIcons name="comment-text-outline" size={24} color="#004E89" style={{marginRight: 8, marginTop: 4}} />
                    <Text style={styles.headerTitle}>자유 게시판</Text>
                </View>

                <Button
                    type="add"
                    text="+  글쓰기"
                    width={80}
                    height={34}
                    textStyle={{ fontSize: 13, fontWeight: '600'}}
                    onPress={() => navigation.navigate('BoardWrite')}
                />
            </View>
            <View style={styles.noticeBar}>
                <View pointerEvents="none">
                    <IconButton
                        type="notice"
                        size={18}
                        color="#F87171"
                        style={{ padding: 0, marginRight: 8}}
                    />
            </View>
            <Text style={styles.noticeText} numberOfLines={1}>
                
                공지: 쾌적한 커뮤니티 활동을 위해 매너를 지켜주세요. 
            </Text>
            </View>

            {/* 카테고리 필터 */}
            <View style={styles.filterContainer}>
                {categories.map((cat) => (
                <SelectableButton
                    key={cat}
                    label={cat}
                    selected={selectedCategory === cat}
                    onPress={() => setSelectedCategory(cat)}
                    style={styles.filterButton}
                />
                ))}
            </View>

            {/* 게시글 리스트 */}
            <FlatList
                    data={renderData}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <BoardItem
                            item={item}
                            onPress={() => navigation.navigate('BoardDetail', {post: item})}
                        />
                    )}
                    ListEmptyComponent={renderEmptyComponent}
                    contentContainerStyle={[
                        styles.listContainer,
                        renderData.length === 0 && {flex: 1 }
                    ]}
                    style={styles.flatList}
                    showsVerticalScrollIndicator={false}
                    refreshing={refreshing}
                    onRefresh={() => fetchData(true)} //당겨서 새로고침기능
                    />
        </SafeAreaView>
    );
}
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#F9FAFB',
        },
        pageHeader: {
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#F9FAFB',
            marginTop: 10,
            marginBottom: 10,
        },
        headerTitleContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        headerTitle: {
            fontSize: 22,
            fontWeight: 'bold',
            color: '#111',
        },
        noticeBar: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#f3f2f2ff',
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 8,
            marginBottom: 16,
            marginRight: 16,
            marginLeft: 16,
        },
        noticeText: {
            color: '#555',
            fontSize: 13,
            flex: 1,
        },
        filterContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            paddingHorizontal: 16,
            marginBottom: 8,
        },
        filterButton: {
            paddingVertical: 6,
            paddingHorizontal: 16,
            borderRadius: 20,
            marginRight: 8,
            marginBottom: 8,
        },
        flatList: {
            flex: 1,
        },
        listContainer: {
            paddingHorizontal: 20,
            paddingBottom: 20,
        }, 
        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 50,
            minHeight: 300,
        },
        emptyText: {
            marginTop: 12,
            fontSize: 16,
            fontWeight: '600',
            color: '#6B7280',
        },
        emptySubText: {
            marginTop: 4,
            fontSize: 14,
            color: '#9CA3AF',
        },
        loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
    });
