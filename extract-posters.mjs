import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { stat } from 'node:fs/promises';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

const run = promisify(execFile);
const FFMPEG = ffmpegInstaller.path;

const jobs = [
  { src: 'assets/video-demo-1.mp4', poster: 'assets/poster-1.webp', time: '00:00:02' },
  { src: 'assets/video-demo-2.mp4', poster: 'assets/poster-2.webp', time: '00:00:03' },
];

for (const { src, poster, time } of jobs) {
  const args = [
    '-y',
    '-ss', time,
    '-i', src,
    '-frames:v', '1',
    '-q:v', '2',
    '-vf', 'scale=540:-2',
    poster,
  ];
  console.log(`Extracting ${src} @ ${time} → ${poster}`);
  await run(FFMPEG, args, { maxBuffer: 1024 * 1024 * 32 });
  const size = (await stat(poster)).size;
  console.log(`  ${poster}: ${(size/1024).toFixed(1)}KB`);
}
