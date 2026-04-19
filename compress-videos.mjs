import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { stat } from 'node:fs/promises';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

const run = promisify(execFile);
const FFMPEG = ffmpegInstaller.path;

const jobs = [
  ['assets/video-demo-1-DZNPXD3m.mp4', 'assets/video-demo-1.mp4'],
  ['assets/video-demo-2-DzGzLp5Z.mp4', 'assets/video-demo-2.mp4'],
];

for (const [src, dst] of jobs) {
  const before = (await stat(src)).size;
  const args = [
    '-y',
    '-i', src,
    '-vf', 'scale=trunc(min(720\\,iw)/2)*2:trunc(ow/a/2)*2',
    '-c:v', 'libx264',
    '-preset', 'slow',
    '-crf', '28',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    '-c:a', 'aac',
    '-b:a', '96k',
    '-ac', '2',
    dst,
  ];
  console.log(`Compressing ${src}...`);
  await run(FFMPEG, args, { maxBuffer: 1024 * 1024 * 64 });
  const after = (await stat(dst)).size;
  console.log(`  ${src}: ${(before/1024/1024).toFixed(1)}MB -> ${(after/1024/1024).toFixed(1)}MB (${Math.round(after/before*100)}%)`);
}
