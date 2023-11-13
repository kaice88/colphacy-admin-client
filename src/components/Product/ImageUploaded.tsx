import {
  Control,
  Controller,
  FieldArrayWithId,
  UseFieldArrayRemove,
} from 'react-hook-form';
import { CloseButton, Image } from '@mantine/core';
import { Product } from './type';
import { modals } from '@mantine/modals';
const ImageUploaded: React.FC<{
  imageField: FieldArrayWithId<Product, 'images', 'id'>;
  index: number;
  control: Control<Product> | undefined;
  removeImage: UseFieldArrayRemove;
  mode: 'VIEW' | 'ADD' | 'EDIT';
}> = ({ imageField, index, control, removeImage, mode }) => {
  const handleImage = (url: string) =>
    modals.open({
      title: 'Preview Image',
      centered: true,
      children: <Image src={url} alt="preview Image" />,
      className: 'modal_preview_image',
    });

  return (
    <Controller
      name={`images.${index}.url` as const}
      control={control}
      render={({ field }) => (
        <div
          {...field}
          style={{
            position: 'relative',
            width: 100,
            height: 100,
            overflow: 'hidden',
            borderRadius: 5,
            boxShadow: '1px 1px 5px 1px grey',
          }}
        >
          <Image
            src={imageField.url}
            width={90}
            height={90}
            style={{ objectFit: 'cover', cursor: 'pointer', margin: 'auto' }}
            onClick={() => handleImage(imageField.url)}
          />
          {mode !== 'VIEW' && (
            <CloseButton
              radius="xl"
              variant="hover"
              title="Delete"
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                zIndex: 1,
                padding: 0,
                width: 10,
                height: 10,
                backgroundColor: 'rgba(255, 255, 255)',
              }}
              onClick={() => removeImage(index)}
            />
          )}
        </div>
      )}
    />
  );
};
export default ImageUploaded;
