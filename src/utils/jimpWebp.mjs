// https://github.com/jimp-dev/jimp/issues/1366#issuecomment-3715152433
import WebpWasm from 'webp-wasm';
import { z } from 'zod';

const WebpOptionsSchema = z.object({
  /**
   * Image quality, between 0 and 100.
   * For lossy, 0 gives the smallest size and 100 the largest.
   * For lossless, this parameter is the amount of effort put
   * into the compression: 0 is the fastest but gives larger
   * files compared to the slowest, but best, 100.
   * @default 100
   */
  quality: z.number().min(0).max(100).optional().default(100),
  /** If non-zero, set the desired target size in bytes. */
  targetSize: z.number().min(0).optional().default(0),
  /** If non-zero, specifies the minimal distortion to try to achieve. Takes precedence over target_size. */
  targetPSNR: z.number().min(0).optional().default(0),
  /** Quality/speed trade-off (0 = fast, 6 = slower-better). */
  method: z.number().min(0).max(6).optional().default(4),
  /** Spatial Noise Shaping. 0 = off, 100 = maximum. */
  snsStrength: z.number().min(0).max(100).optional().default(50),
  /** Range: 0 = off, 100 = strongest. */
  filterStrength: z.number().min(0).max(100).optional().default(60),
  /** Range: 0 = off, 7 = least sharp. */
  filterSharpness: z.number().min(0).max(7).optional().default(0),
  /** Filtering type: 0 = simple, 1 = strong (only used if filter_strength > 0 or autofilter > 0). */
  filterType: z.number().min(0).max(1).optional().default(1),
  /** log2(number of token partitions) in 0..3. Default is set to 0 for easier progressive decoding. */
  partitions: z.number().min(0).max(3).optional().default(0),
  /** Maximum number of segments to use, in 1..4. */
  segments: z.number().min(1).max(4).optional().default(4),
  /** Number of entropy-analysis passes (in 1..10). */
  pass: z.number().min(1).max(10).optional().default(1),
  /** If true, export the compressed picture back. In-loop filtering is not applied. */
  showCompressed: z
    .union([z.literal(1), z.literal(0)])
    .optional()
    .default(0),
  /** Preprocessing filter (0 = none, 1 = segment-smooth). */
  preprocessing: z
    .union([z.literal(1), z.literal(0)])
    .optional()
    .default(0),
  /** Auto adjust filter's strength (0 = off, 1 = on). */
  autoFilter: z
    .union([z.literal(1), z.literal(0)])
    .optional()
    .default(0),
  /** Quality degradation allowed to fit the 512k limit on prediction modes coding (0 = no degradation, 100 = maximum possible degradation). */
  partitionLimit: z.number().min(0).max(100).optional().default(0),
  /** Algorithm for encoding the alpha plane (0 = none, 1 = compressed with WebP lossless). */
  alphaCompression: z
    .union([z.literal(1), z.literal(0)])
    .optional()
    .default(1),
  /** Predictive filtering method for alpha plane (0 = none, 1 = fast, 2 = best). */
  alphaFiltering: z
    .union([z.literal(0), z.literal(1), z.literal(2)])
    .optional()
    .default(1),
  /** Between 0 (smallest size) and 100 (lossless). */
  alphaQuality: z.number().min(0).max(100).optional().default(100),
  /** Set to 1 for lossless encoding (default is lossy). */
  lossless: z
    .union([z.literal(1), z.literal(0)])
    .optional()
    .default(0),
  /** By default, RGB values in transparent areas will be modified to improve compression. Set exact to 1 to prevent this. */
  exact: z
    .union([z.literal(1), z.literal(0)])
    .optional()
    .default(0),
  /** If true, compression parameters will be remapped to better match the expected output size from JPEG compression. Generally, the output size will be similar but the degradation will be lower. */
  emulateJpegSize: z
    .union([z.literal(1), z.literal(0)])
    .optional()
    .default(0),
  /** If non-zero, try and use multi-threaded encoding. */
  threadLevel: z.number().min(0).optional().default(0),
  /** Reduce memory usage (slower encoding). */
  lowMemory: z
    .union([z.literal(1), z.literal(0)])
    .optional()
    .default(0),
  /** Near lossless encoding (0 = max loss, 100 = off). */
  nearLossless: z.number().min(0).max(100).optional().default(100),
  /** Reserved for future lossless feature. */
  useDeltaPalette: z
    .union([z.literal(1), z.literal(0)])
    .optional()
    .default(0),
  /** If needed, use sharp (and slow) RGB->YUV conversion. */
  useSharpYuv: z
    .union([z.literal(1), z.literal(0)])
    .optional()
    .default(0),
});

export function webp() {
  return {
    mime: 'image/webp',
    hasAlpha: true,
    encode: async (bitmap, options = {}) => {
      const {
        quality,
        alphaCompression,
        alphaFiltering,
        alphaQuality,
        autoFilter,
        emulateJpegSize,
        exact,
        filterSharpness,
        filterStrength,
        filterType,
        lossless,
        method,
        lowMemory,
        nearLossless,
        useDeltaPalette,
        useSharpYuv,
        threadLevel,
        partitionLimit,
        partitions,
        pass,
        preprocessing,
        showCompressed,
        segments,
        snsStrength,
        targetPSNR,
        targetSize,
      } = WebpOptionsSchema.parse(options);
      const arrayBuffer = await WebpWasm.encode(
        {
          ...bitmap,
          data: new Uint8ClampedArray(bitmap.data),
        },
        {
          quality,
          alpha_compression: alphaCompression,
          alpha_filtering: alphaFiltering,
          alpha_quality: alphaQuality,
          autofilter: autoFilter,
          emulate_jpeg_size: emulateJpegSize,
          exact,
          filter_sharpness: filterSharpness,
          filter_strength: filterStrength,
          filter_type: filterType,
          lossless,
          method,
          low_memory: lowMemory,
          near_lossless: nearLossless,
          use_delta_palette: useDeltaPalette,
          use_sharp_yuv: useSharpYuv,
          thread_level: threadLevel,
          partition_limit: partitionLimit,
          partitions,
          pass,
          preprocessing,
          show_compressed: showCompressed,
          segments,
          sns_strength: snsStrength,
          target_PSNR: targetPSNR,
          target_size: targetSize,
        },
      );

      return Buffer.from(arrayBuffer);
    },
    decode: async data => {
      const result = await WebpWasm.decode(data);

      return {
        data: Buffer.from(result.data),
        width: result.width,
        height: result.height,
      };
    },
  };
}
