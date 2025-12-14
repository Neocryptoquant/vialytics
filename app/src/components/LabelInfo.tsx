import React from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  label?: string | null;
  address?: string | null;
};

export const LabelInfo: React.FC<Props> = ({ open, onClose, label, address }) => {
  if (!open) return null;

  const description = label && label !== (address || '')
    ? `${label} — known label from on-chain metadata or heuristics.`
    : 'This is a wallet or program address. Click "View on Orb" to inspect details (transactions, tokens, labels).';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="bg-white p-6 rounded-lg shadow-lg w-[420px] z-10">
        <h3 className="text-lg font-semibold">{label || 'Address details'}</h3>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
        {address && (
          <div className="mt-4 text-sm">
            <div className="text-slate-700 font-medium">Address</div>
            <div className="text-slate-500 break-all">{address}</div>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <a href={`https://orb.helius.dev/address/${address}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1 rounded bg-slate-100 text-sm hover:bg-slate-200">View on Orb</a>
          <button onClick={onClose} className="px-3 py-1 rounded bg-purple-600 text-white text-sm">Close</button>
        </div>
      </div>
    </div>
  );
};

export default LabelInfo;
