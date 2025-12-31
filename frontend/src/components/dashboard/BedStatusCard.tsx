import { BedDouble, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ICUBed } from '@/data/mockData';

interface BedStatusCardProps {
  bed: ICUBed;
  patientName?: string;
}

export function BedStatusCard({ bed, patientName }: BedStatusCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-xl border p-4 transition-all duration-300 hover:shadow-md',
        bed.isOccupied
          ? 'border-primary/20 bg-primary/5'
          : 'border-status-normal/20 bg-status-normal-bg'
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-foreground">{bed.bedNumber}</span>
        <div
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-lg',
            bed.isOccupied ? 'bg-primary/10' : 'bg-status-normal/10'
          )}
        >
          {bed.isOccupied ? (
            <User className="h-4 w-4 text-primary" />
          ) : (
            <BedDouble className="h-4 w-4 text-status-normal" />
          )}
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground mb-1">{bed.ward}</p>
      
      {bed.isOccupied && patientName ? (
        <p className="text-xs font-medium text-primary truncate">{patientName}</p>
      ) : (
        <p className="text-xs font-medium text-status-normal">Available</p>
      )}
    </div>
  );
}
