import { ToastContext } from '@asap-hub/react-context';
import imageCompression from 'browser-image-compression';
import { useContext, useState } from 'react';
import { useDeleteUserAvatarById, usePatchUserAvatarById } from './state';

type UseManageUserAvatarOptions = {
  // when false the Auth0 token is not refreshed by the avatar mutation;
  // used when a following mutation (e.g. patchUser on form save) refreshes it
  refreshToken?: boolean;
};

export const useManageUserAvatar = (
  id: string,
  { refreshToken = true }: UseManageUserAvatarOptions = {},
) => {
  const [avatarSaving, setAvatarSaving] = useState(false);
  const patchUserAvatar = usePatchUserAvatarById(id);
  const deleteUserAvatar = useDeleteUserAvatarById(id);

  const toast = useContext(ToastContext);

  const onImageSelect = (file: File) => {
    setAvatarSaving(true);
    return imageCompression(file, { maxSizeMB: 2 })
      .then((compressedFile) =>
        imageCompression.getDataUrlFromFile(compressedFile),
      )
      .then((encodedFile) => patchUserAvatar(encodedFile, { refreshToken }))
      .catch(() =>
        toast('There was an error and we were unable to save your picture'),
      )
      .finally(() => setAvatarSaving(false));
  };

  const onImageRemove = () => {
    setAvatarSaving(true);
    return deleteUserAvatar({ refreshToken })
      .catch(() =>
        toast('There was an error and we were unable to remove your picture'),
      )
      .finally(() => setAvatarSaving(false));
  };

  return {
    avatarSaving,
    onImageSelect,
    onImageRemove,
  };
};
