export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address';
  return '';
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return '';
};

export const validateConfirmPassword = (password, confirm) => {
  if (!confirm) return 'Please confirm your password';
  if (password !== confirm) return 'Passwords do not match';
  return '';
};

export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`;
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

export const validateFoodListing = (data) => {
  const errors = {};

  const titleError =
    validateRequired(data.title, 'Title') ||
    validateMaxLength(data.title, 100, 'Title');
  if (titleError) errors.title = titleError;

  if (data.description) {
    const descError = validateMaxLength(data.description, 1000, 'Description');
    if (descError) errors.description = descError;
  }

  if (!data.foodType) errors.foodType = 'Food type is required';
  if (!data.quantity || Number(data.quantity) <= 0) errors.quantity = 'Quantity must be greater than 0';
  if (!data.unit) errors.unit = 'Unit is required';
  if (!data.listingType) errors.listingType = 'Listing type is required';

  if (data.listingType === 'SALE') {
    const priceError = validateMinValue(data.price, 1, 'Price');
    if (priceError) errors.price = priceError;
  }

  if (!data.expiryDate) errors.expiryDate = 'Expiry date is required';
  if (!data.expiryTime) errors.expiryTime = 'Expiry time is required';
  if (!data.pickupAddress) errors.pickupAddress = 'Pickup address is required';
  if (!data.pickupStartTime) errors.pickupStartTime = 'Pickup start time is required';
  if (!data.pickupEndTime) errors.pickupEndTime = 'Pickup end time is required';

  if (data.pickupStartTime && data.pickupEndTime) {
    if (data.pickupStartTime >= data.pickupEndTime) {
      errors.pickupEndTime = 'Pickup end time must be after start time';
    }
  }

  return errors;
};

export const validateLogin = (data) => {
  const errors = {};
  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;
  if (!data.password) errors.password = 'Password is required';
  return errors;
};

export const validateRegister = (data) => {
  const errors = {};
  const nameError = validateRequired(data.fullName, 'Full name');
  if (nameError) errors.fullName = nameError;

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  if (!data.phoneNumber) errors.phoneNumber = 'Phone number is required';
  if (data.phoneNumber && !/^\+?[\d\s-]{7,15}$/.test(data.phoneNumber)) {
    errors.phoneNumber = 'Please enter a valid phone number';
  }

  const pwError = validatePassword(data.password);
  if (pwError) errors.password = pwError;

  const confirmError = validateConfirmPassword(data.password, data.confirmPassword);
  if (confirmError) errors.confirmPassword = confirmError;

  return errors;
};
