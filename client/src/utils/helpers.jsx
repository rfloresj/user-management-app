export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return isNaN(date.getTime())
    ? 'Invalid date'
    : date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
};
