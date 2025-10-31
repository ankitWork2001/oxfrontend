import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers, toggleUserStatus } from "../../redux/slices/adminSlice";
import AdminTemplateHeaderPart from "../../components/Header/AdminTemplateHeaderPart";
import { useNavigation } from "@react-navigation/native";

const UsersScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { users, loading, error } = useSelector((state) => state.admin);

  const [searchText, setSearchText] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredUsers(users);
    } else {
      const lower = searchText.toLowerCase();
      setFilteredUsers(
        users.filter(
          u => u.name.toLowerCase().includes(lower) || u.email.toLowerCase().includes(lower)
        )
      );
    }
  }, [searchText, users]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{item.name}</Text>
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.label}>Email:</Text>
        <Text
          style={[styles.value, { flex: 1, textAlign: "right" }]}
          numberOfLines={1}
        >
          {item.email}
        </Text>
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.label}>Status:</Text>
        <Text
          style={[
            styles.value,
            {
              color: item.status === "active" ? "green" : "#E5A400",
              fontWeight: "600",
            },
          ]}
        >
          {item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
        </Text>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: "#1976D2" }]}
          onPress={() =>
            navigation.navigate("UserDetailsScreen", { userId: item._id })
          }
        >
          <Text style={styles.actionText}>View</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionBtn,
            { backgroundColor: item.status === "banned" ? "#4CAF50" : "#E5A400" },
          ]}
          onPress={() =>
            dispatch(
              toggleUserStatus({
                id: item._id,
                status: item.status === "banned" ? "active" : "banned",
              })
            )
          }
        >
          <Text style={styles.actionText}>
            {item.status === "banned" ? "Unban" : "Ban"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {loading ? (
        <ActivityIndicator size="large" color="#1976D2" style={{ marginTop: 40 }} />
      ) : error ? (
        <Text style={styles.errorText}>
          {typeof error === "string" ? error : "Something went wrong"}
        </Text>
      ) : (
        <>
          <AdminTemplateHeaderPart
            name="Users"
            onSearchChange={setSearchText} // pass search callback
          />

          <FlatList
            data={filteredUsers} // show filtered users
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={<Text style={styles.emptyText}>No users found.</Text>}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default UsersScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  listContainer: { padding: 12, paddingBottom: 15 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#1976D2",
  },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  label: { fontSize: 13, fontWeight: "600", color: "#444" },
  value: { fontSize: 13, color: "#000" },
  actionsRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 12 },
  actionBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, marginLeft: 8 },
  actionText: { fontSize: 12, fontWeight: "600", color: "#fff" },
  errorText: { color: "red", textAlign: "center", marginTop: 20 },
  emptyText: { color: "#999", textAlign: "center", marginTop: 20 },
});
