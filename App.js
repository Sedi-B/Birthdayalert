import React, { useState, useEffect } from "react";
import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";

export default function App() {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [scheduledBirthdays, setScheduledBirthdays] = useState([]);

  useEffect(() => {
    getScheduledNotifications();
  }, []);

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const scheduleBirthdayReminder = async () => {
    try {
      await Notifications.requestPermissionsAsync();
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Birthday Alert",
          body: `Upcoming birthday on ${date.toLocaleString()}`,
          sound: "default",
        },
        trigger: {
          date,
          repeats: false,
        },
      });
      alert("Birthday Alert set!");
      getScheduledNotifications();
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  const getScheduledNotifications = async () => {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    setScheduledBirthdays(scheduled);
  };

  const deleteScheduledNotification = async (identifier) => {
    await Notifications.cancelScheduledNotificationAsync(identifier);
    getScheduledNotifications();
  };

  const renderItem = ({ item }) => (
    <View style={{ marginBottom: 5 }}>
      <Text>{item.content.body}</Text>
      <Pressable
        onPress={() => deleteScheduledNotification(item.identifier)}
        style={{
          width: "30%",
          backgroundColor: "#dd5656",
          borderRadius: 20,
          padding: 5,
          marginTop: 5,
        }}
      >
        <Text style={{ color: "white" }}>Remove Alert</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={style.container}>
      <View style={style.childone}>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 30,
              fontWeight: "bold",
              marginBottom: 1.5,
              color: "black",
            }}
          >
            SEDILERTS{" "}
          </Text>
          <Text style={{ fontSize: 15, marginBottom: 1.5, color: "black" }}>
            Alert you to not forget your loved one's birthdays...
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          <Pressable
            style={{
              backgroundColor: "gray",
              borderRadius: 20,
              padding: 10,
            }}
            onPress={showDatepicker}
          >
            <Text style={{ color: "black", alignSelf: "center" }}>
              Pick a Date
            </Text>
          </Pressable>
          <Pressable
            style={{
              backgroundColor: "gray",
              borderRadius: 20,
              padding: 10,
            }}
            onPress={scheduleBirthdayReminder}
          >
            <Text style={{ color: "black", alignSelf: "center" }}>
              Set A Reminder
            </Text>
          </Pressable>
        </View>
      </View>
      <View style={style.childtwo}>
        <FlatList
          style={{ alignContent: "center" }}
          data={scheduledBirthdays}
          renderItem={renderItem}
          keyExtractor={(item) => item.identifier}
        />
      </View>

      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "stretch",
    flex: 1,
    backgroundColor: "#5a5a5a",
  },
  childone: {
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 10,
    flex: 1,
  },
  childtwo: {
    justifyContent: "flex-start",
    marginLeft: 10,
    marginRight: 10,
    flex: 1,
  },
});
