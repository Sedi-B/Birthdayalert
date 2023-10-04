import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  ImageBackground,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";
import { Audio } from "expo-av";

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

      await playSound();
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
  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("./assets/LertSound.mp3")
      );
      await sound.playAsync();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const deleteScheduledNotification = async (identifier) => {
    await Notifications.cancelScheduledNotificationAsync(identifier);
    getScheduledNotifications();
  };

  const renderItem = ({ item }) => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 5,
      }}
    >
      <Text style={{ flex: 1 }}>{item.content.body}</Text>
      <Pressable
        onPress={() => deleteScheduledNotification(item.identifier)}
        style={{
          backgroundColor: "#279EFF",
          borderRadius: 20,
          padding: 10,
          marginLeft: 10,
        }}
      >
        <Text style={{ color: "white", fontWeight: "900" }}>
          Remove Reminder
        </Text>
      </Pressable>
    </View>
  );

  return (
    <View style={style.container}>
      <View style={style.childone}>
        <View style={{ width: "100%", height: "90%", marginBottom: 10 }}>
          <ImageBackground
            source={require("./assets/BackPic.jpg")}
            style={{
              height: "100%",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 40,
                fontWeight: "bold",
                marginBottom: 1,
                color: "black",
                alignSelf: "center",
              }}
            >
              SEDILERTS
            </Text>
          </ImageBackground>
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
              backgroundColor: "#8EACCD",
              borderRadius: 20,
              padding: 10,
            }}
            onPress={showDatepicker}
          >
            <Text
              style={{
                color: "black",
                fontWeight: "900",
                alignSelf: "center",
              }}
            >
              Pick a Date
            </Text>
          </Pressable>
          <Pressable
            style={{
              backgroundColor: "#8EACCD",
              borderRadius: 20,
              padding: 10,
            }}
            onPress={scheduleBirthdayReminder}
          >
            <Text
              style={{ color: "black", alignSelf: "center", fontWeight: "900" }}
            >
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

    flex: 1,
    backgroundColor: "#D2E0FB",
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
    marginTop: 10,
    flex: 1,
  },
});
