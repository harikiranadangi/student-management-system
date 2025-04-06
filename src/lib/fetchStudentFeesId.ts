export async function fetchStudentFeesId(studentId: string, term: string) {
    const res = await fetch(`/api/studentFees/${studentId}/${term}`);
    const data = await res.json();
  
    if (!res.ok) {
      throw new Error(data.error || 'Failed to fetch student fees ID');
    }
  
    return data.studentFeesId; // ✅ Correct ID
  }
  