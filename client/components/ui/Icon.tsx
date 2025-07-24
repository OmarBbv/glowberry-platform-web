'use client';

import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Star,
  Wallet,
  X,
  Copy,
  ThumbsUp,
  ArrowLeftRight,
  Share2,
  MessageCircleWarning,
  ChevronRight,
  CircleQuestionMark,
  User,
  LocationEdit,
} from 'lucide-react';

const icons = {
  heart: Heart,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  wallet: Wallet,
  x: X,
  star: Star,
  copy: Copy,
  thumbsup: ThumbsUp,
  'left-right': ArrowLeftRight,
  share: Share2,
  'message-circle-warning': MessageCircleWarning,
  right: ChevronRight,
  questionMark: CircleQuestionMark,
  user: User,
  location: LocationEdit,
} as const;

type IconName = keyof typeof icons;

interface Props {
  name: IconName;
  className?: string;
  size?: number;
  color?: string;
  fill?: string;
  strokeWidth?: number;
}

export const Icon = ({
  name,
  className,
  size = 24,
  color = '#333',
  fill = 'transparent',
  strokeWidth = 2,
}: Props) => {
  const IconComponent = icons[name];

  return (
    <IconComponent
      fill={fill}
      strokeWidth={strokeWidth}
      className={className}
      size={size}
      color={color}
    />
  );
};
