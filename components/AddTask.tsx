import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AddTaskProps {
    selectedDayId?: number;
    selectedDayTitle?: string;
}

export default function AddTask({ selectedDayId, selectedDayTitle }: AddTaskProps) {
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [dueTime, setDueTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);

    const onChangeTime = (event: any, selectedDate?: Date) => {
        setShowTimePicker(Platform.OS === 'ios');
        if (selectedDate) {
            const localDate = new Date(
                selectedDate.getTime() + selectedDate.getTimezoneOffset() * 60000
            );
            setDueTime(localDate);
        }
    };
    const handleAddTask = () => {
        console.log('Task Added:', { taskTitle, taskDescription, dueTime });
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.headerText}>Add Task: {selectedDayTitle}</Text>

                <BottomSheetTextInput
                    style={styles.input}
                    placeholder="Task Title"
                    value={taskTitle}
                    onChangeText={setTaskTitle}
                />

                <BottomSheetTextInput
                    style={[styles.input]}
                    placeholder="Task Description"
                    value={taskDescription}
                    onChangeText={setTaskDescription}
                    multiline
                />

                <TouchableOpacity style={styles.timeButton} onPress={() => setShowTimePicker(true)}>
                    <Text style={styles.timeText}>Due by: {dueTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                </TouchableOpacity>

                {showTimePicker && (
                    <DateTimePicker
                        value={dueTime}
                        mode="time"
                        is24Hour={true}
                        display="spinner"
                        onChange={onChangeTime}
                        timeZoneOffsetInMinutes={0}
                    />
                )}
            </View>

            <View style={styles.actions}>
                <TouchableOpacity style={[styles.action, styles.add]} onPress={handleAddTask}>
                    <Text style={[styles.addText, { fontSize: 16 }]}>Add Task</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        flex: 1,
    },
    actions: {
        height: 75,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
    },
    action: {
        backgroundColor: '#f0f0f0',
        paddingVertical: 10,
        paddingHorizontal: 20,
        height: 50,
        borderRadius: 10,
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    add: {
        backgroundColor: '#007BFF',
    },
    addText: {
        color: '#fff',
    },
    headerText: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
        fontSize: 16,
    },
    timeButton: {
        padding: 12,
        borderRadius: 10,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
    },
    timeText: {
        fontSize: 16,
    },
});
