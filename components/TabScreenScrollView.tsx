import { ScrollView, ScrollViewProps } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

type TabScreenScrollViewProps = ScrollViewProps & {
  contentContainerStyle?: ScrollViewProps['contentContainerStyle'];
};

export function TabScreenScrollView({
  children,
  contentContainerStyle,
  ...props
}: TabScreenScrollViewProps) {
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <ScrollView
      {...props}
      scrollIndicatorInsets={{ bottom: tabBarHeight }}
      contentContainerStyle={[{ paddingBottom: tabBarHeight }, contentContainerStyle]}>
      {children}
    </ScrollView>
  );
}
