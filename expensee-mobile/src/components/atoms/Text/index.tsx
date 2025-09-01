import React from 'react';
import {Text as RNText, TextProps as RNTextProps} from 'react-native';
import {colors, typography} from '@/theme';

export type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'body'
  | 'bodySmall'
  | 'caption'
  | 'label';

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: string;
  bold?: boolean;
  medium?: boolean;
  semibold?: boolean;
  italic?: boolean;
  underline?: boolean;
  center?: boolean;
  right?: boolean;
}

/**
 * Text component that implements the typography system
 *
 * Usage:
 * ```jsx
 * <Text variant="h1">Heading 1</Text>
 * <Text variant="body" bold>Bold body text</Text>
 * <Text color={colors.primary.main}>Colored text</Text>
 * ```
 */
export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color = colors.neutral.textDark,
  style,
  bold = false,
  medium = false,
  semibold = false,
  italic = false,
  underline = false,
  center = false,
  right = false,
  children,
  ...props
}) => {
  // Define variant styles
  const variantStyles = {
    h1: {
      fontSize: typography.fontSize['3xl'],
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.fontSize['3xl'] * typography.lineHeight.tight,
    },
    h2: {
      fontSize: typography.fontSize['2xl'],
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.fontSize['2xl'] * typography.lineHeight.tight,
    },
    h3: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.fontSize.xl * typography.lineHeight.tight,
    },
    h4: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.medium,
      lineHeight: typography.fontSize.lg * typography.lineHeight.tight,
    },
    body: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.regular,
      lineHeight: typography.fontSize.md * typography.lineHeight.base,
    },
    bodySmall: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.regular,
      lineHeight: typography.fontSize.sm * typography.lineHeight.base,
    },
    caption: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.regular,
      lineHeight: typography.fontSize.xs * typography.lineHeight.relaxed,
    },
    label: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      lineHeight: typography.fontSize.sm * typography.lineHeight.base,
    },
  };

  // Determine text alignment
  let textAlign = undefined;
  if (center) textAlign = 'center';
  if (right) textAlign = 'right';

  // Determine font weight
  let fontWeight = variantStyles[variant].fontWeight;
  if (bold) fontWeight = typography.fontWeight.bold;
  if (medium) fontWeight = typography.fontWeight.medium;
  if (semibold) fontWeight = typography.fontWeight.semibold;

  return (
    <RNText
      style={[
        variantStyles[variant],
        {
          color,
          fontWeight,
          fontStyle: italic ? 'italic' : 'normal',
          textDecorationLine: underline ? 'underline' : 'none',
          textAlign,
        },
        style,
      ]}
      {...props}>
      {children}
    </RNText>
  );
};

// Named exports for specific variants to improve readability in component usage
export const H1: React.FC<Omit<TextProps, 'variant'>> = props => (
  <Text variant="h1" {...props} />
);
export const H2: React.FC<Omit<TextProps, 'variant'>> = props => (
  <Text variant="h2" {...props} />
);
export const H3: React.FC<Omit<TextProps, 'variant'>> = props => (
  <Text variant="h3" {...props} />
);
export const H4: React.FC<Omit<TextProps, 'variant'>> = props => (
  <Text variant="h4" {...props} />
);
export const Body: React.FC<Omit<TextProps, 'variant'>> = props => (
  <Text variant="body" {...props} />
);
export const BodySmall: React.FC<Omit<TextProps, 'variant'>> = props => (
  <Text variant="bodySmall" {...props} />
);
export const Caption: React.FC<Omit<TextProps, 'variant'>> = props => (
  <Text variant="caption" {...props} />
);
export const Label: React.FC<Omit<TextProps, 'variant'>> = props => (
  <Text variant="label" {...props} />
);
