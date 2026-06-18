export const success = (message, data = null) => ({
  success: true,
  message,
  data,
});

export const error = (message) => ({
  success: false,
  message,
});
