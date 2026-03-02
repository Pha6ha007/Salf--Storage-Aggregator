import Link from 'next/link';
import type { Box } from '@/types/warehouse';

interface BoxListProps {
  boxes: Box[];
}

export function BoxList({ boxes }: BoxListProps) {
  const sortedBoxes = [...boxes].sort((a, b) => a.pricePerMonth - b.pricePerMonth);

  if (boxes.length === 0) {
    return (
      <p className="text-gray-600 text-center py-8">
        No units available at this time.
      </p>
    );
  }

  const getStatusBadge = (status: Box['status']) => {
    const styles = {
      available: 'bg-green-100 text-green-800',
      reserved: 'bg-yellow-100 text-yellow-800',
      occupied: 'bg-red-100 text-red-800',
      maintenance: 'bg-gray-100 text-gray-800',
    };

    const labels = {
      available: 'Available',
      reserved: 'Reserved',
      occupied: 'Occupied',
      maintenance: 'Maintenance',
    };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {sortedBoxes.map((box) => (
        <div
          key={box.id}
          className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition"
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900">
                Unit {box.boxNumber}
              </h3>
              <p className="text-sm text-gray-600">{box.size}</p>
            </div>
            <div>{getStatusBadge(box.status)}</div>
          </div>

          {box.features && box.features.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {box.features.map((feature, idx) => (
                <span
                  key={idx}
                  className="inline-block px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded"
                >
                  {feature}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-gray-900">
                AED {box.pricePerMonth.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500">/month</span>
            </div>

            {box.status === 'available' && (
              <Link
                href={`/bookings/new?boxId=${box.id}`}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
              >
                Book Now
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
