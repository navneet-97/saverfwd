export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address';
  return '';
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  // Backend pattern: ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[a-z]/.test(password)) return 'Password must contain a lowercase letter';
  if (!/[A-Z]/.test(password)) return 'Password must contain an uppercase letter';
  if (!/\d/.test(password)) return 'Password must contain a number';
  if (!/[^a-zA-Z\d]/.test(password)) return 'Password must contain a special character';
  return '';
};

export const validateConfirmPassword = (password, confirm) => {
  if (!confirm) return 'Please confirm your password';
  if (password !== confirm) return 'Passwords do not match';
  return '';
};

export const validatePhoneNumber = (phone) => {
  if (!phone) return 'Phone number is required';
  // Backend pattern: ^[6-9]\d{9}$
  if (!/^[6-9]\d{9}$/.test(phone.replace(/[\s\-+]/g, ''))) {
    return 'Please enter a valid 10-digit Indian phone number';
  }
  return '';
};

export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`;
  }
  return '';
};

export const validateMinLength = (value, min, fieldName) => {
  if (value && value.length < min) {
    return `${fieldName} must be at least ${min} characters`;
  }
  return '';
};

export const validateMaxLength = (value, max, fieldName) => {
  if (value && value.length > max) {
    return `${fieldName} must be ${max} characters or less`;
  }
  return '';
};

export const validateMinValue = (value, min, fieldName) => {
  if (value === '' || value === null || value === undefined) return `${fieldName} is required`;
  if (Number(value) < min) return `${fieldName} must be at least ${min}`;
  return '';
};

export const validateFutureDate = (date, fieldName) => {
  if (!date) return `${fieldName} is required`;
  if (new Date(date) <= new Date()) return `${fieldName} must be in the future`;
  return '';
};

// Validate CreateFoodRequest fields matching backend rules
export const validateFoodListing = (data) => {
  const errors = {};

  // Title: required, 3-50 chars
  const titleError =
    validateRequired(data.title, 'Title') ||
    validateMinLength(data.title, 3, 'Title') ||
    validateMaxLength(data.title, 50, 'Title');
  if (titleError) errors.title = titleError;

  // Description: optional, max 400 chars
  if (data.description) {
    const descError = validateMaxLength(data.description, 400, 'Description');
    if (descError) errors.description = descError;
  }

  // Food type: required enum
  if (!data.foodType) errors.foodType = 'Food type is required';

  // Quantity: required, > 0
  if (!data.quantity || Number(data.quantity) <= 0) errors.quantity = 'Quantity must be greater than 0';

  // Unit: required enum
  if (!data.unit) errors.unit = 'Unit is required';

  // Listing type: required enum
  if (!data.listingType) errors.listingType = 'Listing type is required';

  // Price: required for SALE, must be > 0
  if (data.listingType === 'SALE') {
    const priceError = validateMinValue(data.price, 1, 'Price');
    if (priceError) errors.price = priceError;
  }

  // Expiry time: required, must be in the future
  if (!data.expiryTime) {
    errors.expiryTime = 'Expiry time is required';
  } else if (new Date(data.expiryTime) <= new Date()) {
    errors.expiryTime = 'Expiry time must be in the future';
  }

  // Pickup address: required, 10-400 chars
  if (!data.pickupAddress) {
    errors.pickupAddress = 'Pickup address is required';
  } else if (data.pickupAddress.length < 10) {
    errors.pickupAddress = 'Pickup address must be at least 10 characters';
  } else if (data.pickupAddress.length > 400) {
    errors.pickupAddress = 'Pickup address must be 400 characters or less';
  }

  // Pickup start time: required
  if (!data.pickupStartTime) errors.pickupStartTime = 'Pickup start time is required';

  // Pickup end time: required
  if (!data.pickupEndTime) errors.pickupEndTime = 'Pickup end time is required';

  // Pickup start must be before pickup end
  if (data.pickupStartTime && data.pickupEndTime) {
    if (new Date(data.pickupStartTime) >= new Date(data.pickupEndTime)) {
      errors.pickupEndTime = 'Pickup end time must be after start time';
    }
  }

  // Pickup end must be before expiry
  if (data.pickupEndTime && data.expiryTime) {
    if (new Date(data.pickupEndTime) >= new Date(data.expiryTime)) {
      errors.pickupEndTime = 'Pickup end time must be before expiry time';
    }
  }

  // Latitude: required, -90 to 90
  if (data.latitude === '' || data.latitude === null || data.latitude === undefined) {
    errors.latitude = 'Location is required';
  } else if (Number(data.latitude) < -90 || Number(data.latitude) > 90) {
    errors.latitude = 'Invalid latitude';
  }

  // Longitude: required, -180 to 180
  if (data.longitude === '' || data.longitude === null || data.longitude === undefined) {
    errors.longitude = 'Location is required';
  } else if (Number(data.longitude) < -180 || Number(data.longitude) > 180) {
    errors.longitude = 'Invalid longitude';
  }

  return errors;
};

export const validateLogin = (data) => {
  const errors = {};
  if (!data.email) errors.email = 'Email is required';
  if (!data.password) errors.password = 'Password is required';
  return errors;
};

export const validateRegister = (data) => {
  const errors = {};

  const nameError = validateRequired(data.fullName, 'Full name') ||
    validateMinLength(data.fullName, 3, 'Full name');
  if (nameError) errors.fullName = nameError;

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  const phoneError = validatePhoneNumber(data.phoneNumber);
  if (phoneError) errors.phoneNumber = phoneError;

  const pwError = validatePassword(data.password);
  if (pwError) errors.password = pwError;

  const confirmError = validateConfirmPassword(data.password, data.confirmPassword);
  if (confirmError) errors.confirmPassword = confirmError;

  return errors;
};
