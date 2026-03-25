import {
  IconChevronDown,
  IconPlus,
  IconUpload,
  IconFileText,
  IconCircleCheck,
  IconAlertTriangle,
  IconClockX,
  IconFolderOpen
} from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import { ButtonGroup } from "@workspace/ui/components/button-group";
import { StatCard } from "@/shared/components/stat-card";
import { FoldersPanel } from "./_components/folders-panel";
import { DocumentsTable } from "./_components/documents-table";
import { PageHeader } from "../_components/page-header";

export default function DocumentsPage() {
  return (
    <section className="space-y-3 w-full">
      <PageHeader
        title="Documents"
        description="Manage HR documents, contracts and certifications across all sites">
        <ButtonGroup>
          <Button size="lg" variant="default">
            <IconPlus />
            Upload a document
          </Button>
          <Button size="icon-lg" variant="default">
            <IconChevronDown />
          </Button>
        </ButtonGroup>
      </PageHeader>

      <section className="p-4 space-y-4">
        {/* Stat cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard title="Total Documents" value="148" icon={IconFileText} color="var(--primary)" />
          <StatCard title="Active / Valid" value="112" icon={IconCircleCheck} color="var(--chart-2)" />
          <StatCard title="Expiring Soon" value="14" icon={IconAlertTriangle} color="var(--chart-3)" />
          <StatCard title="Expired" value="22" icon={IconClockX} color="var(--destructive)" />
        </div>

        {/* Main content */}
        <article className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-4">
          <article className="space-y-4">
            <div className="flex flex-col items-center justify-center gap-2 rounded border border-dashed border-border py-8 text-center">
              <IconUpload className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Upload Document</p>
                <p className="text-xs text-muted-foreground">Drag and drop files here, or browse to upload</p>
              </div>
              <Button size="sm" variant="outline" className="mt-1">
                Browse Files
                <IconFolderOpen />
              </Button>
            </div>
            <FoldersPanel />
          </article>
          <DocumentsTable />
        </article>
      </section>
    </section>
  );
}
