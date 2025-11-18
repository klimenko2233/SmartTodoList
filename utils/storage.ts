import {Task} from '@/types/task';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_KEY = 'tasks';

export const loadTasks = async (): Promise<Task[]> => {
    try {
        const tasksJson = await AsyncStorage.getItem(TASKS_KEY);
        return tasksJson ? JSON.parse(tasksJson) : [];
    } catch (error) {
        console.error('Error loading tasks:', error);
        return [];
    }
};

export const saveTasks = async (tasks: Task[]): Promise<void> => {
    try {
        await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    } catch (error) {
        console.error('Error saving tasks:', error);
    }
}