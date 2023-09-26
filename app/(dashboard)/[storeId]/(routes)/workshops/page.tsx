import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import { WorkshopClient } from "./components/client";
import { WorkshopColumn } from "../workshops/components/columns";

const WorkshopPage = async ({ params }: { params: { storeId: string } }) => {
  const workshops = await prismadb.workshop.findMany({
    where: { storeId: params.storeId },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  const formatedWorkshop: WorkshopColumn[] = workshops.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    category: item.category.name,
    createdAt: format(item.createdAt, "MMMM do, YYY"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <WorkshopClient data={formatedWorkshop} />
      </div>
    </div>
  );
};

export default WorkshopPage;
