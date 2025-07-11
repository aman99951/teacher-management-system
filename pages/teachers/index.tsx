import Layout from '@/components/Layout';
import TeacherTable from '@/components/TeacherTable';
import { useEffect, useState } from 'react';
import { getTeachers, togglePaymentStatus } from '@/lib/storage';
import { Teacher } from '@/types/Teacher';
import Loader from '@/components/Loader';
import Link from 'next/link';

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[] | null>(null);

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = () => {
    setTeachers(getTeachers());
  };

  const handleStatusChange = (id: string) => {
    togglePaymentStatus(id);
    loadTeachers();
  };

  return (
    <Layout>
      <section className="max-w-6xl mx-auto px-4 py-6">
       

        {/* Conditional rendering */}
        {teachers === null ? (
          <Loader />
        ) : teachers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-gray-500 text-lg mb-4">No teachers added yet.</p>
            <Link
              href="/teachers/add"
              className="text-blue-600 font-medium hover:underline"
            >
              Add your first teacher
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow-md">
            <TeacherTable teachers={teachers} onStatusChange={handleStatusChange} />
          </div>
        )}
      </section>
    </Layout>
  );
}
