export default function AvatarWithFallback({
  src,
  name,
  username,
  size = 48,
  className = "",
}) {
  const getInitial = () => {
    if (name) {
      return name.charAt(0).toUpperCase();
    }
    if (username) {
      // Remove @ if present
      const cleanUsername = username.replace("@", "");
      return cleanUsername.charAt(0).toUpperCase();
    }
    return "?";
  };

  const sizeStyles = {
    24: "w-6 h-6 text-xs",
    32: "w-8 h-8 text-sm",
    40: "w-10 h-10 text-base",
    48: "w-12 h-12 text-lg",
    56: "w-14 h-14 text-xl",
    64: "w-16 h-16 text-2xl",
    80: "w-20 h-20 text-3xl",
  };

  const sizeClass = sizeStyles[size] || sizeStyles[48];

  // If we have a valid image src, try to render it
  if (src && src !== "/placeholder-avatar.png" && !src.includes("?")) {
    return (
      <img
        src={src}
        alt={name || username || "User"}
        className={`${sizeClass} rounded-full object-cover ${className}`}
        onError={(e) => {
          // If image fails to load, replace with fallback div
          e.target.style.display = "none";
          if (e.target.nextSibling) {
            e.target.nextSibling.style.display = "flex";
          }
        }}
      />
    );
  }

  // Fallback: Purple circle with initial
  return (
    <div
      className={`${sizeClass} rounded-full bg-[#7C3AED] text-white font-bold flex items-center justify-center ${className}`}
      style={{
        display: src && src !== "/placeholder-avatar.png" ? "none" : "flex",
      }}
    >
      {getInitial()}
    </div>
  );
}
