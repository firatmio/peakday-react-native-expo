import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { getTasks } from '../context/tasks';
import AddTask from './AddTask';

export default function Home() {
  const headerItems = [
    { id: 1, title: 'Sunday' },
    { id: 2, title: 'Monday' },
    { id: 3, title: 'Tuesday' },
    { id: 4, title: 'Wednesday' },
    { id: 5, title: 'Thursday' },
    { id: 6, title: 'Friday' },
    { id: 7, title: 'Saturday' },
  ];

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [selectedHeaderItemId, setSelectedHeaderItemId] = useState(1);
  const [storedTasks, setStoredTasks] = useState<string[]>([]);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['45%'], []);

  const getSelectedItem = () => headerItems.find((item) => item.id === selectedHeaderItemId);

  const openSheet = () => {
    setIsBottomSheetOpen(true);
    bottomSheetRef.current?.expand();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const closeSheet = () => {
    bottomSheetRef.current?.close();
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setIsBottomSheetOpen(false);
    });
  };

  useEffect(() => {
    const fetchTasks = async () => {
      const storedTasks_ = await getTasks(selectedHeaderItemId);
      console.log(
        storedTasks_.length === 0
          ? 'No tasks found'
          : `Found ${storedTasks_.length} tasks`
      );
      setStoredTasks(storedTasks_);
    };
    fetchTasks();
  }, [selectedHeaderItemId]);

  useEffect(() => {
    if (!isBottomSheetOpen) return;
    bottomSheetRef.current?.snapToIndex(1);
  }, [isBottomSheetOpen]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {headerItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.headerItem, item.id === selectedHeaderItemId && styles.selectedHeaderItem]}
            onPress={() => setSelectedHeaderItemId(item.id)}
          >
            <Text
              style={[
                styles.headerItemText,
                item.id === selectedHeaderItemId && styles.selectedHeaderItemText,
              ]}
            >
              {item.id}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.selectedDayContainer}>
        <Text style={styles.selectedItemText}>{getSelectedItem()?.title}</Text>
        <View style={styles.selectedItemTasks}>
          {storedTasks.length === 0 ? (
            <View style={styles.noTasksContainer}>
              <Text>No tasks for this day.</Text>
            </View>
          ) : (
            storedTasks.map((task, index) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 20, fontWeight: '600', marginLeft: 10 }}>Tasks:</Text>
                <Text style={styles.selectedItemTasksText}>{task}</Text>
              </View>
            ))
          )}
        </View>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={openSheet}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

      {isBottomSheetOpen && (
        <Animated.View style={[styles.bottomSheetContainer, { opacity: fadeAnim }]}>
          <TouchableWithoutFeedback onPress={closeSheet}>
            <View style={styles.backdrop} />
          </TouchableWithoutFeedback>

          <BottomSheet
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            enablePanDownToClose
            keyboardBehavior="interactive"
            keyboardBlurBehavior="restore"
            android_keyboardInputMode="adjustResize"
            onClose={closeSheet}
          >
            <BottomSheetView style={{ flex: 1, padding: 16 }}>
              <AddTask
                selectedDayId={selectedHeaderItemId}
                selectedDayTitle={getSelectedItem()?.title}
              />
            </BottomSheetView>
          </BottomSheet>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  bottomSheetContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  noTasksContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  selectedItemTasks: {
    flexDirection: 'column',
    marginTop: 15,
  },
  selectedItemTasksText: {
    fontSize: 18,
    fontWeight: '400',
    marginTop: 5,
    marginLeft: 10,
    color: 'rgba(0, 0, 0, 0.7)',
  },
  addButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#007BFF',
    padding: 12.5,
    borderRadius: 30,
  },
  selectedDayContainer: {
    flex: 1,
  },
  selectedItemText: {
    fontSize: 32,
    fontWeight: '700',
    marginTop: 10,
    marginLeft: 10,
  },
  header: {
    height: 60,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    marginBottom: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 12.5,
    flexDirection: 'row',
    gap: 5,
    padding: 7.5,
    marginTop: 10,
  },
  headerItem: {
    padding: 8,
    borderRadius: 10,
    height: '100%',
    flex: 1,
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center'
  },
  headerItemText: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.6)',
    fontWeight: '600',
  },
  selectedHeaderItem: {
    backgroundColor: '#007BFF',
  },
  selectedHeaderItemText: {
    color: '#fff',
  },
});
