import React, {useState} from "react";
import { View, Text, Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';

const REPORT_REASONS = [
    '부적절한 게시글',
    '광고글'
];

const ReportModal = ({ isVisible, onClose, onSubmit }) => {
    const [selectedReason, setSelectedReason] = useState('');

    const handleSubmit = () => {
        if (!selectedReason) {
            return;
        }
        onSubmit(selectedReason);
        setSelectedReason('');
    };

    const handleClose = () => {
        setSelectedReason('');
        onClose();
    };

    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={handleClose}
        >

        {/* 배경 누르면 모달 닫기 */}
        <TouchableWithoutFeedback onPress={handleClose}>
            <View style={styles.overlay}>
                {/* 내부 컨텐츠 클릭 시 닫히지 않도록 방지*/}
                <TouchableWithoutFeedback>
                    <View style={styles.modalContainer}>
                        <Text style={styles.title}>신고 사유 선택</Text>
                        <Text style={styles.subtitle}>신고하시는 정확한 사유를 선택해주세요.</Text>

                        <View style={styles.reasonList}>
                            {REPORT_REASONS.map((reason, index) => 
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.reasonItem,
                                        selectedReason === reason && styles.selectedReasonItem
                                    ]}
                                    onPress={() => setSelectedReason(reason)}
                                    >
                                        <Text
                                            style={[
                                                styles.reasonText,
                                                selectedReason === reason && styles.selectedReasonText
                                            ]}>
                                                {reason}
                                            </Text>
                                            {/*  선택 표시 */}
                                            {/* <View style={[
                                                styles.radioButton,
                                                selectedReason === reason && styles.radioButtonSelected
                                            ]}/> */}
                                    </TouchableOpacity>
                            )}
                        </View>

                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
                                <Text style={styles.cancelButtonText}>취소</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.submitButton, !selectedReason && styles.disabledButton]}
                                onPress={handleSubmit}
                                disabled={!selectedReason}
                            >
                                <Text style={styles.submitButtonText}>신고하기</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '85%',
        backgroundColor: '#fff',
        borderColor: '#ddd',
        elevation: 12,
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 10,
       
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111',
        marginBottom: 4,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    reasonList: {
        marginBottom: 20,
    },
    reasonItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0'
    },
    selectedReasonItem: {
        backgroundColor: '#E5F1FB',
        borderRadius: 8,
    },
    reasonText: {
        fontSize: 15,
        color: '#333',
    },
    selectedReasonText: {
        color: '#333',
        fontWeight: '600', 
    },
  
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 12,
        marginRight: 8,
        backgroundColor: '#F1F3F5',
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#495057',
        fontWeight: '600',
        fontSize: 15,
    },
    submitButton: {
        flex: 1,
        paddingVertical: 12,
        marginLeft: 8,
        backgroundColor: '#cc4a4a',
        borderRadius: 8,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#FFD0D0',
    },
    submitButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 15,
    }
});

export default ReportModal;