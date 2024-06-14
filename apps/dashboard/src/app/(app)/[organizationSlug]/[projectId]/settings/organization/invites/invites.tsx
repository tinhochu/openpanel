'use client';

import { Dot } from '@/components/dot';
import { TooltipComplete } from '@/components/tooltip-complete';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Widget, WidgetHead } from '@/components/widget';
import { api } from '@/trpc/client';
import { cn } from '@/utils/cn';
import { MoreHorizontalIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import type { IServiceInvite, IServiceProject } from '@openpanel/db';

import CreateInvite from './create-invite';

interface Props {
  invites: IServiceInvite[];
  projects: IServiceProject[];
}

const Invites = ({ invites, projects }: Props) => {
  return (
    <Widget>
      <WidgetHead className="flex items-center justify-between">
        <span className="title">Invites</span>
        <CreateInvite projects={projects} />
      </WidgetHead>
      <Table className="mini">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Access</TableHead>
            <TableHead>More</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invites.map((item) => {
            return <Item {...item} projects={projects} key={item.id} />;
          })}
        </TableBody>
      </Table>
    </Widget>
  );
};

interface ItemProps extends IServiceInvite {
  projects: IServiceProject[];
}

function Item({
  id,
  email,
  role,
  createdAt,
  projects,
  publicMetadata,
  status,
  organizationId,
}: ItemProps) {
  const router = useRouter();
  const access = (publicMetadata?.access ?? []) as string[];
  const revoke = api.organization.revokeInvite.useMutation({
    onSuccess() {
      toast.success(`Invite for ${email} revoked`);
      router.refresh();
    },
    onError() {
      toast.error(`Failed to revoke invite for ${email}`);
    },
  });
  return (
    <TableRow key={id}>
      <TableCell className="font-medium">{email}</TableCell>
      <TableCell>{role}</TableCell>
      <TableCell>
        <TooltipComplete content={new Date(createdAt).toLocaleString()}>
          {new Date(createdAt).toLocaleDateString()}
        </TooltipComplete>
      </TableCell>
      <TableCell className="flex items-center gap-2 capitalize">
        <Dot
          className={cn(
            status === 'accepted' && 'bg-emerald-600',
            status === 'revoked' && 'bg-red-600',
            status === 'pending' && 'bg-orange-600'
          )}
          animated={status === 'pending'}
        />
        {status}
      </TableCell>
      <TableCell>
        {access.map((id) => {
          const project = projects.find((p) => p.id === id);
          if (!project) {
            return (
              <Badge key={id} className="mr-1">
                Unknown
              </Badge>
            );
          }
          return (
            <Badge key={id} color="blue" className="mr-1">
              {project.name}
            </Badge>
          );
        })}
        {access.length === 0 && (
          <Badge variant={'secondary'}>All projects</Badge>
        )}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button icon={MoreHorizontalIcon} size="icon" variant={'outline'} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => {
                revoke.mutate({ organizationId, invitationId: id });
              }}
            >
              Revoke invite
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

export default Invites;
