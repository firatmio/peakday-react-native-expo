import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { getTasks, storeTask, deleteTask, updateTask } from '../context/tasks';

interface Task {
  id: string;
  title: string;
  description: string;
  time: string;
}

export default function Week() {
  const headerItems = [
    { id: 1, title: 'Pazartesi' },
    { id: 2, title: 'Salı' },
    { id: 3, title: 'Çarşamba' },
    { id: 4, title: 'Perşembe' },
    { id: 5, title: 'Cuma' },
    { id: 6, title: 'Cumartesi' },
    { id: 7, title: 'Pazar' },
  ];

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnimUpdate = useRef(new Animated.Value(0)).current;

  const [selectedHeaderItemId, setSelectedHeaderItemId] = useState(1);
  const [storedTasks, setStoredTasks] = useState<Task[]>([]);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isUpdateSheetOpen, setIsUpdateSheetOpen] = useState(false);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const updateSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ['45%'], []);
  const updateSnapPoints = useMemo(() => ['45%'], []);

  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [dueTime, setDueTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskTitleForUpdate, setTaskTitleForUpdate] = useState('');
  const [taskDescriptionForUpdate, setTaskDescriptionForUpdate] = useState('');
  const [showTimePickerUpdate, setShowTimePickerUpdate] = useState(false);

  const fetchTasks = async () => {
    const tasks = await getTasks(selectedHeaderItemId);
    setStoredTasks(tasks);
  };

  useEffect(() => { fetchTasks(); }, [selectedHeaderItemId]);

  // Update inputları doldur
  useEffect(() => {
    if (selectedTask) {
      setTaskTitleForUpdate(selectedTask.title);
      setTaskDescriptionForUpdate(selectedTask.description);
      setDueTime(new Date(selectedTask.time));
    }
  }, [selectedTask]);

  const openSheet = () => {
    setIsBottomSheetOpen(true);
    bottomSheetRef.current?.expand();
    Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
  };
  const closeSheet = () => {
    bottomSheetRef.current?.close();
    Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }).start(() => setIsBottomSheetOpen(false));
  };

  const openUpdateSheet = () => {
    setIsUpdateSheetOpen(true);
    updateSheetRef.current?.expand();
    Animated.timing(fadeAnimUpdate, { toValue: 1, duration: 250, useNativeDriver: true }).start();
  };
  const closeUpdateSheet = () => {
    updateSheetRef.current?.close();
    Animated.timing(fadeAnimUpdate, { toValue: 0, duration: 250, useNativeDriver: true }).start(() => setIsUpdateSheetOpen(false));
  };

  const handleAddTask = async () => {
    await storeTask(selectedHeaderItemId, taskTitle || 'Başlıksız', taskDescription, dueTime);
    setTaskTitle(''); setTaskDescription(''); setDueTime(new Date());
    closeSheet(); fetchTasks();
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(selectedHeaderItemId, taskId);
    fetchTasks();
  };

  const handleUpdateTask = (task: Task) => {
    setSelectedTask(task);
    openUpdateSheet();
  };

  const updateTask_ = async () => {
    if (!selectedTask) return;
    await updateTask(selectedHeaderItemId, selectedTask.id, {
      ...selectedTask,
      title: taskTitleForUpdate,
      description: taskDescriptionForUpdate,
      time: dueTime.toISOString()
    });
    closeUpdateSheet(); fetchTasks();
  };

  const getSelectedItem = () => headerItems.find(item => item.id === selectedHeaderItemId);

  const onChangeTime = (event: any, selectedDate?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedDate) setDueTime(selectedDate);
  };
  const onChangeTimeUpdate = (event: any, selectedDate?: Date) => {
    setShowTimePickerUpdate(Platform.OS === 'ios');
    if (selectedDate) setDueTime(selectedDate);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {headerItems.map(item => (
          <TouchableOpacity
            key={item.id}
            style={[styles.headerItem, item.id === selectedHeaderItemId && styles.selectedHeaderItem]}
            onPress={() => setSelectedHeaderItemId(item.id)}
          >
            <Text style={[styles.headerItemText, item.id === selectedHeaderItemId && styles.selectedHeaderItemText]}>
              {item.title.slice(0, 3)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.selectedDayContainer}>
        <Text style={styles.selectedItemText}>{getSelectedItem()?.title}</Text>
        <View style={styles.selectedItemTasks}>
          {storedTasks.length === 0 ? (
            <View style={styles.noTasksContainer}><Text>No tasks for this day.</Text></View>
          ) : (
            storedTasks.sort((a,b)=>new Date(a.time).getTime()-new Date(b.time).getTime()).map(task => (
              <TouchableOpacity onPress={() => handleUpdateTask(task)} key={task.id} style={{
                display:'flex', flexDirection:'row', marginBottom:10, borderWidth:1, borderRadius:12.5,
                borderColor:'rgba(0,0,0,.05)', backgroundColor:'rgba(0,0,0,.025)',
                paddingHorizontal:4, paddingVertical:10, justifyContent:'space-between', alignItems:'flex-start'
              }}>
                <View>
                  <Text style={{ fontSize:18, fontWeight:'600', marginLeft:10 }}>{task.title}</Text>
                  {task.description.length > 0 && <Text style={styles.selectedItemTasksText}>{task.description}</Text>}
                  <Text style={{ marginLeft:10, color:'gray' }}>{new Date(task.time).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit'})}</Text>
                </View>
                <View style={{ flexDirection:'row', gap:10 }}>
                  <TouchableOpacity onPress={()=>handleDeleteTask(task.id)} style={{borderRadius:'20%', backgroundColor:'#f5494935', padding:6, marginRight:6}}>
                    <Ionicons name="trash" size={22} color="#f54949" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={openSheet}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

      {/* Ekleme Sheet */}
      {isBottomSheetOpen && (
        <Animated.View style={[styles.bottomSheetContainer, { opacity: fadeAnim }]}>
          <TouchableWithoutFeedback onPress={closeSheet}><View style={styles.backdrop} /></TouchableWithoutFeedback>
          <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints} enablePanDownToClose keyboardBehavior="interactive" keyboardBlurBehavior="restore" android_keyboardInputMode="adjustPan" onClose={closeSheet}>
            <BottomSheetView style={{ flex:1, padding:16, paddingBottom:0 }}>
              <View style={styles.containerBottom}>
                <View style={styles.content}>
                  <Text style={styles.headerText}>Görev: {taskTitle || 'Başlıksız'}</Text>
                  <BottomSheetTextInput style={styles.input} placeholder="Başlık" value={taskTitle} onChangeText={setTaskTitle} />
                  <BottomSheetTextInput style={styles.input} placeholder="Açıklama" value={taskDescription} onChangeText={setTaskDescription} multiline />
                  <TouchableOpacity style={styles.timeButton} onPress={()=>setShowTimePicker(true)}>
                    <Text style={styles.timeText}>Bitiş saati: {dueTime.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</Text>
                  </TouchableOpacity>
                  {showTimePicker && <DateTimePicker value={dueTime} mode="time" is24Hour display="spinner" onChange={onChangeTime} />}
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity style={[styles.action, styles.add]} onPress={handleAddTask}>
                    <Text style={[styles.addText,{fontSize:16}]}>Görev Ekle</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </BottomSheetView>
          </BottomSheet>
        </Animated.View>
      )}

      {/* Güncelleme Sheet */}
      {isUpdateSheetOpen && (
        <Animated.View style={[styles.bottomSheetContainer, { opacity: fadeAnimUpdate }]}>
          <TouchableWithoutFeedback onPress={closeUpdateSheet}><View style={styles.backdrop} /></TouchableWithoutFeedback>
          <BottomSheet ref={updateSheetRef} snapPoints={updateSnapPoints} enablePanDownToClose keyboardBehavior="interactive" keyboardBlurBehavior="restore" android_keyboardInputMode="adjustPan" onClose={closeUpdateSheet}>
            <BottomSheetView style={{ flex:1, padding:16, paddingBottom:0 }}>
              <View style={styles.containerBottom}>
                <View style={styles.content}>
                  <Text style={styles.headerText}>Görev: {selectedTask?.title}</Text>
                  <BottomSheetTextInput style={styles.input} placeholder="Başlık" value={taskTitleForUpdate} onChangeText={setTaskTitleForUpdate} />
                  <BottomSheetTextInput style={styles.input} placeholder="Açıklama" value={taskDescriptionForUpdate} onChangeText={setTaskDescriptionForUpdate} multiline />
                  <TouchableOpacity style={styles.timeButton} onPress={()=>setShowTimePickerUpdate(true)}>
                    <Text style={styles.timeText}>Bitiş saati: {dueTime.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</Text>
                  </TouchableOpacity>
                  {showTimePickerUpdate && <DateTimePicker value={dueTime} mode="time" is24Hour display="spinner" onChange={onChangeTimeUpdate} />}
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity style={[styles.action, styles.add]} onPress={updateTask_}>
                    <Text style={[styles.addText,{fontSize:16}]}>Görevi Güncelle</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </BottomSheetView>
          </BottomSheet>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 10 },
  bottomSheetContainer: { flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  noTasksContainer: { marginTop: 20, alignItems: 'center', justifyContent: 'center', flex: 1 },
  selectedItemTasks: { flexDirection: 'column', marginTop: 15 },
  selectedItemTasksText: { fontSize: 16, fontWeight: '400', marginTop: 5, marginLeft: 10, color: 'rgba(0, 0, 0, 0.7)' },
  addButton: { position: 'absolute', bottom: 10, right: 10, backgroundColor: '#007BFF', padding: 12.5, borderRadius: 30 },
  selectedDayContainer: { flex: 1 },
  selectedItemText: { fontSize: 32, fontWeight: '700', marginTop: 10, marginLeft: 10 },
  header: { height: 60, justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8f8f8', marginBottom: 10, borderColor: '#ddd', borderWidth: 1, borderRadius: 12.5, flexDirection: 'row', gap: 5, padding: 7.5, marginTop: 10 },
  headerItem: { padding: 8, borderRadius: 10, height: '100%', flex: 1, alignItems: 'center', justifyContent: 'center' },
  headerItemText: { fontSize: 14, color: 'rgba(0, 0, 0, 0.6)', fontWeight: '600' },
  selectedHeaderItem: { backgroundColor: '#007BFF' },
  selectedHeaderItemText: { color: '#fff' },
  containerBottom: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 10, flexDirection: 'column' },
  content: { flexDirection: 'column', justifyContent: 'flex-start', flex: 1 },
  actions: { height: 75, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' },
  action: { backgroundColor: '#f0f0f0', paddingVertical: 10, paddingHorizontal: 20, height: 50, borderRadius: 10, flex: 1, alignItems: 'center', justifyContent: 'center' },
  add: { backgroundColor: '#007BFF' },
  addText: { color: '#fff' },
  headerText: { fontSize: 24, fontWeight: '600', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 10, marginBottom: 15, fontSize: 16 },
  timeButton: { padding: 12, borderRadius: 10, backgroundColor: '#f0f0f0', alignItems: 'center' },
  timeText: { fontSize: 16 },
});
