'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function TutorialsPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id'); // e.g. /tutorials?userId=123

  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch if userId is present
    if (id) {
      const fetchTutorials = async () => {
        try {
          const response = await fetch(`/api/tutorials?id=${id}`);
          const json = await response.json();
          
          if (json.data) {
            setTutorials(json.data);
          } else {
            // In case your API returns something like { message, data } or an error
            console.error('Unexpected response:', json);
          }
        } catch (error) {
          console.error('Error fetching tutorials:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchTutorials();
    } else {
      // If no userId is provided, we skip fetching
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return <div>Loading tutorials...</div>;
  }

  if (!tutorials || tutorials.length === 0) {
    return <div>No tutorials found for user {id}</div>;
  }

  return (
    <div className="h-full w-full bg-[#F1F2F2] p-3">
      <div className="flex flex-col items-center bg-[#FAFAFA] p-3 shadow-lg">
        <h1 className="text-5xl text-light-accent">EstiMate</h1>
        <p className="text-2xl mb-5">All Tutorials for User {id}</p>

        <ul className="space-y-2">
          {tutorials.map((tutorial) => (
            <li
              key={tutorial.id}
              className="rounded-lg bg-white p-4 shadow-md hover:shadow-lg"
            >
              <h2 className="text-xl font-semibold">{tutorial.name}</h2>
              {/* Add more tutorial details here if needed */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
