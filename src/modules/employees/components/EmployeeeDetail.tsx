import { useNavigate, useParams } from "react-router-dom";
import { useEmployeeQuery } from "../hooks/useEmployeesQuery";
import { TripCard } from "../../trips/components/TripCard";
import { WorkSessionCard } from "../../trips/components/WorkSessionCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, Briefcase, Calendar, User, MapPin, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function EmployeeDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: employee, isLoading: empLoading } = useEmployeeQuery(id);

    if (empLoading) return <div className="p-8 space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-64 w-full" />
    </div>;

    if (!employee) return <div className="p-8 text-center">Employee not found.</div>;

    return (
        <div className="w-full h-full space-y-6 overflow-y-auto pr-4 custom-scrollbar pb-10">
            {/* Back Button */}
            <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="gap-2 text-muted-foreground hover:text-foreground -ml-2"
            >
                <ArrowLeft className="w-4 h-4" />
                Back
            </Button>

            {/* Profile Header */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    <Avatar className="w-20 h-20 border-2 border-primary/20 shadow-sm">
                        <AvatarImage
                            src={employee.avatar_url || ""}
                            alt={employee.name}
                            className="object-cover"
                        />
                        <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                            {employee.name?.split(" ").map(n => n[0]).join("").toUpperCase() || <User />}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight">{employee.name}</h1>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <Mail className="w-4 h-4" /> {employee.email}
                            </div>
                            {employee.phone && (
                                <div className="flex items-center gap-1.5">
                                    <Phone className="w-4 h-4" /> {employee.phone}
                                </div>
                            )}
                            <div className="flex items-center gap-1.5 capitalize">
                                <Briefcase className="w-4 h-4" /> {employee.role.toLowerCase()}
                            </div>
                        </div>
                    </div>

                    <div className="bg-secondary/50 px-4 py-2 rounded-lg text-left md:text-right border border-border/50">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Member Since</p>
                        <p className="text-sm font-medium">{new Date(employee.created_at).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            {/* Activity Tabs */}
            <Tabs defaultValue="trips" className="w-full">
                <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-6">
                    <TabsTrigger value="trips">Trips</TabsTrigger>
                    <TabsTrigger value="work">Work Sessions</TabsTrigger>
                </TabsList>

                <TabsContent value="trips" className="space-y-4">
                    {empLoading ? (
                        <p className="text-muted-foreground">Loading trips...</p>
                    ) : employee?.trips.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed rounded-xl">
                            <MapPin className="w-10 h-10 text-muted-foreground/50 mx-auto mb-2" />
                            <p className="text-muted-foreground">No trips recorded for this employee.</p>
                        </div>
                    ) : (
                        employee?.trips.map((trip) => (
                            <TripCard key={trip.id} trip={trip} />
                        ))
                    )}
                </TabsContent>

                <TabsContent value="work" className="space-y-4">
                    {employee?.work_sessions?.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed rounded-xl">
                            <Calendar className="w-10 h-10 text-muted-foreground/50 mx-auto mb-2" />
                            <p className="text-muted-foreground">No work sessions found.</p>
                        </div>
                    ) : (
                        employee?.work_sessions?.map((session, index) => (
                            <WorkSessionCard
                                key={session.id}
                                session={session}
                                tripId={session.trip_id}
                                index={index}
                            />
                        ))
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}