import { Info } from 'lucide-react';
import { getMeta } from '@/services/transporte';

export function AvisoDemo() {
  const meta = getMeta();
  return (
    <div role="note" className="flex gap-3 rounded-2xl border border-brand/20 bg-brand-soft/40 p-4 text-sm text-ink">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
      <div className="space-y-1">
        <p>
          <strong className="font-semibold">Fonte:</strong> {meta.fonteDados}.
        </p>
        <p className="text-muted">{meta.aviso}</p>
      </div>
    </div>
  );
}
