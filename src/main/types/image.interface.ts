export interface Dimension<T> {
    width: T;
    height: T;
}

export interface ImageDimensions extends Dimension<number | undefined> {}

export interface ImageCrop extends Dimension<number> {
    left: number;
    top: number;
}

export type ImageType = "jpeg" | "png" | "gif" | "jpg" | "webp";

export interface ImageTransformRequest {
    image: File;
    resize?: ImageDimensions;
    crop?: ImageCrop;
    format?: ImageType;
}

