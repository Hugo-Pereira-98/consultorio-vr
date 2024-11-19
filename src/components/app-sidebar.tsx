'use client';

import {
  BookOpen,
  Bot,
  Frame,
  GalleryVerticalEnd,
  PieChart,
  Settings2,
  SquareTerminal,
} from 'lucide-react';
import * as React from 'react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { TeamSwitcher } from '@/components/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/sidebar';

const data = {
  user: {
    name: 'Hugo',
    email: 'hugo.pereira@gondolamarkets.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: '---',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
  ],
  navMain: [
    {
      title: 'Clientes',
      url: 'clientes',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'Agendamentos',
          url: 'agendamentos',
        },
        {
          title: 'Consultas',
          url: 'consultas',
        },
      ],
    },
    {
      title: 'Administrativo',
      url: 'administrativo',
      icon: Bot,
      items: [
        {
          title: 'Financeiro',
          url: 'financeiro',
        },
        {
          title: 'Estoque',
          url: 'estoque',
        },
        {
          title: 'Funcionarios',
          url: 'funcionarios',
        },
      ],
    },
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
