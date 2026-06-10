/**
 * Native persistence — AsyncStorage, exposed through the same {getItem,setItem}
 * interface as the web localStorage wrapper (storage.ts). Metro resolves this
 * file for ios/android.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";

export const storage = {
  getItem(key: string): Promise<string | null> {
    return AsyncStorage.getItem(key);
  },
  setItem(key: string, value: string): Promise<void> {
    return AsyncStorage.setItem(key, value);
  },
};
