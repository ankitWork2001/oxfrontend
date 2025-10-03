import React, { useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  getAllNotifications,
  deleteAllNotifications,
} from "../../redux/slices/notificationSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

// --- Notification Item Component ---
const NotificationItem = React.memo(({ item }) => {
  return (
    <View style={styles.notificationCard}>
      <View style={styles.iconContainer}>
        <Icon name="notifications-active" size={24} color="#34A853" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title || "Notification"}</Text>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.time}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>
    </View>
  );
});

// --- Main Notification Screen ---
const NotificationScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { notifications, loading, errorMsg } = useSelector(
    (state) => state.notification
  );

  useEffect(() => {
    dispatch(getAllNotifications());
  }, [dispatch]);

  const handleDeleteAll = () => {
    Alert.alert(
      "Clear All Notifications",
      "Are you sure you want to permanently delete all notifications?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => dispatch(deleteAllNotifications()),
        },
      ]
    );
  };

  const renderItem = useCallback(({ item }) => <NotificationItem item={item} />, []);

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Icon name="notifications-off" size={60} color="#BDBDBD" />
      <Text style={styles.emptyText}>You're all caught up!</Text>
      <Text style={styles.emptySubtext}>
        We'll let you know when there's something new.
      </Text>
    </View>
  );

  return (
    <>
      {/* Safe area for status bar background */}
      <SafeAreaView style={{ flex: 0, backgroundColor: "#34A853" }} edges={["top"]} />
      <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
        <StatusBar barStyle="light-content" backgroundColor="#34A853" />

        {/* --- Header --- */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerButton}
          >
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          {notifications.length > 0 ? (
            <TouchableOpacity onPress={handleDeleteAll} style={styles.headerButton}>
              <View style={styles.deleteButton}>
                <Icon name="delete-sweep" size={24} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.headerButton} /> // Placeholder
          )}
        </View>

        {/* --- Main Content --- */}
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#34A853" />
          </View>
        ) : errorMsg ? (
          <View style={styles.centered}>
            <Text style={styles.error}>{errorMsg}</Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            ListEmptyComponent={ListEmptyComponent}
            contentContainerStyle={styles.listContentContainer}
          />
        )}
      </SafeAreaView>
    </>
  );
};

export default NotificationScreen;

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#34A853",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#FF8800",
    padding: 6,
    borderRadius: 6,
  },
  listContentContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  notificationCard: {
    flexDirection: "row",
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212121",
  },
  message: {
    fontSize: 14,
    color: "#757575",
    marginTop: 4,
  },
  time: {
    fontSize: 12,
    color: "#BDBDBD",
    marginTop: 8,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#757575",
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#BDBDBD",
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  error: {
    color: "#D32F2F",
    textAlign: "center",
    fontSize: 16,
  },
});
