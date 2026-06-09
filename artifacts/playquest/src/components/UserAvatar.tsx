import { User } from "@/lib/store";
import { getInitials } from "@/lib/utils";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

const SIZES: Record<AvatarSize, { wh: string; text: string; radius: string }> = {
  xs: { wh: "w-6 h-6",   text: "text-[8px]",  radius: "rounded-full" },
  sm: { wh: "w-8 h-8",   text: "text-[10px]", radius: "rounded-full" },
  md: { wh: "w-10 h-10", text: "text-[13px]", radius: "rounded-full" },
  lg: { wh: "w-16 h-16", text: "text-xl",     radius: "rounded-2xl"  },
  xl: { wh: "w-24 h-24", text: "text-2xl",    radius: "rounded-2xl"  },
};

interface UserAvatarProps {
  user: Pick<User, "username" | "avatarColor" | "avatarUrl">;
  size?: AvatarSize;
  className?: string;
  style?: React.CSSProperties;
  square?: boolean;
}

export function UserAvatar({ user, size = "md", className = "", style = {}, square = false }: UserAvatarProps) {
  const { wh, text, radius } = SIZES[size];
  const shape = square ? radius : "rounded-full";

  if (user.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={user.username}
        className={`${wh} ${shape} object-cover flex-shrink-0 ${className}`}
        style={style}
        onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
    );
  }

  return (
    <div
      className={`${wh} ${text} ${shape} flex items-center justify-center font-bold text-white flex-shrink-0 ${className}`}
      style={{ background: user.avatarColor, boxShadow: `0 0 14px ${user.avatarColor}50`, ...style }}
    >
      {getInitials(user.username)}
    </div>
  );
}
