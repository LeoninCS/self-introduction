const picture = (file) => `/picture/${file}`;
const preview = (file) => `/picture/preview/${file.replace(/\.[^.]+$/, '.jpg')}`;

export const archivePhotos = [
  {
    src: picture('35-programming-contest-team-photo.jpg'),
    previewSrc: preview('35-programming-contest-team-photo.jpg'),
    title: 'Programming Contest',
    meta: 'Team / ACM Training',
    alt: 'Programming contest team photo',
  },
];
