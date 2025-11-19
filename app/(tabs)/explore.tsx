import {View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView} from 'react-native';
import {useState} from 'react';
import {useRouter} from 'expo-router';
import {loadTasks, saveTasks} from '@/utils/storage';
import {Task} from '@/types/task';
import {SafeAreaView} from 'react-native-safe-area-context';


export default function AddTaskScreen() {
    const [taskText, setTaskText] = useState('');
    const maxLength = 200;
    const router = useRouter();

    const handleAddTask = async () => {
        if (!taskText.trim()) {
            Alert.alert('Error', 'Enter a task description before adding');
            return;
        }

        try {
            const currentTasks = await loadTasks();

            const newTask: Task = {
                id: Date.now().toString(),
                text: taskText.trim(),
                completed: false,
                createdAt: new Date().toISOString()
            };

            const updatedTasks = [...currentTasks, newTask];
            await saveTasks(updatedTasks);

            setTaskText('');
            Alert.alert('Success', 'Task added!', [
                {
                    text: 'OK',
                    onPress: () => {
                        router.back();
                    }
                }
            ]);
        } catch (error) {
            console.error('Error adding task:', error);
            Alert.alert('Error', 'Failed to add task');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.container}>
                <Text style={styles.title}>Add a task</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Task description</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Enter description..."
                        value={taskText}
                        onChangeText={setTaskText}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        maxLength={maxLength}
                    />
                    <View style={styles.counterContainer}>
                        <Text style={styles.counterText}>
                            {taskText.length}/{maxLength}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.addButton, !taskText.trim() && styles.disabledButton]}
                    onPress={handleAddTask}
                    disabled={!taskText.trim()}
                    activeOpacity={0.8}
                >
                    <Text style={styles.addButtonText}>Add a task</Text>
                </TouchableOpacity>

                <View style={styles.stats}>
                    <Text style={styles.statsText}>
                        Just enter the task and click “Add.”
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f9fa'
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#1a1a1a',
        textAlign: 'center'
    },
    inputContainer: {
        marginBottom: 25
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#1a1a1a'
    },
    textInput: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#e1e1e1',
        minHeight: 120,
        textAlignVertical: 'top'
    },
    addButton: {
        backgroundColor: '#007AFF',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 25
    },
    disabledButton: {
        backgroundColor: '#c7c7cc'
    },
    addButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    stats: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#007AFF'
    },
    statsText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center'
    },
    counterContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 8,
    },
    counterText: {
        fontSize: 12,
        color: '#999',
    },
});
