import { ToastContext } from '@asap-hub/react-context';
import imageCompression from 'browser-image-compression';
import { useContext, useState } from 'react';
import { usePostUserAvatarById } from '../users/state';

export const useSelectAvatar = (id: string) => {
  const [avatarSaving, setAvatarSaving] = useState(false);
  const postUserAvatar = usePostUserAvatarById(id);

  const toast = useContext(ToastContext);

  const onImageSelect = (file: File) => {
    setAvatarSaving(true);
    imageCompression(file, { maxSizeMB: 2 })
      .then((compressedFile) =>
        imageCompression.getDataUrlFromFile(compressedFile),
      )
      .then((encodedFile) => postUserAvatar(encodedFile))
      .catch(() =>
        toast('There was an error and we were unable to save your picture'),
      )
      .finally(() => setAvatarSaving(false));
  };

  return {
    avatarSaving,
    onImageSelect,
  };
};
