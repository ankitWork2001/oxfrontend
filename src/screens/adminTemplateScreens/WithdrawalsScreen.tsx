import React, { useEffect } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllWithdrawals,
  approveWithdrawal,
} from "../../redux/slices/adminSlice";
import AdminTemplateHeaderPart from "../../components/Header/AdminTemplateHeaderPart";
import Loader from "../../components/Loader/Loader";

const WithdrawalsScreen = () => {
  const dispatch = useDispatch();
  const { withdrawals, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAllWithdrawals());
  }, [dispatch]);

  const handleApprove = (item) => {
    if (item.status === "pending") {
      dispatch(approveWithdrawal({ id: item._id, status: "completed" }))
        .unwrap()
        .then(() => {
          Alert.alert("✅ Success", "Withdrawal approved.");
          dispatch(fetchAllWithdrawals());
        })
        .catch((err) => {
          Alert.alert("❌ Error", err);
        });
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <Text style={styles.label}>Request ID:</Text>
        <Text style={styles.value}>{item._id}</Text>
      </View>
      <View style={styles.rowBetween}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{item.userId?.email || "N/A"}</Text>
      </View>
      <View style={styles.rowBetween}>
        <Text style={styles.label}>Amount:</Text>
        <Text style={styles.value}>₹{item.amount}</Text>
      </View>
      <View style={styles.rowBetween}>
        <Text style={styles.label}>Address:</Text>
        <Text
          style={[styles.value, { flex: 1, textAlign: "right" }]}
          numberOfLines={2}
        >
          {item.address || "N/A"}
        </Text>
      </View>
      <View style={styles.rowBetween}>
        <Text style={styles.label}>Request Time:</Text>
        <Text style={[styles.value, { color: "#1976D2" }]}>
          {new Date(item.createdAt).toLocaleDateString("en-GB")}
        </Text>
      </View>
      <View style={styles.rowBetween}>
        <Text style={styles.label}>Status:</Text>
        <Text
          style={[
            styles.value,
            {
              color: item.status === "completed" ? "green" : "#E5A400",
              fontWeight: "600",
            },
          ]}
        >
          {item.status?.charAt(0).toUpperCase() + item.status.slice(1)}
        </Text>
      </View>

      {/* Action Button */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          disabled={item.status === "completed"}
          onPress={() => handleApprove(item)}
          style={[
            styles.approveBtn,
            item.status === "completed" && { backgroundColor: "#ccc" },
          ]}
        >
          <Text style={styles.approveText}>
            {item.status === "completed" ? "Approved" : "Approve"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <StatusBar
        backgroundColor="transparent"
        barStyle="dark-content"
        translucent
      />
      {loading ? (
        <Loader visible={loading} />
      ) : (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
          {/* FlatList handles scrolling itself */}
         <FlatList
  data={withdrawals}
  keyExtractor={(item) => item._id}
  renderItem={renderItem}
  ListHeaderComponent={<AdminTemplateHeaderPart name="Withdrawals" />}
  ListEmptyComponent={() => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No withdrawals found</Text>
    </View>
  )}
/>

        </SafeAreaView>
      )}
    </>
  );
};

export default WithdrawalsScreen;

const styles = StyleSheet.create({
  listContent: {
    // padding: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    marginHorizontal: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#444",
  },
  value: {
    fontSize: 13,
    color: "#000",
  },
  buttonRow: {
    marginTop: 12,
    alignItems: "flex-end",
  },
  approveBtn: {
    backgroundColor: "#FF8800",
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  approveText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },
  emptyContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
  },
});
