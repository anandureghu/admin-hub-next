import { useParams } from "react-router-dom";
import { useEmployeeQuery } from "../hooks/useEmployeesQuery";

export default function EmployeeDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: employee, isLoading, error } = useEmployeeQuery(id);

  if (isLoading) return <div>Loading employee profile...</div>;
  if (error || !employee) return <div>Employee not found.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{employee.name}</h1>
      <p>Email: {employee.email}</p>
      <p>Role: {employee.role}</p>
      {/* Add more profile details here */}
    </div>
  );
}