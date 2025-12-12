import React from "react";

type AvatarProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  svg?: string;
  jpg?: string;
  // When true, prefer the JPG even if an SVG exists (useful for colorful raster images
  // when the provided SVG is monochrome or won't display well on the background)
  preferJpg?: boolean;
};

export const Avatar: React.FC<AvatarProps> = ({ svg, jpg, alt, className, preferJpg, ...rest }) => {
  // If preferJpg is true, do not include the SVG <source> so the browser will use the JPG
  // (useful when SVGs are monochrome traces and look bad on the background).
  return (
    <picture>
      {!preferJpg && svg ? <source srcSet={svg} type="image/svg+xml" /> : null}
      <img
        src={preferJpg ? (jpg || svg) : (jpg || svg)}
        alt={alt}
        className={className}
        onError={(e) => {
          if (jpg && e.currentTarget.src !== jpg) e.currentTarget.src = jpg;
        }}
        {...rest}
      />
    </picture>
  );
};

export default Avatar;
