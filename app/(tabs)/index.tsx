import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {useState, useEffect} from 'react';
import {Task} from '@/types/task';
import {loadTasks, saveTasks} from '@/utils/storage';


export default function TasksScreen() {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        loadTasksFromStorage();
    }, []);

    const loadTasksFromStorage = async () => {
        const storedTasks = await loadTasks();
        setTasks(storedTasks);
    };

    const toggleTaskCompletion = async (taskId: string) => {
        const updatedTasks = tasks.map(task =>
            task.id === taskId ? {...task, completed: !task.completed} : task
        );
        setTasks(updatedTasks);
        await saveTasks(updatedTasks);
    };

    const deleteTask = async (taskId: string) => {
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        setTasks(updatedTasks);
        await saveTasks(updatedTasks);
    };

    const renderTaskItem = ({item}: { item: Task }) => (
        <View style={[styles.taskItem, item.completed && styles.completedTask]}>
            <TouchableOpacity
                style={styles.taskContent}
                onPress={() => toggleTaskCompletion(item.id)}
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
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Tasks👨🏻‍💻</Text>

            {tasks.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>no tasks yet</Text>
                    <Text style={styles.emptySubtext}>Add first task</Text>
                </View>
            ) : (
                <FlatList
                    data={tasks}
                    renderItem={renderTaskItem}
                    keyExtractor={item => item.id}
                    style={styles.taskList}
                />
            )}
        </View>
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
        marginVertical: 6,
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
        alignItems: 'center'
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
        marginBottom: 8
    },
    emptySubtext: {
        fontSize: 14,
        color: '#888'
    }
});