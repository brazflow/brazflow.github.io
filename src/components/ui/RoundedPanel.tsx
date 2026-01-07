import type { ReactNode } from 'react';

interface RoundedPanelProps {
  children: ReactNode;
  className?: string;
}

/**
 * RoundedPanel - A reusable container component with consistent styling
 * 
 * Provides a styled container with rounded corners, shadow, and border.
 * Used throughout the application for consistent panel styling.
 * 
 * @example
 * ```tsx
 * <RoundedPanel>
 *   <YourContent />
 * </RoundedPanel>
 * ```
 */
export default function RoundedPanel({ children, className = '' }: RoundedPanelProps) {
  return (
    <div
      className={`bg-brazflow-panel rounded-[10px] shadow-[0_4px_8px_rgba(0,0,0,0.2)] border border-brazflow-panel-border p-5 ${className}`}
    >
      {children}
    </div>
  );
}
