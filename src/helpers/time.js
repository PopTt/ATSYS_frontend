export const GetCurrentDateTime24Format = () => {
  var now = new Date();
  return (
    now.getFullYear() +
    '-' +
    ('0' + (now.getMonth() + 1)).slice(-2) +
    '-' +
    ('0' + (now.getDate() + 1)).slice(-2) +
    'T' +
    GetCurrentTime24Format()
  );
};

export const GetCurrentTime24Format = () => {
  return new Date().toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });
};

export function RefactorDateTime(date) {
  const given = new Date(date);
  var ampm = given.getHours() > 12 ? 'pm' : 'am';

  return (
    ('0' + given.getDate()).slice(-2) +
    '-' +
    ('0' + (given.getMonth() + 1)).slice(-2) +
    '-' +
    given.getFullYear() +
    ', ' +
    ('0' + given.getHours()).slice(-2) +
    ':' +
    ('0' + given.getMinutes()).slice(-2) +
    ampm
  );
}
