import React, { useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import AdminTemplateHeaderPart from "../../components/Header/AdminTemplateHeaderPart";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInvestments } from "../../redux/slices/adminSlice";
import Loader from "../../components/Loader/Loader";
import moment from "moment";

const InvestmentsScreen = () => {
  const dispatch = useDispatch();
  const { userInvestments, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchUserInvestments());
  }, [dispatch]);

  console.log("User Investments:", userInvestments);

  const getPlanValue = (plandObj, key) => {
    if (plandObj && typeof plandObj === "object" && plandObj[key]) {
      return plandObj[key];
    }
    return "N/A";
  };

  return (
    <>
      <StatusBar backgroundColor={"transparent"} barStyle={"dark-content"} translucent />
      {loading ? (
        <Loader visible={loading} />
      ) : (
        <SafeAreaView style={styles.safeArea}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <AdminTemplateHeaderPart name="User Investments" />

            <View style={styles.container}>
              {(Array.isArray(userInvestments) ? userInvestments : []).map((item, index) => (
                <View key={index} style={styles.card}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.label}>User ID:</Text>
                    <Text style={styles.value}>{item?.userId || "N/A"}</Text>
                  </View>

                  <View style={styles.rowBetween}>
                    <Text style={styles.label}>Plan Name:</Text>
                    <Text style={styles.value}>{getPlanValue(item.planId, "name")}</Text>
                  </View>

                  <View style={styles.rowBetween}>
                    <Text style={styles.label}>Amount:</Text>
                    <Text style={[styles.value, { color: "#1976D2", fontWeight: "600" }]}>
                      ₹{item?.amount ?? "N/A"}
                    </Text>
                  </View>

                  <View style={styles.rowBetween}>
                    <Text style={styles.label}>R.O.I:</Text>
                    <Text style={styles.value}>{getPlanValue(item.planId, "roiPercent")}%</Text>
                  </View>

                   <View style={styles.rowBetween}>
                    <Text style={styles.label}>Earning:</Text>
                    <Text style={styles.value}>{item?.earning ?? "N/A"}$</Text>
                  </View>

                   <View style={styles.rowBetween}>
                    <Text style={styles.label}>Last Payout Date:</Text>
                    <Text style={styles.value}>{item?.lastPayoutDate ? moment(item.lastPayoutDate).format("MMM DD, YYYY") : "N/A"}</Text>
                  </View>

                  <View style={styles.rowBetween}>
                    <Text style={styles.label}>Status:</Text>
                    <Text
                      style={[
                        styles.value,
                        {
                          color: item?.status === "active" ? "green" : "#E5A400",
                          fontWeight: "600",
                        },
                      ]}
                    >
                      {item?.status?.charAt(0).toUpperCase() + item.status.slice(1) || "N/A"}
                    </Text>
                  </View>

                  <View style={styles.rowBetween}>
                    <Text style={styles.label}>Start Date:</Text>
                    <Text style={styles.value}>
                      {item?.startDate ? moment(item.startDate).format("MMM DD, YYYY") : "N/A"}
                    </Text>
                  </View>

                  <View style={styles.rowBetween}>
                    <Text style={styles.label}>End Date:</Text>
                    <Text style={styles.value}>
                      {item?.endDate ? moment(item.endDate).format("MMM DD, YYYY") : "N/A"}
                    </Text>
                  </View>
                </View>
              ))}

              {(!userInvestments || userInvestments.length === 0) && (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No investments found</Text>
                </View>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      )}
    </>
  );
};

export default InvestmentsScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 12,
  },
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
    borderLeftColor: "#1976D2", // accent color strip
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    fontSize: RFValue(12),
    fontWeight: "600",
    color: "#444",
  },
  value: {
    fontSize: RFValue(12),
    color: "#000",
  },
  emptyContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: RFValue(13),
    color: "#666",
  },
});
