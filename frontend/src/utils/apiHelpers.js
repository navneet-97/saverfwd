/**
 * Build query params with proper nesting for Spring Boot @ModelAttribute binding.
 * Backend expects: ?filter.title=xyz&filter.foodType=PREPARED_MEAL&pageable.page=0&pageable.size=12
 */
export function buildParams(filter = {}, pageable = {}) {
  const params = {};

  Object.entries(filter).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params[key] = value;
    }
  });

  Object.entries(pageable).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params[key] = value;
    }
  });

  return params;
}
