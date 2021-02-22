export type DownloadType = 'light' | 'full' | 'flat' | 'audio-features';

export const downloadFile = (data: any, type: DownloadType): void => {
  const date = new Date();
  const fileName = `spotify-library-${type}__${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;

  const json = JSON.stringify(data);
  const blob = new Blob([json], { type: 'application/json' });

  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = URL.createObjectURL(blob);
  link.download = fileName + '.json';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
