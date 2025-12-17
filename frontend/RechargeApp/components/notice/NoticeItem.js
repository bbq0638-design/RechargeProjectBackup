import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function NoticeItem({ item, onPress }) {
    return (
        <TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
            <View style={styles.cardContent}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="black" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 10,
        backgroundColor: "white",
        borderRadius: 12,
        marginTop: 0,
        marginBottom: 12,
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#eee",
        alignItems: "center",
        justifyContent: "space-between",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardContent: { flex: 1 },
    title: { fontSize: 15, color: "black", fontWeight: "600", marginBottom: 4 },
    date: { fontSize: 13, color: "#777" },
});
