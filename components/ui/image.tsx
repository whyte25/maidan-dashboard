import { imageUrlToBase64, shimmer } from '@/lib/utils';
import Image, { type ImageProps } from 'next/image';

interface Props extends Partial<ImageProps> {
  src: ImageProps['src'];
}

const ImageComponent = (props: Props) => {
  return (
    <Image
      {...props}
      fill={props.fill || true}
      alt={props.alt || ''}
      placeholder={`data:image/svg+xml;base64,${imageUrlToBase64(shimmer(100, 100))}`}
      priority={props.priority || true}
      unoptimized={props.unoptimized || true}
    />
  );
};

export default ImageComponent;
