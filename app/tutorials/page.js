import { Suspense } from 'react';
import TutorialsContent from './TutorialsContent';

export const dynamic = 'force-dynamic'; // Disable static prerendering

export default function TutorialsPage() {
  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <TutorialsContent />
    </Suspense>
  );
}