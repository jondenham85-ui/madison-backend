export function getAudioBuffer(req) {
  if (!req.files || !req.files.audio) return null;
  return req.files.audio.data;
}
