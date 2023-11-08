import { useMutation } from '@tanstack/react-query';
import { UPLOAD_IMAGES } from '../constants/apis';
import axios from '../settings/axios';

function useImage() {
  const handleUploadImages = useMutation({
    mutationKey: ['upload-images'],
    mutationFn: (data) => {
      return axios.post(UPLOAD_IMAGES, data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return {
    uploadImages: handleUploadImages,
  };
}
export default useImage;
