import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function NoticeNavigation({
    onPrev,
    onNext,
    prevTitle,
    nextTitle,
}) {
    return (
        <View style={styles.navButtons}>
            <TouchableOpacity style={styles.navButton} onPress={onPrev}>
                <Text style={styles.navLabel}>다음글</Text>
                <Text style={styles.navTitle}>{prevTitle}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navButton} onPress={onNext}>
                <Text style={styles.navLabel}>이전글</Text>
                <Text style={styles.navTitle}>{nextTitle}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    navButtons: {
        borderTopWidth: 1,
        borderTopColor: "#eee",
        paddingTop: 12,
    },
    navButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 12,
    },
    navLabel: { fontSize: 14, color: "#777", fontWeight: "600", padding: 5 },
    navTitle: { fontSize: 14, color: "#777", fontWeight: "600", padding: 7 },
});
