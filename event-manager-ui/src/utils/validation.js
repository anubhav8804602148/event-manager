// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const validatePassword = (password) => {
  const requirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[@$!%*?&]/.test(password)
  };
  
  return {
    isValid: Object.values(requirements).every(req => req),
    requirements
  };
};

// Get password strength
export const getPasswordStrength = (password) => {
  const { requirements } = validatePassword(password);
  const strengthCount = Object.values(requirements).filter(Boolean).length;
  
  if (strengthCount <= 2) return 'weak';
  if (strengthCount <= 3) return 'fair';
  if (strengthCount <= 4) return 'good';
  return 'strong';
};

// Form validation helper
export const validateForm = (formData, rules) => {
  const errors = {};
  
  for (const field in rules) {
    const rule = rules[field];
    const value = formData[field];
    
    if (rule.required && (!value || value.trim() === '')) {
      errors[field] = `${field} is required`;
    } else if (rule.email && value && !validateEmail(value)) {
      errors[field] = 'Invalid email address';
    } else if (rule.password && value && !validatePassword(value).isValid) {
      errors[field] = 'Password does not meet requirements';
    } else if (rule.minLength && value && value.length < rule.minLength) {
      errors[field] = `${field} must be at least ${rule.minLength} characters`;
    } else if (rule.maxLength && value && value.length > rule.maxLength) {
      errors[field] = `${field} must not exceed ${rule.maxLength} characters`;
    } else if (rule.pattern && value && !rule.pattern.test(value)) {
      errors[field] = rule.patternMessage || `${field} format is invalid`;
    }
  }
  
  return errors;
};

// Check if form has errors
export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};
