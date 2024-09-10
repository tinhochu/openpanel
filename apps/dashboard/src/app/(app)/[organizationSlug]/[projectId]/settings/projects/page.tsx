import PageLayout from '@/app/(app)/[organizationSlug]/[projectId]/page-layout';
import { Padding } from '@/components/ui/padding';

import {
  getClientsByOrganizationSlug,
  getProjectsByOrganizationSlug,
} from '@openpanel/db';

import ListProjects from './list-projects';

interface PageProps {
  params: {
    organizationId: string;
  };
}

export default async function Page({ params: { organizationId } }: PageProps) {
  const [projects, clients] = await Promise.all([
    getProjectsByOrganizationSlug(organizationId),
    getClientsByOrganizationSlug(organizationId),
  ]);

  return (
    <Padding>
      <ListProjects projects={projects} clients={clients} />
    </Padding>
  );
}
