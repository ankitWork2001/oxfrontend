import React, { useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
} from "react-native";

import AdminTemplateHeaderPart from "../../components/Header/AdminTemplateHeaderPart";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllDeposits,
  toggleDepositStatus,
} from "../../redux/slices/adminSlice";
import Loader from "../../components/Loader/Loader";

const DepositsScreen = () => {
  const dispatch = useDispatch();
  const { deposits, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAllDeposits());
  }, [dispatch]);

  const handleStatusUpdate = (item, status) => {
    if (item.status !== "pending") {
      Alert.alert("⛔ Already Processed", `Deposit is already ${item.status}`);
      return;
    }

    dispatch(toggleDepositStatus({ id: item._id, status }))
      .unwrap()
      .then((res) => {
        console.log("🔵 Backend Response:", res);

        const readableStatus = status === "completed" ? "approved" : "rejected";

        Alert.alert("✅ Success", `Deposit ${readableStatus} successfully!`);

        setTimeout(() => {
          dispatch(fetchAllDeposits());
        }, 500);
      })
      .catch((err) => {
        console.log("❌ Full Error:", JSON.stringify(err, null, 2));
        Alert.alert(
          "Error",
          err?.message || err?.error || JSON.stringify(err) || "Something went wrong"
        );
      });
  };

  const getStatusStyle = (status) => {
    if (status === "completed") return [styles.statusBadge, { backgroundColor: "#4CAF50" }];
    if (status === "failed") return [styles.statusBadge, { backgroundColor: "#F44336" }];
    return [styles.statusBadge, { backgroundColor: "#FFA000" }];
  };

  const getStatusText = (status) => {
    if (status === "failed") return "Rejected";
    if (status === "completed") return "Approved";
    return "Pending";
  };

  return (
    <>
      <StatusBar backgroundColor={"transparent"} barStyle={"dark-content"} translucent />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
        {loading ? (
          <Loader visible={loading} />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
          >
            {/* ✅ Header with NO padding */}
            <AdminTemplateHeaderPart name="Deposits" />

            {/* ✅ Padding only for content below */}
            <View style={styles.contentContainer}>
              {deposits.map((item) => (
                <View key={item._id} style={styles.card}>
                  {/* Header Row */}
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Txn: {item._id?.slice(-6) || "N/A"}</Text>
                    <View style={getStatusStyle(item.status)}>
                      <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
                    </View>
                  </View>

                  {/* Details */}
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Email:</Text>
                    <Text style={styles.value}>{item.userId?.email || "N/A"}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Amount:</Text>
                    <Text style={styles.value}>₹ {item.amount || 0}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Address:</Text>
                    <Text style={styles.value} numberOfLines={1} ellipsizeMode="tail">
                      {item.address || "N/A"}
                    </Text>
                  </View>

                  {/* Actions */}
                  {item.status === "pending" && (
                    <View style={styles.actionsRow}>
                      <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: "#4CAF50" }]}
                        onPress={() => handleStatusUpdate(item, "completed")}
                      >
                        <Text style={styles.btnText}>Approve</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: "#F44336" }]}
                        onPress={() => handleStatusUpdate(item, "failed")}
                      >
                        <Text style={styles.btnText}>Reject</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  );
};

export default DepositsScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    // padding: 12,
  },
  contentContainer: {
    paddingHorizontal: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  statusText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },
  value: {
    fontSize: 14,
    color: "#333",
    maxWidth: "60%",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
  },
  actionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 10,
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
  },
});
