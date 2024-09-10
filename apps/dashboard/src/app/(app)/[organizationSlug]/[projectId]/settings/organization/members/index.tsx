import { MembersTable } from '@/components/settings/members';

import { getMembers, getProjectsByOrganizationSlug } from '@openpanel/db';

interface Props {
  organizationId: string;
}

const MembersServer = async ({ organizationId }: Props) => {
  const [members, projects] = await Promise.all([
    getMembers(organizationId),
    getProjectsByOrganizationSlug(organizationId),
  ]);

  return <MembersTable data={members} projects={projects} />;
};

export default MembersServer;
