"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { WorkshopColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface WorkshopClientProps {
  data: WorkshopColumn[];
}

export const WorkshopClient: React.FC<WorkshopClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Talleres ${data.length}`}
          description="Maneja los talleres"
        />
        <Button
          onClick={() => {
            router.push(`/${params.storeId}/workshops/new`);
          }}
        >
          <Plus className="mr-2 w-4 h-4" />
          Añadir taller
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API para talleres" />
      <Separator />
      <ApiList entityName="workshops" entityIdName="workshopId" />
    </>
  );
};
