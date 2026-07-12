const validRoles = ["MEMBER", "TRAINER", "ADMIN"];

function normalizeSocialLinks(value) {
  if (!value) return null;
  if (typeof value !== "object" || Array.isArray(value)) return null;
  const normalized = {};
  for (const [key, url] of Object.entries(value)) {
    if (typeof url === "string" && url.trim()) {
      normalized[key] = url.trim();
    }
  }
  return Object.keys(normalized).length ? normalized : null;
}

function validateSocialLinks(value) {
  if (!value) return { error: null };
  if (typeof value !== "object" || Array.isArray(value))
    return { error: { message: "Social links must be an object" } };
  for (const url of Object.values(value)) {
    if (typeof url === "string" && url.trim()) {
      try {
        new URL(url);
      } catch {
        return { error: { message: "Social links must be valid URLs" } };
      }
    }
  }
  return { error: null };
}

export const registerSchema = {
  validate(data) {
    if (!data.email || !data.password) return { error: { message: "Email and password are required" } };
    return { error: null };
  },
};

export const loginSchema = {
  validate(data) {
    if (!data.email || !data.password) return { error: { message: "Email and password are required" } };
    return { error: null };
  },
};

export const createUserSchema = {
  validate(data) {
    if (!data.name || !data.email || !data.password) {
      return { error: { message: "Name, email, and password are required" } };
    }
    if (data.role && !validRoles.includes(data.role)) {
      return { error: { message: "Invalid role" } };
    }
    if (data.phone && typeof data.phone !== "string") {
      return { error: { message: "Phone must be a string" } };
    }
    const socialCheck = validateSocialLinks(data.socialLinks ?? normalizeSocialLinks(data.socialLinks));
    if (socialCheck.error) return socialCheck;
    return { error: null };
  },
};

export const updateUserSchema = {
  validate(data) {
    if (data.role && !validRoles.includes(data.role)) {
      return { error: { message: "Invalid role" } };
    }
    if (data.phone && typeof data.phone !== "string") {
      return { error: { message: "Phone must be a string" } };
    }
    const socialCheck = validateSocialLinks(data.socialLinks ?? normalizeSocialLinks(data.socialLinks));
    if (socialCheck.error) return socialCheck;
    return { error: null };
  },
};
