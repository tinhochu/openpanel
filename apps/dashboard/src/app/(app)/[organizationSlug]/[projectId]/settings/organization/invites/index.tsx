import { TableButtons } from '@/components/data-table';
import { InvitesTable } from '@/components/settings/invites';

import { getInvites, getProjectsByOrganizationSlug } from '@openpanel/db';

import CreateInvite from './create-invite';

interface Props {
  organizationId: string;
}

const InvitesServer = async ({ organizationId }: Props) => {
  const [invites, projects] = await Promise.all([
    getInvites(organizationId),
    getProjectsByOrganizationSlug(organizationId),
  ]);

  return (
    <div>
      <TableButtons>
        <CreateInvite projects={projects} />
      </TableButtons>
      <InvitesTable data={invites} projects={projects} />
    </div>
  );
};

export default InvitesServer;
