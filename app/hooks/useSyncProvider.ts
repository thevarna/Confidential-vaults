import { useSyncExternalStore } from "react";
import { store } from "@/utils/store";

export const useSyncProviders = ()=> useSyncExternalStore(store.subscribe, store.value, store.value)