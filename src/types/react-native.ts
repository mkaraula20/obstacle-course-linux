/**
 * Types for the subset of the React Native API this app uses.
 *
 * tsconfig maps `"react-native"` to this file (compilerOptions.paths), so the
 * type-checker uses these permissive declarations on BOTH the web build (where
 * Vite aliases the runtime to react-native-web) and the native build (where
 * Metro bundles the real react-native). That lets web-only style values such as
 * position:"fixed" / onHoverIn type-check without fighting the stricter real RN
 * types, while real RN provides the actual runtime on device.
 *
 * These are ambient declarations (`export declare`) — no runtime, no emit.
 */
import * as React from "react";

export type ViewStyle = Record<string, unknown>;
export type TextStyle = Record<string, unknown>;
export type StyleProp<T> = T | StyleProp<T>[] | null | undefined | false;

export interface GestureResponderEvent {
  nativeEvent: unknown;
}

type PressState = { pressed: boolean; hovered?: boolean; focused?: boolean };

interface ViewProps {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  testID?: string;
  pointerEvents?: "auto" | "none" | "box-none" | "box-only";
  onLayout?: (event: { nativeEvent: { layout: { width: number; height: number } } }) => void;
  [key: string]: unknown;
}
export declare const View: React.ComponentType<ViewProps>;

interface TextProps {
  style?: StyleProp<TextStyle>;
  children?: React.ReactNode;
  testID?: string;
  numberOfLines?: number;
  selectable?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  [key: string]: unknown;
}
export declare const Text: React.ComponentType<TextProps>;

interface PressableProps {
  style?: StyleProp<ViewStyle> | ((state: PressState) => StyleProp<ViewStyle>);
  children?: React.ReactNode | ((state: PressState) => React.ReactNode);
  onPress?: (event: GestureResponderEvent) => void;
  onHoverIn?: () => void;
  onHoverOut?: () => void;
  disabled?: boolean;
  testID?: string;
  [key: string]: unknown;
}
export declare const Pressable: React.ComponentType<PressableProps>;

interface TextInputProps {
  style?: StyleProp<TextStyle>;
  value?: string;
  onChangeText?: (text: string) => void;
  onKeyPress?: (event: { nativeEvent: { key: string } }) => void;
  onSubmitEditing?: () => void;
  placeholder?: string;
  placeholderTextColor?: string;
  keyboardType?: "default" | "numeric" | "email-address" | "number-pad";
  inputMode?: "text" | "numeric" | "email" | "search" | "decimal";
  multiline?: boolean;
  editable?: boolean;
  testID?: string;
  [key: string]: unknown;
}
export declare const TextInput: React.ComponentType<TextInputProps>;

interface ScrollViewProps {
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  horizontal?: boolean;
  testID?: string;
  [key: string]: unknown;
}
export declare const ScrollView: React.ComponentType<ScrollViewProps>;

interface ActivityIndicatorProps {
  size?: "small" | "large" | number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  [key: string]: unknown;
}
export declare const ActivityIndicator: React.ComponentType<ActivityIndicatorProps>;

export declare const StyleSheet: {
  create<T extends { [key: string]: ViewStyle | TextStyle }>(styles: T): T;
  flatten(style?: StyleProp<ViewStyle | TextStyle>): Record<string, unknown>;
  absoluteFillObject: ViewStyle;
  hairlineWidth: number;
};

export declare function useWindowDimensions(): {
  width: number;
  height: number;
  scale: number;
  fontScale: number;
};

export declare const AppRegistry: {
  registerComponent(appKey: string, getComponent: () => React.ComponentType<Record<string, unknown>>): void;
  runApplication(appKey: string, params: { rootTag: Element | null; initialProps?: Record<string, unknown> }): void;
};

export declare const Platform: {
  OS: "web" | "ios" | "android";
  select<T>(specifics: { [platform: string]: T }): T | undefined;
};

export declare const BackHandler: {
  addEventListener(
    event: "hardwareBackPress",
    handler: () => boolean
  ): { remove: () => void };
};
