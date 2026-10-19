import { useRef, useState } from 'react';
import { Loader2, UploadCloud } from 'lucide-react';
import { uploadMedia } from '../services/api';

/**
 * Click-or-drop zone that uploads one file and reports `{ url, type, name }` via `onUploaded`.
 * `previewUrl`/`previewType` show the currently selected media inside the zone.
 */
export default function MediaUpload({ accept = 'image/*', hint, previewUrl, previewType = 'image', onUploaded, onError }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);

  const handleFile = async (file) => {
    if (!file || busy) return;
    setBusy(true);
    try {
      const result = await uploadMedia(file);
      onUploaded({ ...result, name: file.name.replace(/\.[^.]+$/, '') });
    } catch (err) {
      onError?.(err);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div
      className={`dropzone ${dragging ? 'dropzone--active' : ''} ${previewUrl ? 'dropzone--filled' : ''}`}
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click(); } }}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      aria-busy={busy}
    >
      <input ref={inputRef} type="file" accept={accept} hidden onChange={(e) => handleFile(e.target.files?.[0])} />
      {previewUrl && (previewType === 'video'
        ? <video className="dropzone__preview" src={previewUrl} muted preload="metadata" />
        : <img className="dropzone__preview" src={previewUrl} alt="" />)}
      <div className="dropzone__body">
        {busy ? <Loader2 size={22} className="spin" /> : <UploadCloud size={22} />}
        <strong>{busy ? 'Envoi en cours…' : previewUrl ? 'Remplacer le fichier' : 'Glisser un fichier ou cliquer'}</strong>
        {hint && !busy && <small>{hint}</small>}
      </div>
    </div>
  );
}
