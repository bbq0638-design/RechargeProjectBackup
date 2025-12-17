import React, {useState, useEffect} from 'react';
import {
    View, Text, StyleSheet, ScrollView, SafeAreaView, 
    KeyboardAvoidingView, Platform, Alert, Image, TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomTextInput from '../../components/common/TextInput';
import TextArea from '../../components/common/TextArea';
import SelectableButton from '../../components/common/SelectableButton';
import Button from '../../components/common/Button';

import { launchImageLibrary } from 'react-native-image-picker';
import { getCategories, createPost, updatePost } from '../../utils/CommunityApi';
import { API_BASE_URL } from '../../utils/api';

export default function BoardWriteScreen({ navigation, route }) {
    
    const { editData } = route.params || {};
    const isEditMode = !!editData;

    const [categories, setCategories] = useState([]);
    const [selectedCategoryCode, setSelectedCategoryCode] = useState('REVIEW');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [writerId, setWriterId] = useState('');
    //이미지 상태
    const [selectedImage, setSelectedImage] = useState(null);//선택한 이미지
    const [existingImageUrl, setExistingImageUrl] = useState(null); //(수정시) 기존 이미지 url


 useEffect(() => {
    const initializeData = async () => {
            try {
                // 카테고리 목록 조회
                const catData = await getCategories();
                setCategories(catData);

                //수정 모드일 경우 데이터 채워넣기
                if (isEditMode) {
                    navigation.setOptions({ title: '게시글 수정'}); //헤더 타이틀 변경

                    setTitle(editData.communityTitle);
                    setContent(editData.communityContent);
                    setSelectedCategoryCode(editData.categoryCode);
                    //기존 이미지 있으면 미리보기 설정
                    if(editData.hasImage === 'Y' || editData.imageUrl) {
                        const cleanBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
                        const targetId = editData.communityPostId || editData.id;
                        setExistingImageUrl(`${cleanBaseUrl}/community/image/${targetId}`);
                    }
                } else {
                    //글쓰기 모드일 경우 기본 카테고리 선택
                    if(catData && catData.length >0) {
                        setSelectedCategoryCode(catData[0].categoryCode);
                    }
                    //닉네임 가져오기
                    const storedUserId = await AsyncStorage.getItem('userId'); 
                    if (storedUserId) setWriterId(storedUserId);
                }
            } catch (error) {
                Alert.alert('오류', '데이터를 불러오지 못했습니다.');
            }
        };

        initializeData();
    }, []);

    //갤러리 열어서 이미지 선택
    const handleImagePick = async () => {
        const result = await launchImageLibrary({
            mediaType: 'photo',
            selectionLimit: 1,
            quality: 0.5,        
            maxWidth: 800,       
            maxHeight: 800,      
        });

        
        if (result.didCancel) {
            console.log('선택 취소');
            return;
        } 
        if (result.errorCode) {
            Alert.alert('오류', '이미지를 불러오지 못했습니다.');
            return;
        } 
        //이미지가 정상적으로 선택
        if (result.assets && result.assets.length > 0) {
            //새 이미지 담음
            setSelectedImage(result.assets[0]);
            //기존 이미지 url 초기화
            setExistingImageUrl(null);
        }
    };
    
    //동록하기
    const handleSubmit = async () => {
        if (!title.trim()) {
            Alert.alert('알림', '제목을 입력해주세요.');
            return;
        }
        if (!content.trim()) {
            Alert.alert('알림', '내용을 입력해주세요.');
            return;
        }
       
        const formData = new FormData();
        if (!isEditMode) formData.append('userId', writerId);

        formData.append('communityTitle', title);
        formData.append('communityContent', content);
        formData.append('categoryCode', selectedCategoryCode);

        //이미지 데이터
        if (selectedImage) {
            formData.append('file', {
                uri: Platform.OS === 'android' ?selectedImage.uri : selectedImage.uri.replace('file://', ''),
                type: selectedImage.type || 'image/jpeg',
                name: selectedImage.fileName || `upload_${Date.now()}.jpg`,
            });
        }

        //전송
        try {
            let response;
            if (isEditMode) {
                response = await updatePost(editData.communityPostId || editData.id, formData);
                if (response.status === 200) {
                Alert.alert('성공', '게시글이 등록되었습니다!', [
                    { text: '확인', onPress: () => navigation.goBack() }
                ]);
            }
        } else {
            //등록모드
            response = await createPost(formData);
            if (response.status === 200) {
                Alert.alert('성공', '게시글이 등록되었습니다!', [
                    { text: '확인', onPress: () => navigation.goBack() }
                    ]);
                }
            } 
        } catch (error) {
            console.error('글쓰기 실패:', error);
            Alert.alert('실패', isEditMode ? '수정 중 오류가 발생했습니다.' : '등록 중 오류가 발생했습니다.');
        }
    };
   

  

return (
    <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
        >

        <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            >

                {/* 카테고리 선택 영역 */}
        <View style={styles.section}>
            <Text style={styles.label}>게시판 선택</Text>
            <View style={styles.categoryContainer}>
                {categories.map((cat) => (
                    <SelectableButton
                        key={cat.categoryId}
                        label={cat.categoryName}
                        selected={selectedCategoryCode === cat.categoryCode}
                        onPress={() => setSelectedCategoryCode(cat.categoryCode)}
                        style={styles.categoryButton}
                        textStyle={{ fontSize: 13 }}
                    />
                ))}
            </View>
        </View>

        <View style={styles.section}>
                <Text style={styles.label}>제목</Text>
                <CustomTextInput
                    placeholder="제목을 입력하세요..."
                    value={title}
                    onChangeText={setTitle}
                    />
        </View>

        <View style={styles.section}>
            <Text style={styles.label}>내용</Text>
                <TextArea
                    placeholder="내용을 입력하세요..."
                    value={content}
                    onChangeText={setContent}
                    maxLength={1300}
                    style={styles.textArea}
                    autoGrow={false}
                />
                {/* 이미지 미리보기 */}
            <View style={styles.imagePreviewWrapper}>
                {selectedImage ? (
                    <View style={styles.imagePreviewContainer}>
                        <Image source={{uri: selectedImage.uri }} style={styles.previewImage} resizeMode="cover" />
                        <TouchableOpacity style={styles.removeImageButton} onPress={() => setSelectedImage(null)}>
                            <Text style={styles.removeImageText}>X</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    //기존이미지
                    existingImageUrl && (
                        <View style={styles.imagePreviewContainer}>
                            <Image source={{uri: existingImageUrl}} style={styles.previewImage} resizeMode="cover" />
                        </View>
                    )
                )}
            </View>

            <View style={styles.attachButtonContainer}>
                <Button
                    type="more"
                    text={selectedImage || existingImageUrl ? "이미지 변경" : "+ 이미지 첨부"}
                    width={120}
                    height={40}
                    textStyle={{ fontSize: 14, fontWeight: '500' }}
                    onPress={handleImagePick}
                />
            </View>
        </View>
        </ScrollView> 

        <View style={styles.footer}>
            <Button
                type="submit"
                text={isEditMode ? "수정 완료" : "등록하기"}
                width="48%"
                onPress={handleSubmit}
                textStyle={{ fontSize: 14}}
            />
            <Button
                type="cancel"
                text="취소하기"
                width="48%"
                onPress={() => navigation?.goBack()}
                textStyle={{ fontSize: 14}}
            />
            </View>   
        </KeyboardAvoidingView>
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    scrollContainer: {
        padding: 20,
        paddingBottom: 100,
    },
    section: {
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 6,
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    categoryButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 4,
    },
    textArea: {
        height: 270,
        textAlignVertical: 'top',
    },
    attachButtonContainer: {
        marginBottom: 8,
        alignItems: 'flex-end',
        
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: '#F9FAFB',
        borderTopWidth: 1,
        borderTopColor: '#F9FAFB',
    },
    imagePreviewContainer: {
        marginTop: 10,
        position: 'relative',
        alignSelf: 'flex-start',
    },
    imagePreviewWrapper: {
        marginTop: 10,
        alignSelf: 'flex-start',
    },
    previewImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    removeImageButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#ff4444',
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeImageText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
    },
});