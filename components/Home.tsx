import moment from "moment";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { dayProps, Task } from "../utils/types";
import { getTasks } from "../context/tasks";
import { eventBus } from "../utils/eventBus";
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
  const [today, setToday] = useState<dayProps | null>(null);
  const [todayId, setTodayId] = useState<number | null>(null);
  const [todayTasks, setTodayTasks] = useState<Task[] | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<String | undefined>();

  const daysOfWeek: dayProps[] = [
    { title: "monday", id: 1, turkish: "Pazartesi" },
    { title: "tuesday", id: 2, turkish: "Salı" },
    { title: "wednesday", id: 3, turkish: "Çarşamba" },
    { title: "thursday", id: 4, turkish: "Perşembe" },
    { title: "friday", id: 5, turkish: "Cuma" },
    { title: "saturday", id: 6, turkish: "Cumartesi" },
    { title: "sunday", id: 7, turkish: "Pazar" },
  ];

  useEffect(() => {
    const fetchTasks = async () => {
      const todayName = moment().format("dddd").toLowerCase();
      const foundDay = daysOfWeek.find((day) => day.title === todayName);
      if (foundDay) {
        setToday(foundDay);
        setTodayId(foundDay.id);

        const tasks = await getTasks(foundDay.id);
        setTodayTasks(tasks);
      }
    };

    fetchTasks();

    eventBus.on("tasksUpdated", fetchTasks);

    return () => {
      eventBus.removeListener("tasksUpdated", fetchTasks);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text
          style={{
            fontSize: 38,
            fontWeight: "600",
            color: "white",
          }}
        >
          {today?.turkish}
        </Text>
        <Text
          style={{
            color: "rgba(255,255,255,.75)",
          }}
        >
          {todayTasks
            ? todayTasks.length === 0
              ? "Hiç görev bulunamadı"
              : `${todayTasks.length} görev bulundu`
            : "Yükleniyor..."}
        </Text>
      </View>
      {todayTasks?.length === 0 ? (
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 15,
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
        >
          <Ionicons name="layers" size={54} color="rgba(0,0,0,.4)"></Ionicons>
          <Text
            style={{
              color: "rgba(0,0,0,.5)",
              fontSize: 20,
            }}
          >
            Hiç görev bulunamadı
          </Text>
        </View>
      ) : (
        <View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "600",
              paddingTop: 30,
            }}
          >
            Bugünün görevleri:
          </Text>
          <View
            style={{
              paddingTop: 20,
              display: "flex",
              flexDirection: "column",
              gap: 15,
            }}
          >
            {todayTasks?.map((task) => (
              <TouchableOpacity
                key={task.id}
                style={styles.taskItem}
                onPress={() => {
                  setSelectedTaskId(task.id);
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                    }}
                  >
                    {task.title}
                  </Text>
                  {task.description && (
                    <Text
                      style={{
                        fontSize: 16,
                        color: "rgba(0,0,0,.75)",
                      }}
                    >
                      {task.description}
                    </Text>
                  )}
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "rgba(0,0,0,.5)",
                    }}
                  >
                    {new Date(task.time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 10,
    display: "flex",
    flexDirection: "column",
  },
  taskItem: {
    borderRadius: 12.5,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,.05)",
    backgroundColor: "rgba(0,0,0,.025)",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,.05)",
    backgroundColor: "#007BFF",
    padding: 10,
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
});
