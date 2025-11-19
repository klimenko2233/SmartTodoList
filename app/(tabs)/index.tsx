import {View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator} from 'react-native';
import React, {useState} from 'react';
import {Task} from '@/types/task';
import {loadTasks, saveTasks} from '@/utils/storage';
import {useFocusEffect} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Animated, {FadeInDown} from 'react-native-reanimated';


export default function TasksScreen() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            loadTasksFromStorage();
        }, [])
    );

    const loadTasksFromStorage = async () => {
        setLoading(true);
        try {
            const storedTasks = await loadTasks();
            setTasks(storedTasks);
        } catch (error) {
            console.error('Error loading tasks from storage:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleTaskCompletion = async (taskId: string) => {
        const updatedTasks = tasks.map(task =>
            task.id === taskId ? {...task, completed: !task.completed} : task
        );
        setTasks(updatedTasks);
        await saveTasks(updatedTasks);
    };

    const deleteTask = async (taskId: string) => {
        Alert.alert(
            'Delete Task',
            'Are you sure you want to delete this task?',
            [
                {text: 'Cancel', style: 'cancel'},
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        const updatedTasks = tasks.filter(task => task.id !== taskId);
                        setTasks(updatedTasks);
                        await saveTasks(updatedTasks);
                    }
                }
            ]
        );
    };

    const renderTaskItem = ({item,index}: { item: Task; index:number }) => (
        <Animated.View
            entering={FadeInDown.delay(index * 100).springify()}
            style={[styles.taskItem, item.completed && styles.completedTask]}
        >
            <TouchableOpacity
                style={styles.taskContent}
                onPress={() => toggleTaskCompletion(item.id)}
                activeOpacity={0.7}
            >
                <Text style={[styles.taskText, item.completed && styles.completedText]}>
                    {item.text}
                </Text>
                <Text style={styles.taskDate}>
                    {new Date(item.createdAt).toLocaleDateString()}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteTask(item.id)}
            >
                <Text style={styles.deleteText}>×</Text>
            </TouchableOpacity>
        </Animated.View>
    );

    const clearCompletedTasks = async () => {
        if (completedTasksCount === 0) return;

        Alert.alert(
            'Clear Completed Tasks',
            `Are you sure you want to clear ${completedTasksCount} completed task${completedTasksCount > 1 ? 's' : ''}?`,
            [
                {text: 'Cancel', style: 'cancel'},
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: async () => {
                        const updatedTasks = tasks.filter(task => !task.completed);
                        setTasks(updatedTasks);
                        await saveTasks(updatedTasks);
                    }
                }
            ]
        );
    };

    const completedTasksCount = tasks.filter(task => task.completed).length;
    const totalTasksCount = tasks.length;

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF"/>
                    <Text style={styles.loadingText}>Loading tasks...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>My Tasks👨🏻‍💻</Text>

            {totalTasksCount > 0 && completedTasksCount > 0 && (
                <View style={styles.statsContainer}>
                    <View style={styles.statsHeader}>
                        <Text style={styles.statsText}>
                            Completed: {completedTasksCount} from {totalTasksCount}
                        </Text>
                        <TouchableOpacity onPress={clearCompletedTasks}>
                            <Text style={styles.clearText}>Clear</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                {width: `${totalTasksCount > 0 ? (completedTasksCount / totalTasksCount) * 100 : 0}%`}
                            ]}
                        />
                    </View>
                </View>
            )}

            {tasks.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyEmoji}>📝</Text>
                    <Text style={styles.emptyTitle}>No tasks</Text>
                    <Text style={styles.emptySubtext}>
                        Click on Explore tab to add a new task.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={tasks}
                    renderItem={renderTaskItem}
                    keyExtractor={item => item.id}
                    style={styles.taskList}
                    showsVerticalScrollIndicator={false}
                />
            )}
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
        marginBottom: 20,
        color: '#1a1a1a'
    },
    taskList: {
        flex: 1
    },
    taskItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 16,
        marginVertical: 4,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2
    },
    completedTask: {
        opacity: 0.6
    },
    taskContent: {
        flex: 1
    },
    taskText: {
        fontSize: 16,
        color: '#1a1a1a',
        marginBottom: 4
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: '#666'
    },
    taskDate: {
        fontSize: 12,
        color: '#888'
    },
    deleteButton: {
        padding: 8,
        marginLeft: 10
    },
    deleteText: {
        fontSize: 20,
        color: '#ff3b30',
        fontWeight: 'bold'
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40
    },
    emptyEmoji: {
        fontSize: 64,
        marginBottom: 20
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center'
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22
    },
    emptySubtext: {
        fontSize: 14,
        color: '#888'
    },
    statsContainer: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 12,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2
    },
    statsText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8
    },
    progressBar: {
        height: 6,
        backgroundColor: '#f0f0f0',
        borderRadius: 3,
        overflow: 'hidden'
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4CD964',
        borderRadius: 3
    },
    statsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8
    },
    clearText: {
        color: '#ff3b30',
        fontSize: 14,
        fontWeight: '500'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666'
    }
});