import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function NoticeContent({ content }) {
    return (
        <View style={styles.contentCard}>
            <Text style={styles.contentText}>{content}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    contentCard: {
        backgroundColor: "white",
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#b3b3b3",
    },
    contentText: { fontSize: 14, color: "#000", lineHeight: 20 },
});
