import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'applications';

  try {
    // APPLICATIONS REPORT - Using separate queries (no foreign keys needed)
    if (type === 'applications') {
      // Get all applications
      const { data: applications } = await supabase
        .from('scholarship_applications')
        .select('*');

      // Get all students
      const { data: students } = await supabase
        .from('students')
        .select('regno, full_name, email, level');

      // Get all scholarships
      const { data: scholarships } = await supabase
        .from('scholarships')
        .select('id, title');

      // Join manually in code
      const joinedData = applications?.map((app: any) => {
        const student = students?.find((s: any) => s.regno === app.student_regno);
        const scholarship = scholarships?.find((s: any) => s.id === app.scholarship_id);
        return {
          ...app,
          students: student || null,
          scholarships: scholarship || null,
        };
      }) || [];

      const total = joinedData?.length || 0;
      const pending = joinedData?.filter((a: any) => a.status === 'pending').length || 0;
      const approved = joinedData?.filter((a: any) => a.status === 'approved').length || 0;
      const rejected = joinedData?.filter((a: any) => a.status === 'rejected').length || 0;

      return NextResponse.json({
        applications: joinedData,
        statusCounts: { total, pending, approved, rejected },
      });
    }

    // MERIT LIST REPORT - Using separate queries
    if (type === 'merit_list') {
      // Get all merit lists
      const { data: meritLists } = await supabase
        .from('merit_lists')
        .select('*')
        .order('rank', { ascending: true });

      // Get all students
      const { data: students } = await supabase
        .from('students')
        .select('regno, full_name, email');

      // Get all scholarships
      const { data: scholarships } = await supabase
        .from('scholarships')
        .select('id, title');

      // Join manually
      const joinedData = meritLists?.map((item: any) => {
        const student = students?.find((s: any) => s.regno === item.student_regno);
        const scholarship = scholarships?.find((s: any) => s.id === item.scholarship_id);
        return {
          ...item,
          students: student || null,
          scholarships: scholarship || null,
        };
      }) || [];

      return NextResponse.json({ meritLists: joinedData });
    }

    // STUDENT WISE REPORT
    if (type === 'student_wise') {
      const { data: students } = await supabase
        .from('students')
        .select('regno, full_name, email, level');

      const { data: applications } = await supabase
        .from('scholarship_applications')
        .select('student_regno, status');

      const studentStats = students?.map((student: any) => {
        const apps = applications?.filter((a: any) => a.student_regno === student.regno) || [];
        return {
          regno: student.regno,
          full_name: student.full_name,
          email: student.email,
          level: student.level || 'N/A',
          totalApplications: apps.length,
          approved: apps.filter((a: any) => a.status === 'approved').length,
          pending: apps.filter((a: any) => a.status === 'pending').length,
          rejected: apps.filter((a: any) => a.status === 'rejected').length,
        };
      }) || [];

      return NextResponse.json({ students: studentStats });
    }

    // SCHOLARSHIP WISE REPORT
    if (type === 'scholarship_wise') {
      const { data: scholarships } = await supabase
        .from('scholarships')
        .select('*');

      const { data: applications } = await supabase
        .from('scholarship_applications')
        .select('scholarship_id, status');

      const scholarshipStats = scholarships?.map((sch: any) => {
        const apps = applications?.filter((a: any) => a.scholarship_id === sch.id) || [];
        return {
          id: sch.id,
          title: sch.title,
          deadline: sch.deadline,
          numberOfAwards: sch.number_of_awards || 0,
          totalApplications: apps.length,
          pending: apps.filter((a: any) => a.status === 'pending').length,
          approved: apps.filter((a: any) => a.status === 'approved').length,
          rejected: apps.filter((a: any) => a.status === 'rejected').length,
        };
      }) || [];

      return NextResponse.json({ scholarships: scholarshipStats });
    }

    // DATE WISE REPORT
    if (type === 'date_wise') {
      const { data: applications } = await supabase
        .from('scholarship_applications')
        .select('created_at, status')
        .order('created_at', { ascending: true });

      const monthMap = new Map();
      applications?.forEach((app: any) => {
        if (!app.created_at) return;
        const date = new Date(app.created_at);
        const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
        
        if (!monthMap.has(monthYear)) {
          monthMap.set(monthYear, { month: monthYear, applications: 0, approved: 0, pending: 0, rejected: 0 });
        }
        const monthData = monthMap.get(monthYear);
        monthData.applications++;
        if (app.status === 'approved') monthData.approved++;
        if (app.status === 'pending') monthData.pending++;
        if (app.status === 'rejected') monthData.rejected++;
      });

      return NextResponse.json({ 
        monthlyData: Array.from(monthMap.values()),
        totalApplications: applications?.length || 0,
      });
    }

    // SUMMARY REPORT
    if (type === 'summary') {
      const { count: studentCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true });
      
      const { count: scholarshipCount } = await supabase
        .from('scholarships')
        .select('*', { count: 'exact', head: true });
      
      const { data: applications } = await supabase
        .from('scholarship_applications')
        .select('status');

      const totalApps = applications?.length || 0;
      const approvedApps = applications?.filter((a: any) => a.status === 'approved').length || 0;

      return NextResponse.json({
        totalStudents: studentCount || 0,
        totalScholarships: scholarshipCount || 0,
        totalApplications: totalApps,
        approvedApplications: approvedApps,
        rejectionRate: totalApps > 0 ? Math.round(((totalApps - approvedApps) / totalApps) * 100) : 0,
      });
    }

    return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}