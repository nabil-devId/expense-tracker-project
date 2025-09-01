import React, {useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  PanResponder,
  Keyboard,
} from 'react-native';
import {colors, borderRadius} from '@/theme';
import {Text} from '../../atoms/Text';
import {Icon} from '../../atoms/Icon';
import {Divider} from '../../atoms/Divider';

const {height} = Dimensions.get('window');

export interface BottomSheetProps {
  /**
   * Whether the bottom sheet is visible
   */
  visible: boolean;
  /**
   * Function to call when the bottom sheet is closed
   */
  onClose: () => void;
  /**
   * Title of the bottom sheet
   */
  title?: string;
  /**
   * Content of the bottom sheet
   */
  children: React.ReactNode;
  /**
   * Height of the bottom sheet (percentage of screen height)
   */
  height?: number;
  /**
   * Whether to show a handle at the top
   */
  showHandle?: boolean;
  /**
   * Whether to close the bottom sheet when backdrop is pressed
   */
  closeOnBackdropPress?: boolean;
  /**
   * Whether the bottom sheet content is scrollable
   */
  scrollable?: boolean;
  /**
   * Footer content for the bottom sheet
   */
  footer?: React.ReactNode;
}

/**
 * BottomSheet component for displaying content in a sliding panel from the bottom
 *
 * Usage:
 * ```jsx
 * const [visible, setVisible] = useState(false);
 *
 * <BottomSheet
 *   visible={visible}
 *   onClose={() => setVisible(false)}
 *   title="Filter Expenses"
 * >
 *   <Text>Content goes here</Text>
 * </BottomSheet>
 * ```
 */
export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  title,
  children,
  height: heightPercentage = 50,
  showHandle = true,
  closeOnBackdropPress = true,
  scrollable = false,
  footer,
}) => {
  // Convert percentage to actual height
  const sheetHeight = (height * heightPercentage) / 100;

  // Animation value for sheet position
  const translateY = useRef(new Animated.Value(sheetHeight)).current;

  // Show animation
  const showBottomSheet = () => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 4,
    }).start();
  };

  // Hide animation
  const hideBottomSheet = () => {
    Keyboard.dismiss();
    Animated.timing(translateY, {
      toValue: sheetHeight,
      duration: 250,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  // Initialize pan responder for dragging
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          // Only allow dragging down
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // If dragged down past threshold, close the sheet
        if (gestureState.dy > sheetHeight / 3 || gestureState.vy > 0.5) {
          hideBottomSheet();
        } else {
          // Otherwise, snap back to open position
          showBottomSheet();
        }
      },
    }),
  ).current;

  // Show the sheet when it becomes visible
  useEffect(() => {
    if (visible) {
      showBottomSheet();
    }
  }, [visible]);

  // Don't render anything if not visible
  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={hideBottomSheet}>
      <View style={styles.modalContainer}>
        {/* Backdrop */}
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={closeOnBackdropPress ? hideBottomSheet : undefined}
        />

        {/* Bottom Sheet */}
        <Animated.View
          style={[
            styles.sheet,
            {
              height: sheetHeight,
              transform: [{translateY}],
            },
          ]}>
          {/* Handle and Title Area */}
          <View
            {...(showHandle ? panResponder.panHandlers : {})}
            style={styles.header}>
            {showHandle && <View style={styles.handle} />}

            {title && (
              <>
                <Text variant="h4">{title}</Text>
                <TouchableOpacity
                  onPress={hideBottomSheet}
                  style={styles.closeButton}>
                  <Icon name="close" size={24} />
                </TouchableOpacity>
                <Divider margin={8} />
              </>
            )}
          </View>

          {/* Content */}
          <View
            style={[
              styles.content,
              scrollable && styles.scrollableContent,
              footer && styles.hasFooter,
            ]}>
            {children}
          </View>

          {/* Footer */}
          {footer && <View style={styles.footer}>{footer}</View>}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: -1,
  },
  sheet: {
    backgroundColor: colors.neutral.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: 20,
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.neutral.borderDark,
    alignSelf: 'center',
    marginBottom: 10,
  },
  header: {
    marginBottom: 10,
  },
  content: {
    flex: 1,
  },
  scrollableContent: {
    overflow: 'scroll',
  },
  hasFooter: {
    marginBottom: 16,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.neutral.border,
    paddingTop: 16,
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 4,
  },
});
